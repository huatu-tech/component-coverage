import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '前端组件统计',
    locale: false, 
  },
  favicons: [
    // 完整地址
    'http://htwuhan.oss-cn-beijing.aliyuncs.com/tool/favicon.svg',
  ],
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '权限演示',
      path: '/access',
      component: './Access',
    },
    {
      name: '项目管理',
      path: '/table',
      component: './Table',
    },
  ],
  npmClient: 'pnpm',
  proxy: {
    '/api': {
      'target': 'http://127.0.0.1:7001/',
      'changeOrigin': true,
      'pathRewrite': { '^/api' : '' },
    },
  },
});

