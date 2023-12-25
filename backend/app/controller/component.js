'use strict';

const { Controller } = require('egg');

class List extends Controller {
  async list() {
    const { ctx } = this;
    const { current, pageSize, name, category } = ctx.query;
    const result = await ctx.service.component.list(current, pageSize, { name, category});
    ctx.body = {
      code: 200,
      data: result,
    };
  }
  async add() {
    const { ctx } = this;
    const result = await ctx.service.component.add(ctx.query);
    if (result instanceof Error) {
      ctx.body = {
        code: 500,
        data: [],
        message: '已存在相同的组件',
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
    const result = await ctx.service.component.del(ids.split(','));
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
    const today = this.app.formateDate(new Date());
    const result = await ctx.service.component.update({ ...ctx.request.body, update_date: today });
    if (result instanceof Error) {
      ctx.body = {
        code: 500,
        data: [],
        message: '已存在相同的组件',
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
    const result = await ctx.service.component.query(id);
    ctx.body = {
      code: 200,
      data: result,
    };
  }

  async detail() {
    const { ctx } = this;
    const result = await ctx.service.component.detail(ctx.query);
    ctx.body = {
      code: 200,
      data: result,
    };
  }

  async useInfo() {
    const { ctx } = this;
    const result = await ctx.service.component.useInfo(ctx.query);
    ctx.body = {
      code: 200,
      data: result,
    };
  }

}

module.exports = List;
