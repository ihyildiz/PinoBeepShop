const nodeMailer = require('nodemailer');

// Dynamischer Import von nodemailer-express-handlebars
const hbs = async () => {
    return (await import('nodemailer-express-handlebars')).default;
};

exports.nodeMailerSend = async (emailReceiver) => {
    /******* Vorher über STRATO **********/ 
    // const transporter = nodeMailer.createTransport({
    //     host: 'mail.pinobeep.de',
    //     port: 587,
    //     secure: false,
    //     auth: {
    //         user: 'admin@pinobeep.de',
    //         pass: 'iStanBu7$3030',
    //     },
    //     tls: {
    //       rejectUnauthorized: false
    //     }
    // });

    /******* Über GMAIL **********/ 
    // const transporter = nodeMailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //       user: 'utivision@gmail.com',
    //       pass: 'hunc mqmu umyg qzxv' // nicht dein Google-Login!
    //     }
    //   });

    // Mailjet 
    const transporter = nodeMailer.createTransport({
        host: 'in-v3.mailjet.com',
        port: 587,
        secure: false,
        auth: {
        user: '41701af3c6fcffff2ec3edd28d65f107',
        pass: '72824cc0db7cffe61bff5187d413da35'
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
        // wenn GMAIL: from: 'PinoBeep <utivision@gmail.com>',
        from: 'PinoBeep <noreply@pinobeep.de>',
        to: emailReceiver,
        subject: 'TEST Email',
        template: 'welcomeMsg',
        context: {
            userName: 'Hakki Yildiz',
            age: '22',
        },
    };

    // transporter.sendMail(mailConfig, function (error, info) {
    //     if (error) {
    //         console.log(error);
    //     }
    //     console.log('Message is sent');
    // });
    transporter.sendMail(mailConfig, function (error, info) {
        if (error) {
            console.error('❌ Fehler beim Versand:', error);
        } else {
            console.log('✅ E-Mail gesendet:', info.response);
        }
    });

};
