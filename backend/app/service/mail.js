const Service = require('egg').Service;
const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport');

class MailService extends Service {
  async index() {
    const mailInfo = await this.app.mysql.select('mail_info');
    return mailInfo;
  }
  async send(data,{pass,from,to,host}) {
    const transporter = nodemailer.createTransport(smtpTransport({
      host: host, //邮件服务供应商
      pool: true,
      port: 465,
      secure: true, // use TLS使用HTTPS port可以是 465 也可以是 994
      auth: {
        user: from, //发送方
        pass: pass//密码或授权码
      }
    }));
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    // 发送给谁以及发送内容
    const mailOptions = {
      from: from,//发送
      to: to,//接收方
      subject: `${year}年${month}月${day}前端组件库采集日报`, // 标题
      html: `<div>
      <p>${JSON.stringify(data)}</p>
      </div>`
    }

    async function sendEmails(transporter, mailOptions) {
      try {
        const verifypass = await transporter.verify();//验证邮件发送者transporter是否配置正确
        const sendSucess = await transporter.sendMail(mailOptions);//配置无误，发送发送邮件
        if (sendSucess) {
          console.log('发送成功');
        }
      } catch (error) {
        console.log(error);
      }
    }
    sendEmails(transporter, mailOptions);
  }

  async weekly(base64, { pass, from, to, host }) {
    const transporter = nodemailer.createTransport(smtpTransport({
      host: host, //邮件服务供应商
      pool: true,
      port: 465,
      secure: true, // use TLS使用HTTPS port可以是 465 也可以是 994
      auth: {
        user: from, //发送方
        pass: pass//密码或授权码
      }
    }));

    // 发送给谁以及发送内容
    const mailOptions = {
      from: from,//发送方
      to: to,//接收方
      subject: '前端组件库调用统计周报', // 标题
      html: `<div>${base64}</div>`
    }

    async function sendEmails(transporter, mailOptions) {
      try {
        const verifypass = await transporter.verify();//验证邮件发送者transporter是否配置正确
        const sendSucess = await transporter.sendMail(mailOptions);//配置无误，发送发送邮件
        if (sendSucess) {
          console.log('发送成功');
        }
      } catch (error) {
        console.log(error);
      }
    }
    sendEmails(transporter, mailOptions);
  }
}

module.exports = MailService;
