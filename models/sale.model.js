const mongoose = require('mongoose');
const { BidSchema } = require('./bid.model');
const { LotSchema } = require('./lot.model');

const SaleSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        lot: {
            type: LotSchema,
            required: true,
        },
        bid: {
            type: BidSchema,
        },
        bill: {
            type: String,
        },
        isBillSent:{
            type: Boolean,
        }
    },
    {
        timestamps: true, // Créer automatiquement le createdAt et le updatedAt
    }
);

const SaleModel = mongoose.model('sale', SaleSchema)
module.exports = {SaleModel, SaleSchema};