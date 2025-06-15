const nodeMailer = require('nodemailer');
const path = require('path')

// Dynamischer Import von nodemailer-express-handlebars
const hbs = async () => {
    return (await import('nodemailer-express-handlebars')).default;
};

exports.nodeMailerSend = async (emailReceiver, mailTemplate) => {
   
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

    let configMailTemplate = mailTemplate
    if (configMailTemplate==="") {
        configMailTemplate == "welcomeMsg"
    } 

    const mailConfig = {
        // wenn GMAIL: from: 'PinoBeep <utivision@gmail.com>',
        from: 'PinoBeep <noreply@pinobeep.de>',
        to: emailReceiver,
        subject: 'TEST Email',
        template: configMailTemplate,
        context: {
            userName: 'Hakki Yildiz',
            age: '22',
        },
        attachments: [
            {
              filename: 'about-img1.jpg',
              path: 'public/images/about/about-img1.jpg', // dein lokales Bild
              cid: 'logo_cid' // "Content ID", zum Einbinden in der HTML-E-Mail
            }
        ]
    };

    try {
        const info = await transporter.sendMail(mailConfig)
        console.log('Mail sent:', info.response)
        return true
    } catch (error) {
        console.error('Mailer error:', error)
        return false
    }

};
