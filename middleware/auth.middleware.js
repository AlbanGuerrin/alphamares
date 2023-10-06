const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/user.model');

module.exports.checkUser = (req, res, next) => { // next pour poursuivre le code
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                res.status(403).send('Unauthorized : Invalid token');
            } else {
                let user = await UserModel.findById(decodedToken.id);
                if (user) {
                    next();
                } else {
                    res.status(404).send('User not found');
                }
            }
        })
    } else {
        res.status(404).send('Unauthorized : No token')
    }
}

module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log(err); // Log l'erreur et pas de next pour pas poursuivre si le token n'est pas bon.
            } else {
                res.locals.userId = decodedToken.id;
                next();
            }
        })
    } else {
        res.status(401).send('Unauthorized : No token');
    }
}

module.exports.checkUserForBilling = (req, res, next) => { // next pour poursuivre le code
    const token = req.cookies.jwt;
    const path = req.path;

    if (path.startsWith('/billings/')) {
        if (token) {
            jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
                if (err) {
                    res.status(403).send('Unauthorized : Invalid token');
                } else {
                    let user = await UserModel.findById(decodedToken.id);
                    const billUserId = path.split('-')[1];

                    if (user.isAdmin || user._id == billUserId) {
                        next();
                    } else if (user && user._id != billUserId) {
                        res.status(403).send('Unauthorized : You are not the owner of this billing');
                    } 
                    else {
                        res.status(404).send('User not found');
                    }
                }
            })
        } else {
            res.status(404).send('Unauthorized : No token')
        }
    } else {
        next();
    }
}

module.exports.checkUserForProposal= (req, res, next) => { // next pour poursuivre le code
    const token = req.cookies.jwt;
    const path = req.path;

    if (path.startsWith('/proposalPictures/')) {
        if (token) {
            jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
                if (err) {
                    res.status(403).send('Unauthorized : Invalid token');
                } else {
                    let user = await UserModel.findById(decodedToken.id);
                    if (user) {
                        next();
                    } else {
                        res.status(404).send('User not found');
                    }
                }
            })
        } else {
            res.status(404).send('Unauthorized : No token')
        }
    } else {
        next();
    }
}