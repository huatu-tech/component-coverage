const Service = require('egg').Service;
class ComponentService extends Service {
  async list(current,pageSize,extraFilter) {
    let whereFilter = {};
    for (const key in extraFilter) {
      if (extraFilter[key])
        whereFilter[key] = extraFilter[key];
    }
    const result = await this.app.mysql.select('components',{
      where: { ...whereFilter }, // WHERE 条件
      limit: pageSize, // 返回数据量
      offset: (current-1)*pageSize, // 数据偏移量
    });
    return result;
  }
  async add(siteObj) {
    let {name} = siteObj;
    const repeat = await this.list(1,10,{ name });
    if (repeat.length) {
      return Error('已存在相同的组件');
    }
    const result = await this.app.mysql.insert('components', { ...siteObj, date: Date.now() });
    return result;
  }
  async del(ids) {
    const result = await this.app.mysql.delete('components', { 'id': ids }, { where: 'IN' });
    return result;
  }
  async update(row) {
    let {id, index, ...sites} = row;
    let {name} = sites;
    const repeat = await this.list(1,10,{ name });
    console.log('repeat', repeat);
    if (repeat.length && repeat[0].id !== id) {
      return Error('已存在相同的组件');
    }
    const options = {
      where: {
        id
      }
    };
    const result = await this.app.mysql.update('components', { ...sites }, options);
    return result;
  }
  async query(id) {
    const result = await this.app.mysql.query(`select * from components where id = ${id}`);
    return result;
  }

  async detail({name, project, date, type}) {
    const result = await this.app.mysql.select('components_coverage_detail',{
      where: { component:name, project, date }, // WHERE 条件
    });
    console.log('result', result);
    // type : page component
    switch (type) {
      case 'page':
        return result.map(element => {
          const {pages_coverage, components_coverage, ...other} = element;
          return Object.assign({...other}, {coverage: JSON.parse(element.pages_coverage)});
        });
      case 'component':
        return result.map(element => {
          const {pages_coverage, components_coverage, ...other} = element;
          return Object.assign({...other}, {coverage: JSON.parse(element.components_coverage)});
        });
      default:
        return result;
    }
  }
}
module.exports = ComponentService;
