const Service = require('egg').Service;
class ComponentService extends Service {
  async list(current, pageSize, extraFilter) {
    let whereFilter = {};
    for (const key in extraFilter) {
      if (extraFilter[key])
        whereFilter[key] = extraFilter[key];
    }
    const result = await this.app.mysql.select('components', {
      where: { ...whereFilter }, // WHERE 条件
      limit: pageSize, // 返回数据量
      offset: (current - 1) * pageSize, // 数据偏移量
    });
    return result;
  }
  async add(siteObj) {
    let { name } = siteObj;
    const repeat = await this.list(1, 10, { name });
    if (repeat.length) {
      return Error('已存在相同的组件');
    }
    const today = this.app.formateDate(new Date());
    const result = await this.app.mysql.insert('components', { ...siteObj, date: today });
    return result;
  }
  async del(ids) {
    const result = await this.app.mysql.delete('components', { 'id': ids }, { where: 'IN' });
    return result;
  }
  async update(row) {
    let { id, index, ...sites } = row;
    let { name } = sites;
    const repeat = await this.list(1, 10, { name });
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

  async detail({ name, project_id, date, type }) {
    const result = await this.app.mysql.select('components_coverage_detail', {
      where: { component: name, project_id, date }, // WHERE 条件
    });
    // type : page component
    switch (type) {
      case 'page':
        return result.map(element => {
          const { pages_coverage, components_coverage, ...other } = element;
          return Object.assign({ ...other }, { coverage: JSON.parse(element.pages_coverage) });
        });
      case 'component':
        return result.map(element => {
          const { pages_coverage, components_coverage, ...other } = element;
          return Object.assign({ ...other }, { coverage: JSON.parse(element.components_coverage) });
        });
      default:
        return result;
    }
  }

  async useInfo({ component, project, start, end }) {
    const startStr = this.app.formateDate(new Date(start), 'yyyy-MM-dd');
    const endStr = this.app.formateDate(new Date(end), 'yyyy-MM-dd');
    let componentStr = component ? `and component = '${component}'` : '';
    const result = await this.app.mysql.query(`select * from components_coverage where date between '${startStr}' and '${endStr}' ${componentStr} and project = '${project}'`);
    let arr = result.map(element => {
      const { date, components_coverage_count, pages_coverage_count} = element;
      let datestr = this.app.formateDate(new Date(date), 'yyyy-MM-dd')
      return [{
        date:datestr,
        type: '组件文件',
        value: components_coverage_count,
      }, {
        date:datestr,
        type: '页面文件',
        value: pages_coverage_count,
      }]
    });
    return arr.flat()
  }
}
module.exports = ComponentService;
