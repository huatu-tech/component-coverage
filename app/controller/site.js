'use strict';

const { Controller } = require('egg');

class List extends Controller {
  async list() {
    const { ctx } = this;
    const result = await this.ctx.app.mysql.query('select * from statistics_site');
    ctx.body = {
      code: 200,
      data: result,
    };
  }
}

module.exports = List;
