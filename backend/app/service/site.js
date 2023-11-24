const Service = require('egg').Service;
class SiteService extends Service {
  async list(current,pageSize,extraFilter) {
    let whereFilter = {};
    for (const key in extraFilter) {
      if (extraFilter[key])
        whereFilter[key] = extraFilter[key];
    }
    const result = await this.app.mysql.select('statistics_site',{
      where: { ...whereFilter }, // WHERE 条件
      limit: pageSize, // 返回数据量
      offset: (current-1)*pageSize, // 数据偏移量
    });
    return result;
  }
  async add(siteObj) {
    let {name,site,environment} = siteObj;
    const repeat = await this.list(1,10,{ name,site,environment });
    if (repeat.length) {
      return Error('已存在相同的项目');
    }
    const result = await this.app.mysql.insert('statistics_site', { ...siteObj, date: Date.now() });
    return result;
  }
  async del(ids) {
    const result = await this.app.mysql.delete('statistics_site', { 'id': ids }, { where: 'IN' });
    return result;
  }
  async update(row) {
    let {id, index, ...sites} = row;
    let {name,site,environment} = sites;
    const repeat = await this.list(1,10,{ name,site,environment });
    console.log('repeat', repeat);
    if (repeat.length) {
      return Error('已存在相同的项目');
    }
    const options = {
      where: {
        id
      }
    };
    const result = await this.app.mysql.update('statistics_site', { ...sites }, options);
    return result;
  }
  async query(id) {
    const result = await this.app.mysql.query(`select * from statistics_site where id = ${id}`);
    return result;
  }
}
module.exports = SiteService;
