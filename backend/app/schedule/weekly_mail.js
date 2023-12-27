const Subscription = require('egg').Subscription;
const exporter = require('highcharts-export-server');

class WeeklyMail extends Subscription {

  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  // 0 0 10 ? * FRI 每个星期五上午10:00触发
  static get schedule() {
    return {
      cron: '0 32 16 * * *', type: 'all', // 指定所有的 worker 都需要执行    };
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
    });
    // Initialize export settings with your chart's config
    // Export settings correspond to the available CLI arguments described above.

    //   Highcharts.chart('container', {
    //     chart: {
    //         type: 'column'
    //     },
    //     title: {
    //         text: `${dateArr[0]}-${dateArr[4]}调用次数统计`,
    //     },
    //     xAxis: {
    //         categories: dateArr
    //     },
    //     plotOptions: {
    //         column: {
    //             stacking: 'percent',
    //             dataLabels: {
    //                 enabled: true,
    //             }
    //         }
    //     },
    //     series: [{
    //         name: '页面',
    //         data: [434, 290, 307]
    //     }, {
    //         name: '组件',
    //         data: [272, 153, 156]
    //     }]
    // });


    const exportSettings = {
      export: {
        type: 'svg',
        options: {
          title: {
            text: `调用次数统计`
          },
          xAxis: {
            categories: ["Jan", "Feb", "Mar", "Apr"]
          },
          series: [
            {
              type: 'bar',
              data: [1, 3, 2, 4]
            },
            {
              type: 'bar',
              data: [5, 3, 4, 2]
            }
          ]
        }
      }
    };

    //组合数据
    let pmsArr = siteList.data.data.map(async (item) => {
      const filterData = weeklyData.data.data.filter((element) => {
        return element.project_id === item.id;
      });
      return new Promise(async (resolve, reject) => {

        // Set the new options and merge it with the default options
        const options = exporter.setOptions(exportSettings);

        // Initialize a pool of workers
        await exporter.initPool(options);

        // Perform an export
        exporter.startExport(exportSettings, async function (res, err) {
          resolve(res.data);
          exporter.killPool();
        });
      });
    })

    let base64Res = await Promise.all(pmsArr)

    if (res.data && mailInfo) {
      const data = res.data || []
      const info = await ctx.service.mail.weekly(data, mailInfo.data.data[0]);
      console.log('发送成功', info);
    }
  }
}

module.exports = WeeklyMail;
