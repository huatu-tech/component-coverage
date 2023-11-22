// This file is created by egg-ts-helper@1.35.1
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportHome = require('../../../app/controller/home');
import ExportSite = require('../../../app/controller/site');

declare module 'egg' {
  interface IController {
    home: ExportHome;
    site: ExportSite;
  }
}
