const fs = require('fs')
const path = require('path')
const { join } = require('path')
const http = require('http')

const options = {
    hostname: '172.30.9.183', // 请求的主机名
    port: 3000,                     // 请求的端口号
    path: '/componentList',         // 请求的路径
    method: 'GET'                  // 请求的方法
}

// 监测字符串中如果有大写字母，就把它转换成小写字母，并在前面加上一个连字符
function hyphenate(str) {
    return str.replace(/\B([A-Z])/g, '-$1').toLowerCase()
}

// 获取文件匹配字符串的次数 第几行 第几列
function getPos(str, matchStr, fPath, maxLoop) {
    const arr = str.split('\n')
    let pos = []
    for (let i = 0; i < arr.length; i++) {
        const index = arr[i].indexOf(matchStr)
        if (index > -1) {
            pos.push({ line: i + 1, column: index + 1 })
            if (pos.length === maxLoop) {
                break
            }
        }
    }
    // 截取fPath，只保留src目录下的路径
    const index = fPath.indexOf('src')
    const fPathLen = fPath.length
    const fPathStr = fPath.slice(index, fPathLen)
    return { fPath: fPathStr, pos }
}

const count = {}
let componentsCount = 0
let pagesCount = 0
let version = require('./package.json').dependencies['htoolkit']
// 递归统计每个组件在src目录下的vue文件中出现次数和位置
function getComponentCount(path, componentList) {
    const files = fs.readdirSync(path)
    files.forEach((file) => {
        const fPath = join(path, file)
        let isComponent = fPath.includes('components')
        const stat = fs.statSync(fPath)
        if (stat.isDirectory()) {
            let str = isComponent ? 'components' : 'pages'
            const obj = getComponentCount(fPath, componentList)
            Object.keys(obj).forEach((key) => {
                if (count[key]) {
                    count[key][str].concat(obj[key][str])
                } else {
                    Object.assign(count[key], obj[key])
                }
            })
        } else {
            if (!fPath.endsWith('.vue')) return
            isComponent ? componentsCount++ : pagesCount++
            // 通过“fPath”判断是否是组件
            const content = fs.readFileSync(fPath, 'utf8')
            componentList.forEach((component) => {
                const reg = new RegExp(`<${hyphenate(component)}`, 'g')
                const match = content.match(reg)
                if (match) {
                    let str = isComponent ? 'components' : 'pages'
                    let posInfo = getPos(content, `<${hyphenate(component)}`, fPath, match.length)
                    if (count[component] && count[component][str]) {
                        count[component][str].push(posInfo)
                    } else {
                        count[component] = {
                            components: [],
                            pages: [],
                        }
                        count[component][str].push(posInfo)
                    }
                }
            })
        }
    })
    return count
}

const req = http.request(options, (res) => {
    console.log(`状态码：${res.statusCode}`)
    console.log('响应头：', res.headers)

    res.on('data', (res) => {
        let { data } = JSON.parse(res.toString())
        console.log('组件列表：', data)
        const count = getComponentCount(path.resolve(__dirname, 'src'), data)
        Object.keys(count).forEach((key) => {
            count[key]['coverage'] = {
                'components': count[key]['components'].length,
                'pages': count[key]['pages'].length,
            }
        })
        // 输出count，新建文件count.json
        fs.writeFile('public/count.js', JSON.stringify(Object.assign(count, { componentsCount, pagesCount, version })), (err) => {
            if (err) {
                console.log(err)
            }
        })
    })
})

req.on('error', (error) => {
    console.error('请求错误：', error)
})

req.end()
