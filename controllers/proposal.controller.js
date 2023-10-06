const {UserModel} = require("../models/user.model");
const nodemailer = require('nodemailer');
const mail = require('../config/mail.json');
const hbs = require('nodemailer-express-handlebars')


module.exports.sendEmailProposal = async (req, res) => {
    const data = req.body;
    const user = await UserModel.findById(data.userId);
    let attachment = [];
    if (req.files) {
        const pictures = req.files;
        pictures.forEach((picture) => {
            attachment.push({filename: picture.filename, path: './' + picture.path.replaceAll('\\', '/')});
        })
    }

    const transporter = nodemailer.createTransport({
        // service: 'gmail',
        host: "mail.infomaniak.com",
        port: 465,
        secure: true,
        auth: {
            user: mail.EMAIL_USERNAME,
            pass: mail.PASSWORD_EMAIL
        }
    });

    // point to the template folder
    const handlebarOptions = {
        viewEngine: {
            layoutsDir: './mailTemplates/',
            defaultLayout : 'mailProposalTemplate',
        },
        viewPath: './mailTemplates/',
    };

    // use a template file with nodemailer
    transporter.use('compile', hbs(handlebarOptions))

    const mailConfigurations = {
        from: mail.EMAIL_USERNAME,
        to: "testalphamares@gmail.com",//mail.EMAIL_USERNAME,
        subject: 'Proposition de lot',
        template: 'mailProposalTemplate',
        context: {
            name: user.name,
            surname: user.surname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            language : user.language,
            type: data.type,
            father : data.father,
            mother: data.mother,
            birthDate: data.birthDate,
            localisation: data.localisation,
            price: data.price,
        },
        attachments: attachment
    };

    transporter.sendMail(mailConfigurations, function (error, info) {
        if (error) {
            console.log(error);
            res.status(500).send('Erreur lors de l\'envoi de l\'e-mail.');
        } else {
            res.send('Mail send');
        }
    });
}