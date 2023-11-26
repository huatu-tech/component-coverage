// This file is created by egg-ts-helper@1.35.1
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportComponent = require('../../../app/controller/component');
import ExportHome = require('../../../app/controller/home');
import ExportSite = require('../../../app/controller/site');
import ExportStatistics = require('../../../app/controller/statistics');

declare module 'egg' {
  interface IController {
    component: ExportComponent;
    home: ExportHome;
    site: ExportSite;
    statistics: ExportStatistics;
  }
}
