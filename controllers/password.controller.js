const jwt = require("jsonwebtoken");
const mail = require("../config/mail.json");
const { UserModel } = require("../models/user.model");
const hbs = require("nodemailer-express-handlebars");
const { transporterConfig } = require("../config/mailConfig");
const fs = require("fs");
const handlebars = require("handlebars");

module.exports.sendMailResetPassword = async (req, res) => {
  const email = req.body.email;

  const user = await UserModel.findOne({ email: email });

  if (user) {
    const transporter = transporterConfig;

    function loadTemplate(language) {
      const template = `./mailTemplates/mailResetPassword${language}.handlebars`;
      return fs.readFileSync(template, "utf8");
    }

    const template = loadTemplate(user.language === "English" ? "EN" : "FR");

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const variables = {
      site: `${process.env.CLIENT_URL}`,
      link: `${process.env.CLIENT_URL}/profil/reset-password/${token}/${user.email}`,
      name: user.name,
      surname: user.surname,
    };

    const compiledTemplate = handlebars.compile(template);

    const emailCompiled = compiledTemplate(variables);

    const mailConfigurations = {
      from: mail.EMAIL_USERNAME,
      to: user.email,
      subject:
        user.language === "English"
          ? "Reset password"
          : "Réinitialisation du mot de passe",
      html: emailCompiled,
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
        return res.status(400).json({ message: error });
      } else {
        return res.status(200).json("Email sent");
      }
    });
  } else {
    return res.status(404).json("Email not found");
  }
};

module.exports.checkToken = async (req, res) => {
  const token = req.params.token;
  const email = req.params.email;

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await UserModel.findOne({ email: email });

    if (user) {
      return res.status(200).json({ message: "Token valid" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(200).json({ message: "Token invalid" }); // TODO REMETTRE 200
    } else {
      return res.status(400).json({ message: error });
    }
  }
};

module.exports.resetPassword = async (req, res) => {
  const token = req.params.token;
  const email = req.params.email;
  const password = req.body.password;

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await UserModel.findOne({ email: email });

    if (user) {
      user.password = password; // The password is encrypted in the user model
      await user.save();
      sendMailConfirmPasswordChanged(user);
      return res.status(200).json({ message: "Password reset" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(200).json({ message: "Token invalid" });
    } else {
      return res.status(400).json({ message: error });
    }
  }
};

sendMailConfirmPasswordChanged = async (user) => {
  const transporter = transporterConfig;

  function loadTemplate(language) {
    const template = `./mailTemplates/mailConfirmResetPassword${language}.handlebars`;
    return fs.readFileSync(template, "utf8");
  }

  const template = loadTemplate(user.language === "English" ? "EN" : "FR");

  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: "1h" }
  );

  const variables = {
    site: `${process.env.CLIENT_URL}`,
    link: `${process.env.CLIENT_URL}/profil/reset-password/${token}/${user.email}`,
    name: user.name,
    surname: user.surname,
  };

  const compiledTemplate = handlebars.compile(template);

  const emailCompiled = compiledTemplate(variables);

  const mailConfigurations = {
    from: mail.EMAIL_USERNAME,
    to: user.email,
    subject:
      user.language === "English"
        ? "Reset password confirmation"
        : "Confirmation réinitialisation du mot de passe",
    html: emailCompiled,
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
      return res.status(400).json({ message: error });
    } else {
      return res.status(200).json("Email sent");
    }
  });
};
