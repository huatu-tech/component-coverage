'use strict';

const { Controller } = require('egg');

class List extends Controller {
  async list() {
    const { ctx } = this;
    const result = await ctx.service.site.list();
    ctx.body = {
      code: 200,
      data: result,
    };
  }
  async add() {
    const { ctx } = this;
    const { site } = ctx.params;
    const result = await ctx.service.site.add(site);
    ctx.body = {
      code: 200,
      data: result,
    };
  }
  async del(){
    const { ctx } = this;
    const { id } = ctx.params;
    const result = await ctx.service.site.del(id);
    ctx.body = {
      code: 200,
      data: result,
    };
  }
  async update(){
    const { ctx } = this;
    const { id, site } = ctx.params;
    const result = await ctx.service.site.update({ id, site});
    ctx.body = {
      code: 200,
      data: result,
    };
  }
  async query(){
    const { ctx } = this;
    const { id } = ctx.query;
    console.log(id);
    const result = await ctx.service.site.query(id);
    ctx.body = {
      code: 200,
      data: result,
    };
  }
}

module.exports = List;
