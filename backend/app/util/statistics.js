

 const ComponentStatic = (site, data) => {
  const components = Object.keys(data).splice(0, Object.keys(data).length - 2);
  const timestamp = Date.now();
  const staticDate = components.map(item => {
    const cmp = data[item];
    const coverage = cmp.coverage;
    const pagesTimes = cmp.pages.reduce((total, item) => total + item.pos.length, 0);
    const componentsTimes = cmp.components.reduce((total, item) => total + item.pos.length, 0);
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
  return staticDate;
};

module.exports = {
  ComponentStatic
}
