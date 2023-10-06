const mongoose = require('mongoose');
const { isEmail } = require('validator'); //function qui vérifie si l'email est valide.
const { isMobilePhone } = require('validator'); 
const bcrypt = require("bcrypt");
const { SaleSchema } = require('./sale.model');


/**
 * {
    "name": "Mares",
    "surname": "Alpha",
    "email":"mares@gmail.com",
    "password": "test33",
    "nationality": "French",
    "phoneNumber": "0123456789",
    "adressNumber": "32",
    "adressStreet": "Rue du Maréchal",
    "adressCity": "Angers",
    "adressCountry": "France",
    "gender": "male",
    "language": "French",
    "birthDate": "06-04-1999",
    "type": "Company"
}
 */

const userSchema = new mongoose.Schema(
    {
        name: { // nom et prénom; PAS DE PSEUDO, connexion avec l'adresse mail
            type: String,
            required: true,
            minlength: 1,
            maxlength: 30,
            trim: true // trim supprime les espaces à la fin.
        },
        surname: { 
            type: String,
            required: true,
            minlength: 1,
            maxlength: 30,
            trim: true 
        },
        email: {
            type: String,
            required: true,
            validate: [isEmail], // Utilisation de validator
            lowercas: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            maxlength: 1024,
            minlength: 6
        },
        phoneNumber:{
            type: String,
            validate: [isMobilePhone],
            unique: true,
            trim: true
        },
        adress:{
            type: String,
            required : true 
        },
        adressCity:{
            type: String,
            required: true,
        },
        adressCountry:{
            type: String,
            required: true,
        },
        gender:{
            type: String,
            required: true,
        },
        language:{
            type: String,
            required: true,
        },
        birthDate:{
            type: Date,
            required: true,
        },
        type:{
            type: String,
            required: true,
        },
        companyName:{
            type: String,
        },
        tvaNumber:{
            type: String,
        },
        isSeller:{
            type: Boolean,
        },
        followedLot: {
            type: [String], //à modifier certainement
        },
        previousSales: {
            type: [String], 
        },
        bids:{
            type: [String],
        },
        isAdmin: {
            type: Boolean,
        },
        verified:{
            type: Boolean,
        },
        blocked:{
            type: Boolean,
        }
    },
    {
        timestamps: true, //=horodatages, date de création de l'user
    }
)

//play function before save into display :
userSchema.pre("save", async function(next){ // next indique qu'une fois que la fonction est finie il peut passer à la suite.
    const salt = await bcrypt.genSalt(); // 'salage' du mot de passe
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.statics.login = async function(email, password){
    const user = await this.findOne({ email });
    if (user) {
        if (!user.verified){
            throw Error('Mail unverified')
        }
        if (user.blocked){
            throw Error('Blocked user')
        }
        const auth = await bcrypt.compare(password, user.password);
        if (auth){
            return user;
        }
        else {
            throw Error('Incorrect password');
        }
    }
    throw Error("Incorrect email");
} 

const UserModel = mongoose.model('user', userSchema); // Définition du userSchema comme un model mongoose
module.exports = {UserModel, userSchema}; // exportation du model