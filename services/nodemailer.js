const nodeMailer = require('nodemailer');

// Dynamischer Import von nodemailer-express-handlebars
const hbs = async () => {
    return (await import('nodemailer-express-handlebars')).default;
};

exports.nodeMailerSend = async (emailReceiver) => {
    const transporter = nodeMailer.createTransport({
        host: 'mail.pinobeep.de',
        port: 587,
        secure: false,
        auth: {
            user: 'admin@pinobeep.de',
            pass: 'iStanBu7$3030',
        },
        tls: {
          rejectUnauthorized: false
        }
    });

    const Handlebars = await hbs(); // Warte auf den dynamischen Import

    const hbsOptions = {
        viewEngine: {
            defaultLayout: 'views/emails/masterLayout',
            layoutDir: 'views/emails',
            partialsDir: ['views/emails', 'views/emails/css'],
        },
        viewPath: 'views/emails',
        extName: '.hbs',
    };

    transporter.use('compile', Handlebars(hbsOptions));

    const mailConfig = {
        from: 'PinoBeep <admin@pinoBeep.de>',
        to: emailReceiver,
        subject: 'TEST Email',
        template: 'welcomeMsg',
        context: {
            userName: 'Hakki Yildiz',
            age: '22',
        },
    };

    transporter.sendMail(mailConfig, function (error, info) {
        if (error) {
            console.log(error);
        }
        console.log('Message is sent');
    });
};
