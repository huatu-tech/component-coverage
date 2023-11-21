const ComponentStatic = require('./../util/statistics.js').ComponentStatic;
const Subscription = require('egg').Subscription;
const Sites = {
  // 'mobile-screen': 'https://mobile-screen.huatu.com',
  'beta-mobile-screen': 'https://beta-mobile-screen.huatu.com',
  // 'beta-screen-manager': 'https://beta-screen-manager.huatu.com'
  // 'test-screen-manager': 'https://test-screen-manager.huatu.com'
};

class UpdateCache extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      // 每日3点准点执行一次：'0 0 3 ? * *'
      cron: '0 10 11 ? * *',
      type: 'all', // 指定所有的 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const { data } = await this.ctx.curl('http://localhost:7001/site/list', {
      dataType: 'json',
    });
    const sites = data.data;
    const timestamp = Date.now();
    for (const site of sites) {
      const res = await this.ctx.curl(`${site.site}/count.js?time=${timestamp}`, {
        dataType: 'json',
      });
      const staticDate = await ComponentStatic(site, res.data);
      const result = await this.ctx.app.mysql.insert('components_coverage',staticDate);
    }
  }
}

module.exports = UpdateCache;
