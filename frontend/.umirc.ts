import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '组件库管理',
    locale: false, 
  },
  favicons: [
    // 完整地址
    'http://htwuhan.oss-cn-beijing.aliyuncs.com/tool/favicon.svg',
  ],
  routes: [
    {
      path: '/',
      redirect: '/component',
    },
    // {
    //   name: '首页',
    //   path: '/home',
    //   component: './Home',
    // },
    // {
    //   name: '权限演示',
    //   path: '/access',
    //   component: './Access',
    // },
    {
      name: '组件管理',
      path: '/component',
      component: './Component',
    },
    {
      name: '采集管理',
      path: '/collect',
      component: './Collect',
    },
    {
      name: '统计分析',
      path: '/dashboard',
      component: './Dashboard',
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

