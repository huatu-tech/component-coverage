const Service = require('egg').Service;
const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport');

class MailService extends Service {
  async send(data) {
    const transporter = nodemailer.createTransport(smtpTransport({
      host: 'smtp.exmail.qq.com', //邮件服务供应商
      pool: true,
      port: 465,
      secure: true, // use TLS使用HTTPS port可以是 465 也可以是 994
      auth: {
        user: 'kangyu@huatu.com', //发送方
        pass: '6Jf4vABcatrzyAQb'//密码或授权码
      }
    }));

    // 发送给谁以及发送内容

    const mailOptions = {
      from: 'kangyu@huatu.com',//发送方
      to: 'kangyu@huatu.com',//接收方
      subject: '请注意查收组件库采集信息!', // 标题
      html: `<div>
      <h1>今日天气</h1>
      <p>省份: ${JSON.stringify(data)}</p>
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
}

module.exports = MailService;
