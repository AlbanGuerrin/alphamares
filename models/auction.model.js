const mongoose = require('mongoose');
const { isDate } = require('validator');
const {lotSchema} = require('./lot.model');

const auctionSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
            minLength: 3,
            trim: true
        },
        titleEN:{
            type: String,
            required: true,
            minLength: 3,
            trim: true
        },
        start:{
            type: Date,
            validate: [isDate],
            required: true,
        },
        end:{
            type: Date,
            validate: [isDate],
            required: true,
        },
        commission:{
            type:String,
            required: true,
        },
        picture:{
            type:String,
            //required: true,
        },
        description:{
            type: String,
            required: true,
            maxLength: 300,
            trim: true
        },
        descriptionEN:{
            type: String,
            required: true,
            maxLength: 300,
            trim: true
        },
        catalogue: {
            type: [lotSchema],
        },
        closed:{
            type: Boolean,
            required: true,
        },
        sales: {
            type: [String]
        }
    },
    {
        timestamps: true, 
    }
);

const AuctionModel = mongoose.model('auction', auctionSchema);
module.exports = AuctionModel;