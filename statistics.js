const https = require('https')
const fs = require('fs')
const { eachLimit } = require('async')

const sites = {
    // 'mobile-screen': 'https://mobile-screen.huatu.com',
    'beta-mobile-screen': 'https://beta-mobile-screen.huatu.com',
    // 'beta-screen-manager': 'https://beta-screen-manager.huatu.com'
    // 'test-screen-manager': 'https://test-screen-manager.huatu.com'
}
let results = []
// 汇总数据
let totalData = {}
let applications = Object.keys(sites)

https.globalAgent.maxSockets = 1

eachLimit(Object.values(sites), 5, (site, callback) => {
    const timestamp = Date.now()
    // Content-Length: Buffer.byteLength(data, 'utf8')
    https.get(`${site}/count.js?time=${timestamp}`, (res) => {
        res.on('data', (chunk) => {
            results.push(JSON.parse(chunk))
            mergeObj(totalData, JSON.parse(chunk))
        })
        res.on('end', () => {
            if (results.length === Object.values(sites).length) {
                // eslint-disable-next-line max-nested-callbacks
                let usage = mergeArr(applications, results)
                // 输出count，新建文件count.json
                // eslint-disable-next-line max-nested-callbacks
                fs.writeFile('usage.json', JSON.stringify(usage), (err) => {
                    if (err) {
                        console.log(err)
                    }
                })
                // eslint-disable-next-line max-nested-callbacks
                fs.writeFile('total.json', JSON.stringify(totalData), (err) => {
                    if (err) {
                        console.log(err)
                    }
                })
            }
            callback()
        })

    }).on('error', (err) => {
        console.log('Error: ' + err.message)
        callback(err)
    })
})
// {
//     component1:{
//         components: [],
//         pages: [],
//         coverage: {
//             components: '100%',
//             pages: '100%'
//         }
//     },
//     }
// }
function mergeObj(obj1, obj2) {
    Object.keys(obj2).forEach((key) => {
        if (obj1[key]) {
            obj1[key].components = obj1[key].components.concat(obj2[key].components)
            obj1[key].pages = obj1[key].pages.concat(obj2[key].pages)
        } else {
            obj1[key] = obj2[key]
        }
    })
    return obj1
}

// 通过索引把2个数组合并为对象
// {
//     app1: {
//         components: [],
//         pages: [],
//         coverage: {
//             components: '100%',
//             pages: '100%'
//         }
//     },
//   }
// }
function mergeArr(arr1, arr2) {
    let obj = {}
    arr1.forEach((item, index) => {
        obj[item] = arr2[index]
    })
    return obj
}
