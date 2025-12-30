// services/nodemailer.js
const nodeMailer = require('nodemailer');

const hbs = async () => (await import('nodemailer-express-handlebars')).default;

exports.nodeMailerSend = async ({
  to,
  subject,
  template,
  context = {},
  attachments = [],
  from = 'PinoBeep <noreply@pinobeep.de>',
}) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.MJ_HOST || 'in-v3.mailjet.com',
    port: Number(process.env.MJ_PORT || 587),
    secure: false,
    auth: {
      user: process.env.MJ_API_KEY,
      pass: process.env.MJ_SECRET_KEY,
    },
  });

  const Handlebars = await hbs();

  transporter.use(
    'compile',
    Handlebars({
      viewEngine: {
        defaultLayout: 'views/emails/masterLayout',
        layoutDir: 'views/emails',
        partialsDir: ['views/emails', 'views/emails/css'],
        extname: '.hbs',
      },
      viewPath: 'views/emails',
      extName: '.hbs',
    })
  );

  if (!template) {
    throw new Error('Mailer: template name is missing');
  }

  const mailConfig = {
    from,
    to,
    subject: subject || 'PinoBeep – Nachricht',
    template,
    context,
    attachments,
  };

  try {
    const info = await transporter.sendMail(mailConfig);
    console.log('Mail sent:', info.response);
    return true;
  } catch (error) {
    console.error('Mailer error:', error);
    return false;
  }
};
