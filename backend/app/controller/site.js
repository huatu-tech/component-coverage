'use strict';

const { Controller } = require('egg');

class List extends Controller {
  async list() {
    const { ctx } = this;
    const { current, pageSize, name, environment, site } = ctx.query;
    const result = await ctx.service.site.list(current, pageSize, { name, environment, site });
    ctx.body = {
      code: 200,
      data: result,
    };
  }
  async add() {
    const { ctx } = this;
    const result = await ctx.service.site.add(ctx.query);
    if (result instanceof Error) {
      ctx.body = {
        code: 500,
        data: [],
        message: '已存在相同的项目',
      };
    } else {
      ctx.body = {
        code: 200,
        data: result,
      };
    }
  }
  async del() {
    const { ctx } = this;
    const { ids } = ctx.query;
    const result = await ctx.service.site.del(ids.split(','));
    if (result.affectedRows) {
      ctx.body = {
        code: 200,
        data: result,
      };
    } else {
      throw new Error('删除失败，请重试');
    }
  }

  async update() {
    const { ctx } = this;
    const result = await ctx.service.site.update({ ...ctx.request.body, update_date: String(Date.now()) });
    if (result instanceof Error) {
      ctx.body = {
        code: 500,
        data: [],
        message: '已存在相同的项目',
      };
    } else {
      ctx.body = {
        code: 200,
        data: result,
      };
    }
  }

  async query() {
    const { ctx } = this;
    const { id } = ctx.query;
    const result = await ctx.service.site.query(id);
    ctx.body = {
      code: 200,
      data: result,
    };
  }
}

module.exports = List;
