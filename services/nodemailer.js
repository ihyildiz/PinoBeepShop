const nodeMailer = require ('nodemailer')
const hbs = require ('nodemailer-express-handlebars')



exports.nodeMailerSend = async (emailReceiver) => {

    const transporter = nodeMailer.createTransport({
        host: 'smtp.strato.de',
        port: 465,
        secure: true,
        auth:{
            user:'webmaster@pinobeep.de',
            pass: 'EoN1Px7hqTqF431'
        }
    })

    const hbsOptions  = {
        viewEngine:{
            defaultLayout: 'views/emails/masterLayout',
            layoutDir: 'views/emails',
            partialsDir: ["views/emails", "views/emails/css"],
        },
        viewPath: 'views/emails',
        extName: '.hbs',
    } 

    transporter.use('compile', hbs(hbsOptions))


    const mail_config ={
        from: "PinoBeep <master@pinoBeep.de>",
        to:emailReceiver,
        subject:" TEST Email ",
        template: 'welcomeMsg',
        context: {
            userName : "Hakki Yildiz",
            age: "22"
        }
    }

    transporter.sendMail(mail_config, function (error, info){
        if (error){
            console.log(error)
            //return reject({ message: `An error has accured` })
        }
        console.log('Message is sent ')
        //return resolve ({ message: `Email send successfuly` })
    })

    //console.log(info)
}

