const nodeMailer = require('nodemailer');

// Dynamischer Import von nodemailer-express-handlebars
const hbs = async () => {
    return (await import('nodemailer-express-handlebars')).default;
};

exports.nodeMailerSend = async (emailReceiver) => {
    const transporter = nodeMailer.createTransport({
        host: 'smtp.strato.de',
        port: 465,
        secure: true,
        auth: {
            user: 'webmaster@pinobeep.de',
            pass: 'EoN1Px7hqTqF431',
        },
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
        from: 'PinoBeep <master@pinoBeep.de>',
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
