import { componentStatic } from './../utils/statistics';
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
      cron: '0 47 11 ? * *',
      type: 'all', // 指定所有的 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    // const res = await this.ctx.curl(`${Sites['beta-mobile-screen']}/count.js?time=${timestamp}`, {
    //   dataType: 'json',
    // });
    const { data } = await this.ctx.curl('http://localhost:7001/site/list', {
      dataType: 'json',
    });
    const sites = data.data;
    const timestamp = Date.now();
    for (const site of sites) {
      const res = await this.ctx.curl(`${site.site}/count.js?time=${timestamp}`, {
        dataType: 'json',
      });

      const staticDate = await componentStatic(site, res);
      const result = await this.ctx.app.mysql.insert('components_coverage', { ...staticDate }); // 在 post 表中，插入 title 为 Hello World 的记录

      // let static = componentStatic(site,res)
      // const result = await this.ctx.app.mysql.insert('components_coverage', { date: timestamp, project: site.name, components_count: res.data.components_count, components_coverage_count: res.data.components_coverage_count, components_times: res.data.components_times, pages_count: res.data.pages_count, pages_coverage_count: res.data.pages_coverage_count, pages_times: res.data.pages_times }); // 在 post 表中，插入 title 为 Hello World 的记录

      console.log(result);
    }
  }
}

module.exports = UpdateCache;
