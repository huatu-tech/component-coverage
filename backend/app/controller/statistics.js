'use strict';

const { Controller } = require('egg');

class Statistics extends Controller {
  async index() {
    const { ctx } = this;
    const result = await ctx.service.statistics.list();
    ctx.body = {
      code: 200,
      data: result,
    };
  }
  async rank() {
    const { ctx } = this;
    const { rankType } = ctx.query;
    const result = await ctx.service.statistics.rank(rankType);
    ctx.body = {
      code: 200,
      data: result,
    };
  }
}

module.exports = Statistics;
