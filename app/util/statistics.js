
// {
//     component1:{
//         components: [],
//         pages: [],
//         coverage: {
//             components: '100%',
//             pages: '100%'
//         }
//     },
//     }
// }
export const mergeObj = (obj1, obj2) => {
  Object.keys(obj2).forEach(key => {
    if (obj1[key]) {
      obj1[key].components = obj1[key].components.concat(obj2[key].components);
      obj1[key].pages = obj1[key].pages.concat(obj2[key].pages);
    } else {
      obj1[key] = obj2[key];
    }
  });
  return obj1;
};

// 通过索引把2个数组合并为对象
// {
//     app1: {
//         components: [],
//         pages: [],
//         coverage: {
//             components: '100%',
//             pages: '100%'
//         }
//     },
//   }
// }
export const mergeArr = (arr1, arr2) => {
  const obj = {};
  arr1.forEach((item, index) => {
    obj[item] = arr2[index];
  });
  return obj;
};


export const componentStatic = (site, data) => {
  const components = Object.keys(data).splice(0, Object.keys(data).length - 2);
  const timestamp = Date.now();
  const staticDate = components.map(item => {
    const pages = data[item].pages;
    const pagesCount = pages.length;
    const pagesCoverageCount = pages.filter(item => item.coverage === '100%').length;
    const pagesTimes = pages.map(item => item.time);
    return {
      date: timestamp,
      component: item,
      project: site.site,
      components_count: data[item].components_count,
      components_coverage_count: data[item].components_coverage_count,
      components_times: data[item].components_times,
      pages_count: pagesCount,
      pages_coverage_count: pagesCoverageCount,
      pages_times: pagesTimes,
    };
  });
  return staticDate;
};
