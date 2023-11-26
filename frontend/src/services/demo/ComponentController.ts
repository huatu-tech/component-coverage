/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/v1/queryUserList */
export async function queryComponentList(
  params: {
    // query
    // /** keyword */
    // keyword?: string;
    // /** current */
    // current?: number;
    // /** pageSize */
    // pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.Result_PageInfo_SiteInfo__>('/api/component/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/user */
export async function addComponent(
  params?: any,
  body?: API.ComponentInfo,
  options?: { [key: string]: any },
) {
  return request<API.Result_UserInfo_>('/api/component/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      ...params,
    },
    data: body,
    ...(options || {}),
  });
}


/** 此处后端没有提供注释 PUT /api/v1/user/${param0} */
export async function updateComponent(
  body?: API.ComponentInfo,
  options?: { [key: string]: any },
) {
  return request<API.Result_UserInfo_>(`/api/component/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /api/v1/user/${param0} */
export async function deleteComponent(
  params: {
    // path
    /** ids */
    ids?: String | undefined;
  },
  options?: { [key: string]: any },
) {
  return request<API.Result_string_>(`/api/component/del`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}
