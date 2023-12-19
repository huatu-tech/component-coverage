'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index); // 首页

  router.get('/component/list', controller.component.list); // 组件列表
  router.post('/component/add', controller.component.add); // 新增组件
  router.delete('/component/del', controller.component.del); // 删除组件
  router.put('/component/update', controller.component.update); // 删除组件
  router.get('/component/detail', controller.component.detail); // 组件详情
  router.get('/component/useInfo', controller.component.useInfo); // 组件使用详情

  router.get('/site/list', controller.site.list); // 项目列表
  router.post('/site/add', controller.site.add); // 新增项目
  router.delete('/site/del', controller.site.del); // 删除项目
  router.put('/site/update', controller.site.update); // 删除项目

  router.get('/statistics', controller.statistics.index); // 查询统计
  router.get('/statistics/rank', controller.statistics.rank); // 查询统计Rank Top10
  router.get('/mail/index', controller.mail.index); // 查询统计Rank Top10
};
