const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const mail = require('../config/mail.json');
const { UserModel } = require('../models/user.model');
const hbs = require('nodemailer-express-handlebars')

module.exports.sendEmailVerification = async (req, res) => {
    const userId = req.body.user._id.toString();
    const user = req.body.user;

    const transporter = nodemailer.createTransport({
        //service: 'gmail',
        host: "mail.infomaniak.com",
        port: 465,
        secure: true,
        auth: {
            user: mail.EMAIL_USERNAME,
            pass: mail.PASSWORD_EMAIL
        }
    });

    const token = jwt.sign({
        data: 'Token Data'
    }, process.env.TOKEN_SECRET, { expiresIn: '1h' }
    );

    // point to the template folder
    const handlebarOptions = {
        viewEngine: {
            layoutsDir: './mailTemplates/',
            defaultLayout: user.language === 'English' ? 'mailVerificationTemplateEN' : 'mailVerificationTemplateFR',
        },
        viewPath: './mailTemplates/',
    };

    // use a template file with nodemailer
    transporter.use('compile', hbs(handlebarOptions))

    const mailConfigurations = {
        from: mail.EMAIL_USERNAME,
        to: req.params.email,
        subject: user.language === 'English' ? 'Verification Email' : 'Email de vérification',
        template: user.language === 'English' ? 'mailVerificationTemplateEN' : 'mailVerificationTemplateFR',
        context: {
            link: `${process.env.CLIENT_URL}/email-verification/${token}/${userId}`,
            site: `${process.env.CLIENT_URL}`
        },
        attachments: [
            {
                filename: 'logo-Alpha-Mail.png',
                path: `./mailTemplates/logo-Alpha-Mail.png`,
                cid: 'logo' //same cid value as in the html img src
            }
        ]
    };

    transporter.sendMail(mailConfigurations, function (error, info) {
        if (error) {
            console.log(error);
            res.status(500).send('Erreur lors de l\'envoi de l\'e-mail de vérification : ' + error);
        } else {
            //console.log('E-mail de vérification envoyé :', info.response);
            res.send('Veuillez vérifier votre adresse e-mail');
        }
    });
}


module.exports.checkTokenEmailVerification = (req, res) => {
    const { token } = req.params;

    // Verifying the JWT token 
    jwt.verify(token, process.env.TOKEN_SECRET, async function (err, decoded) {
        if (err) {
            console.log(err);
            res.send("Email verification failed, possibly the link is invalid or expired");
        }
        else {
            await UserModel.findOneAndUpdate(
                { _id: req.body.userId },
                {
                    $set: {
                        verified: true,
                    }
                },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            )
                .then(res.status(200).json('Email verifified successfully'))
                .catch((err) => console.log(err))//res.status(500).json('ID not found : ' + err))
        }
    });
}
