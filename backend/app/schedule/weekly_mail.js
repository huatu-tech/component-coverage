const Subscription = require('egg').Subscription;
// const generateSvg = require('../util/generateSvg');
const exporter = require('highcharts-export-server');
class WeeklyMail extends Subscription {

  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  // 0 0 10 ? * FRI 每个星期五上午10:00触发
  static get schedule() {
    return {
      cron: '0 45 20 * * *', type: 'all', // 指定所有的 worker 都需要执行    };
    }
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    let ctx = this.ctx;
    // 获取项目列表数据
    const siteList = await ctx.curl('http://127.0.0.1:7001/site/list', {
      dataType: 'json',
    });
    // 生成上周一到周五的日期Array yyyy-MM-dd
    const gerantDate = () => {
      let arr = [];
      let date = new Date();
      let day = date.getDay();
      let oneDayTime = 24 * 60 * 60 * 1000;
      let MondayTime = date.getTime() - (day - 1) * oneDayTime;
      let SundayTime = date.getTime() + (7 - day) * oneDayTime;
      for (let i = MondayTime; i < SundayTime; i += oneDayTime) {
        let time = this.app.formateDate(new Date(i), 'yyyy-MM-dd');
        arr.push(time);
      }
      return arr;
    }
    let dateArr = gerantDate();

    // 获取mail信息
    const mailInfo = await ctx.curl('http://127.0.0.1:7001/mail/index', {
      dataType: 'json',
    });
    // 获取周报数据
    const weeklyData = await ctx.curl('http://127.0.0.1:7001/component/weekly', {
      dataType: 'json',
      data: {
        start: dateArr[0],
        end: dateArr[4],
      },
    });

    const gerrantData = (data, name) => {
      let categories = [];
      let data0 = [];
      let data1 = [];
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        let date = String(item.date);
        if (categories.includes(date)) {
          data0[categories.indexOf(date)] += item.pages_count;
          data1[categories.indexOf(date)] += item.components_count;
        } else {
          categories.push(date);
          data0.push(item.pages_count);
          data1.push(item.components_count);
        }
      }
      return {
        export: {
          type: 'svg',
          options: {
            title: {
              text: `${name} ${dateArr[0]}至${dateArr[4]}调用次数统计`
            },
            xAxis: {
              categories: categories,
            },
            series: [
              {
                type: 'bar',
                name: '页面',
                data: data0
              },
              {
                type: 'bar',
                name: '组件',
                data: data1
              }
            ]
          }
        }
      }
    }
    // Set options
    const options = exporter.setOptions({
      logging: {
        level: 0
      }
    });

    // Initialize pool with disabled logging
    await exporter.initPool(options);


    //组合数据
    let pmsArr = await siteList.data.data.map(async (item) => {
      return new Promise(async (resolve, reject) => {
        try {
          const filterData = weeklyData.data.data.filter((element) => {
            return element.project_id === item.id;
          });
          let newOptions = await gerrantData(filterData, item.name)
          console.log('newOptions', JSON.stringify(newOptions));
          // Set the new options and merge it with the default options
          // const options = exporter.setOptions(newOptions);

          // // Initialize a pool of workers
          // await exporter.initPool(options);

          // Perform an export
          exporter.startExport(newOptions, async function (res, err) {
            console.log('+++++++++++++++', res);
            return resolve(res.data)
          });
        } catch (error) {
          reject(`Error thrown: ${error}`);
        }
      })
    })

    try {
      // Await all exports
      const base64Res = await Promise.all(pmsArr)
      if (base64Res && base64Res.length && mailInfo) {
        const info = await ctx.service.mail.weekly(base64Res, mailInfo.data.data[0], dateArr);
        console.log('发送成功', info);
      } else {
        console.log('暂无数据，取消发送');
      }
    } catch (error) {
      console.log(`Something went wrong!, ${error}`);
      process.exit(1);
    }
    await exporter.killPool();
  }
}

module.exports = WeeklyMail;
