/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1700202203636_2613';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  config.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: '172.30.9.228',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: 'shanyu123@',
      // 数据库名
      database: 'common',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };
  const security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
  };
  return {
    security,
    ...config,
    ...userConfig,
  };
};
