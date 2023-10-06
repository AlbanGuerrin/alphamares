const mongoose = require('mongoose');
const {BidSchema} = require('./bid.model');
const { isDate } = require('validator');


const LotSchema = new mongoose.Schema( // LOT
    {
        number: {
            type: Number,
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true // trim supprime les espaces à la fin.
        },
        titleEN: {
            type: String,
            required: true,
            trim: true
        },
        type: { // FrozenEmbryo, ImplantedEmbryo, foal, yearling, youngHorse, broodmareFull, broodmareEmpty, stallion
            type: String,
            required: true,
        },
        sexe: { // Male, female, unsexed
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        reproduction: { // ICSI, transfert, natural, n/a
            type: String,
            required: true,
        },
        sellerNationality: {
            type: String,
            required: true,
        },
        sellerType: { // Company, Private
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        tva: {
            type: Number,
            required: true,
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
        closed: {
            type: Boolean,
            required: true,
        },
        lastBid: BidSchema,
        bids: {
            type: [BidSchema],
        },
        pedigree: {
            gen1: {
                father: {
                    type: String,
                },
                mother: {
                    type: String,
                },
            },
            gen2: {
                GFPaternal: {
                    type: String
                },
                GMPaternal: {
                    type: String
                },
                GFMaternal: {
                    type: String
                },
                GMMaternal: {
                    type: String
                }
            },
            gen3: {
                GGFPF: { // Great Grand Father Parternal of father
                    type: String
                },
                GGMPF: { // Great Grand Mother Parternal of father
                    type: String
                },

                GGFPM: { // Great Grand Father Parternal of mother
                    type: String
                },
                GGMPM: { // Great Grand Mother Parternal of mother
                    type: String
                },

                GGFMF: { // Great Grand Father Maternal of father
                    type: String
                },
                GGMMF: { // Great Grand Mother Maternal of father
                    type: String
                },

                GGFMM: { // Great Grand Father Maternal of mother
                    type: String
                },
                GGMMM: { // Great Grand Mother Maternal of mother
                    type: String
                },
            },
        },
        name: { // If not embryo
            type: String,
            trim: true
        },
        birthDate: { // if not embryo
            type: String,
        },
        race: { // if not embryo
            type: String,
            max: 30,
            trim: true
        },
        dueDate: { // if embryo or broodmareFull
            type: String,
        },
        size: { // if young, broodmare or stallion
            type: String,
        },
        productionDate: { // if not FrozenEmbryo
            type: String,
        },
        carrierSize: {
            type: String,
        },
        carrierAge: {
            type: String,
        },
        bondCarrier: {
            type: String,
        },
        carrierForSale: {
            type: String,
        },
        fatherFoal: {
            type: String,
        },
        veterinaryDocuments: {
            type: [String],
        },
        pictures: {
            type: [String],
        },
        pictureFather: {
            type: String,
        },
        pictureMother: {
            type: String,
        },
        video: {
            type: String,
        },
        blackType: {
            type: String,
        },
        candidacyAccepted: {
            type: Boolean,
            required: true,
        },
        followers: {
            type: [String],
        },
        auction: {
            type: String,
        },
        commentFR:{
            type: String,
            max: 500,
        },
        commentEN:{
            type: String,
            max: 500,
        }
    },
    {
        timestamps: true, //=horodatages, date de création 
    }
)



const LotModel = mongoose.model('lot', LotSchema); // Définition du lotSchema comme un model mongoose
module.exports = {LotModel, LotSchema}; // exportation du model