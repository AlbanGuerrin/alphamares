const { UserModel } = require('../models/user.model');
const jwt = require('jsonwebtoken');

module.exports.checkAdmin = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log(err); // Log l'erreur et pas de next pour pas poursuivre si le token n'est pas bon.
            } else {
                let user = await UserModel.findById(decodedToken.id);
                if (user.isAdmin) {
                    next();
                }
                else {
                    res.status(401).send('Unauthorized : Require Admin privilege');
                }
            }
        })
    } else {
        res.status(401).send('Unauthorized : No token');
    }
};

module.exports.checkAdminOrOwner = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log(err); // Log l'erreur et pas de next pour pas poursuivre si le token n'est pas bon.
            } else {
                let user = await UserModel.findById(decodedToken.id);
                if (user.isAdmin) {
                    next();
                }
                else if (user._id == req.params.id) {
                    next();
                }
                else {
                    res.status(401).send('Unauthorized : Require Admin privilege');
                }
            }
        })
    } else {
        res.status(401).send('Unauthorized : No token');
    }
};