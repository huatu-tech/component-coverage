const ComponentStatic = require('./../util/statistics.js').ComponentStatic;
const Subscription = require('egg').Subscription;
class UpdateCache extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      // 每日3点准点执行一次：'0 0 3 ? * *'
      cron: '0 17 11 ? * *',
      type: 'all', // 指定所有的 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const { data } = await this.ctx.curl('http://127.0.0.1:7001/site/list', {
      dataType: 'json',
    });
    const sites = data.data;
    const timestamp = Date.now();
    for (const site of sites) {
      const res = await this.ctx.curl(`${site.site}/count.js?time=${timestamp}`, {
        dataType: 'json',
      });
      if(res.data){
        const {staticDate, detail} = await ComponentStatic(site, res.data);
        const result2 = await this.ctx.app.mysql.insert('components_coverage_detail',detail);
        let startid  = result2.insertId;
        staticDate.forEach((item,index)=>{
          item.detail_id = startid + index;
        })
        const result1 = await this.ctx.app.mysql.insert('components_coverage',staticDate);
        console.log(result1);
      }
    }
  }
}

module.exports = UpdateCache;
