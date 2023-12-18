// This file is created by egg-ts-helper@1.35.1
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportComponent = require('../../../app/service/component');
import ExportMail = require('../../../app/service/mail');
import ExportSite = require('../../../app/service/site');
import ExportStatistics = require('../../../app/service/statistics');

declare module 'egg' {
  interface IService {
    component: AutoInstanceType<typeof ExportComponent>;
    mail: AutoInstanceType<typeof ExportMail>;
    site: AutoInstanceType<typeof ExportSite>;
    statistics: AutoInstanceType<typeof ExportStatistics>;
  }
}
