const Subscription = require('egg').Subscription;
const exporter = require('highcharts-export-server');

class WeeklyMail extends Subscription {

  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      cron: '0 32 16 * * *', type: 'all', // 指定所有的 worker 都需要执行    };
    }
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    let ctx = this.ctx;
    // Initialize export settings with your chart's config
    // Export settings correspond to the available CLI arguments described above.
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

    // Set the new options and merge it with the default options
    const options = exporter.setOptions(exportSettings);

    // Initialize a pool of workers
    await exporter.initPool(options);

    // Perform an export
    exporter.startExport(exportSettings, async function (res, err) {
      console.log('Exporting finished.', res.data);
      // data:image/png;base64,res.data
      // The export result is now in res.
      // It will be base64 encoded (res.data).

      // Kill the pool when we're done with it.

      // 获取mail信息
      const mailInfo = await ctx.curl('http://127.0.0.1:7001/mail/index', {
        dataType: 'json',
      });
      // // 获取数据
      // const res = await ctx.curl('http://127.0.0.1:7001/site/list', {
      //   dataType: 'json',
      // });

      if (res.data && mailInfo) {
        const data = res.data || []
        const info = await ctx.service.mail.weekly(data, mailInfo.data.data[0]);
        console.log('发送成功', info);
      }
      exporter.killPool();
    });

  }
}

module.exports = WeeklyMail;
