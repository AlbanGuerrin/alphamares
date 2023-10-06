const {UserModel} = require('../models/user.model');
const jwt = require('jsonwebtoken');
const {signUpErrors, signInErrors} = require('../utils/errors.utils');
const verificationController = require('./verification.controller');

// Work
const maxAge = 30 * 24 * 60 * 60 * 1000 ; // temps de validite du token en ms : ici 30 jours
const createToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_SECRET, {expiresIn: maxAge});
};

// Work
module.exports.signUp = async (req, res) => {

    try{
        req.body['verified'] = false;
        const user = await UserModel.create(req.body);
        await verificationController.sendEmailVerification({body: {userId : user._id.toString(), user: user}, params: {email : user.email}}, res)
    }
    catch(err){
        console.log(err);
        const errors = signUpErrors(err);
        res.status(200).json({errors});
    }
}

// Work
module.exports.signIn = async (req, res) => {
    const { email, password} = req.body;

    try{
        const user = await UserModel.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {secure: true, httpOnly: true, maxAge}); // httpOnly : empêche d'accéder aux cookies JS du côté client.
        res.status(200).json({ user : user._id});
    }
    catch(err){
        //console.log(err);
        const errors = signInErrors(err);
        res.status(200).json({errors});
    }
} 

// Work to confirmed
module.exports.logout = async (req, res) => {
    res.cookie('jwt', '', {maxAge : 1}) // On remet le cookie à '' et on lui donne une durée de vie de 1ms.
    res.redirect('/');
}