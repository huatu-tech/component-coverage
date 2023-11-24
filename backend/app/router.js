'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index); // 首页
  router.get('/site/list', controller.site.list); // 列表
  router.post('/site/add', controller.site.add); // 新增项目
  router.delete('/site/del', controller.site.del); // 删除项目
  router.post('/site/update', controller.site.update); // 删除项目
  router.get('/site/query', controller.site.query); // 查询项目
};
