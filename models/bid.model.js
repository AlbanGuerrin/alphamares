const mongoose = require('mongoose');

/**
 * Schema of a Bid.
 */
const BidSchema = new mongoose.Schema(
    {
        bidderId: {
            type: String,
            required: true,
        },
        auctionId: {
            type: String,
            required: true,
        },
        auctionInfos: {
            type: String,
            required: true,
        },
        lotId: {
            type: String,
            required: true,
        },
        lotInfos: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true, 
    }
);

const BidModel = mongoose.model('bid', BidSchema)
module.exports = {BidModel, BidSchema};