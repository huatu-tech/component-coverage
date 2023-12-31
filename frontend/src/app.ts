// 运行时配置

import type { RequestConfig } from '@umijs/max';

import { message } from 'antd';
// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

export const layout = () => {
  return {
    logo: 'http://htwuhan.oss-cn-beijing.aliyuncs.com/tool/favicon.svg',
    menu: {
      locale: false,
    },
  };
};

export const request: RequestConfig = {
  timeout: 1000,
  // other axios options you want
  errorConfig: {
    errorHandler(){
    },
    errorThrower(){
    }
  },
  requestInterceptors: [],
  responseInterceptors: [
    (response:any) => {
       // 拦截响应数据，进行个性化处理
       const { status } = response;
       if(status !== 200){
         message.error(response?.message || '请求失败');
       }
       return response;
    }
  ]
};
