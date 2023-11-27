const Service = require('egg').Service;
class StatisticsService extends Service {
  async list() {
    let collect = { componentTimes: 0, pageTimes: 0, componentCount: 0, pageCount: 0 }
    let siteCount = {}
    //获取今天3点时间戳
    const today = new Date();
    today.setHours(3, 0, 0, 0);
    const startDate = today.getTime();
    //获取今天23点59分59秒的时间戳
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    const endDate = todayEnd.getTime();
    //获取当天抓取的组件统计数据
    const componentsCollectData = await this.app.mysql.query(`SELECT * FROM components_coverage WHERE date BETWEEN '${startDate}' AND '${endDate}'`);
    //获取组件列表
    const componentsList = await this.app.mysql.select('components');
    //获取接入的项目列表
    const sitesList = await this.app.mysql.select('statistics_site');
    for (let index = 0; index < componentsCollectData.length; index++) {
      const element = componentsCollectData[index];
      if(!siteCount[element.project]){
        siteCount[element.project] = true
        collect['componentCount']+= element.components_count;
        collect['pageCount']+= element.pages_count;
      }
      collect.componentTimes += element.components_times;
      collect.pageTimes += element.pages_times;
    }
    return {
      ...collect,
      componentsList: componentsList,
      siteCount: sitesList.length,
    };
  }
  async rank(rankType){
    const result = await this.app.mysql.query(`SELECT * FROM components_coverage ORDER BY ${rankType == 1 ? 'pages_times' : 'components_times'} DESC LIMIT 10`);
    return result;
  }
}
module.exports = StatisticsService;
