const Subscription = require('egg').Subscription;

class SeedMail extends Subscription {

  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      cron: '0 46 13 * * *', type: 'all', // 指定所有的 worker 都需要执行    };
    }
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
      const res = await this.ctx.curl('http://127.0.0.1:7001/site/list', {
        dataType: 'json',
      });

      if (res) {
        const data = res.data || []
        const info = await this.ctx.service.mail.send(data);
        console.log('发送成功', info);
      }
  }
}

module.exports = SeedMail;
