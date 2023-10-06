const nodemailer = require("nodemailer");
const mail = require("../config/mail.json");

module.exports.transporterConfig = nodemailer.createTransport({
  host: "mail.infomaniak.com",
  port: 465,
  secure: true,
  auth: { user: mail.EMAIL_USERNAME, pass: mail.PASSWORD_EMAIL },
});
