

 const ComponentStatic = (site, data) => {
  const components = Object.keys(data).splice(0, Object.keys(data).length - 2);
  const timestamp = Date.now();
  let detail = [];
  const staticDate = components.map(item => {
    const cmp = data[item];
    const coverage = cmp.coverage;
    const pagesTimes = cmp.pages.reduce((total, item) => total + item.pos.length, 0);
    const componentsTimes = cmp.components.reduce((total, item) => total + item.pos.length, 0);
    detail.push({
      date: timestamp,
      component: String(item),
      project: String(site.site),
      components_coverage_count: coverage.components,
      pages_coverage_count:  coverage.pages,
      components_coverage: JSON.stringify(cmp.components),
      pages_coverage: JSON.stringify(cmp.pages),
      components_times: componentsTimes,
      pages_times: pagesTimes,
    });
    return {
      date: timestamp,
      component: String(item),
      project: String(site.site),
      components_coverage_count: coverage.components,
      pages_coverage_count:  coverage.pages,
      components_count: data.componentsCount,
      pages_count: data.pagesCount,
      components_times: componentsTimes,
      pages_times: pagesTimes,
    };
  });
  return {
    staticDate,
    detail,
  };
};

module.exports = {
  ComponentStatic
}
