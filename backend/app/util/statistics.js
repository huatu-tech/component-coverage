

 const ComponentStatic = (site, data) => {
  const components = Object.keys(data).splice(0, Object.keys(data).length - 3);
  // 获取年-月-日
  const toDayStr = () => {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    let seperator = "-";
    if(month >= 1 && month <= 9) {
      month = '0' + month;
    }
    if(strDate >= 0 && strDate <= 9) {
      strDate = '0' + strDate;
    }
    let currentdate = year + seperator + month + seperator + strDate;
    return currentdate;
  }
  const dayStr = toDayStr();
  let detail = [];
  const staticDate = components.map(item => {
    const cmp = data[item];
    const coverage = cmp.coverage;
    const pagesTimes = cmp.pages.reduce((total, item) => total + item.pos.length, 0);
    const componentsTimes = cmp.components.reduce((total, item) => total + item.pos.length, 0);
    detail.push({
      date: dayStr,
      component: String(item),
      project_id: String(site.id),
      components_coverage_count: coverage.components,
      pages_coverage_count:  coverage.pages,
      components_coverage: JSON.stringify(cmp.components),
      pages_coverage: JSON.stringify(cmp.pages),
      components_times: componentsTimes,
      pages_times: pagesTimes,
      version: data.version,
    });
    return {
      date: dayStr,
      component: String(item),
      project_id: String(site.id),
      components_coverage_count: coverage.components,
      pages_coverage_count:  coverage.pages,
      components_count: data.componentsCount,
      pages_count: data.pagesCount,
      components_times: componentsTimes,
      pages_times: pagesTimes,
      version: data.version,
    };
  });
  return {
    staticDate,
    detail,
  };
};

module.exports = {
  ComponentStatic,
}
