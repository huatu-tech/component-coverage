const Service = require('egg').Service;
class SiteService extends Service {
  async list() {
    const result = await this.app.mysql.query('select * from statistics_site');
    return result;
  }
  async add(site) {
    const result = await this.app.mysql.insert('statistics_site', { site });
    return result;
  }
  async del(id) {
    const result = await this.app.mysql.delete('statistics_site', { id });
    return result;
  }
  async update(id, site) {
    const result = await this.app.mysql.update('statistics_site', { id, site });
    return result;
  }
  async query(id) {
    const result = await this.app.mysql.query(`select * from statistics_site where id = ${id}`);
    return result;
  }
}
module.exports = SiteService;
