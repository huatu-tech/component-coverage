'use strict';

const { Controller } = require('egg');

class Mail extends Controller {
  async index() {
    const { ctx } = this;
    const result = await ctx.service.mail.index();
    ctx.body = {
      code: 200,
      data: result,
    };
  }
}

module.exports = Mail;
