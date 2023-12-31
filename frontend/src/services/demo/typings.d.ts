/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！

declare namespace API {
  interface PageInfo {
    /** 
1 */
    current?: number;
    pageSize?: number;
    total?: number;
    list?: Array<Record<string, any>>;
  }

  interface PageInfo_UserInfo_ {
    /** 
1 */
    current?: number;
    pageSize?: number;
    total?: number;
    list?: Array<UserInfo>;
  }

  interface Result {
    success?: boolean;
    errorMessage?: string;
    data?: Record<string, any>;
  }

  interface Result_PageInfo_UserInfo__ {
    success?: boolean;
    errorMessage?: string;
    data?: PageInfo_UserInfo_;
  }

  interface Result_UserInfo_ {
    success?: boolean;
    errorMessage?: string;
    data?: UserInfo;
  }

  interface Result_string_ {
    success?: boolean;
    errorMessage?: string;
    data?: string;
  }

  type UserGenderEnum = 'MALE' | 'FEMALE';

  interface UserInfo {
    id?: string;
    name?: string;
    /** nick */
    nickName?: string;
    /** email */
    email?: string;
    gender?: UserGenderEnum;
  }

  interface UserInfoVO {
    name?: string;
    /** nick */
    nickName?: string;
    /** email */
    email?: string;
  }

  interface SiteInfo {
    id?: number;
    name?: string;
    /** nick */
    date?: string;
    /** email */
    update_date?: string;
    introduced?: string;
    environment?: string;
  }

  interface ComponentInfo {
    id?: number;
    name?: string;
    /** nick */
    date?: Number;
    /** email */
    update_date?: string;
    introduced?: string;
    category?: Number;
    author?: string;
  }

  interface Result_PageInfo_SiteInfo__ {
    success?: boolean;
    errorMessage?: string;
    data?: PageInfo_SiteInfo_;
  }

  interface PageInfo_SiteInfo_ {
    /** 
1 */
    current?: number;
    pageSize?: number;
    total?: number;
    data?: Array<UserInfo>;
  }
  type definitions_0 = null;
}
