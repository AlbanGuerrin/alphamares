const AuctionModel = require('../models/auction.model');
const { BidModel} = require('../models/bid.model');
const {LotModel} = require('../models/lot.model');
const {UserModel} = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;
const moment = require('moment');

module.exports.createBid = async (request, res) => {

    // Fonction qui enregistre l'enchère une fois que l'user à été vérifié et le montant calculé.
    async function saveBid(user, lot, auction, req) {
        try {
            req.lotInfos = `Lot ${lot.number} - ${lot.title}`;
            req.auctionInfos = auction.title;
            //console.log(req)
            const bid = new BidModel(req);
            await bid.save();
            user.bids.push(bid._id);
            lot.lastBid = bid;
            lot.bids.push(bid);

            // Si on entre dans les 5 dernières minutes du lot
            if (5 > moment(lot.end).diff(moment(), 'minutes')){
                lot.end = moment(lot.end).add(5, 'minutes') // Ajout de 5 min
            }
            await lot.save();
            await user.save();
            res.status(201).json("Bid created");
        }catch (err){
            console.log(err);
        }
    }

    try {
        const req = request.body;
        const user = await UserModel.findById(req.bidderId);
        const lot = await LotModel.findById(req.lotId);
        const auction = await AuctionModel.findById(req.auctionId);
        const amount = req.amount;

        if (user.verified) {

            // Check if the lot is closed
            if (moment(lot.end).isBefore()){
                return res.status(400).send("Lot closed");
            }

            // Check that the bid is superior to 0 
            if (lot.lastBid === undefined && amount - lot.price <= 0) {
                res.status(400).json("Unvalid bid");
            }
            if (lot.lastBid !== undefined) {
                if (amount - lot.lastBid.amount <= 0) {
                    res.status(400).json("Unvalid bid");
                }
            }
            {
                // Check that the bid amount respect the price step
                if (lot.lastBid === undefined) { // For the first Bid
                    if (lot.price < 1000 && (amount - lot.price) % 100 === 0) {
                        saveBid(user, lot, auction, req);
                    }
                    else if (lot.price >= 1000 && 20000 > lot.price && (amount - lot.price) % 500 === 0) {
                        saveBid(user, lot, auction, req);
                    }
                    else if (lot.price >= 20000 && 50000 > lot.price && (amount - lot.price) % 1000 === 0) {
                        saveBid(user, lot, auction, req);
                    }
                    else if (50000 <= lot.price && (amount - lot.price) % 2000 === 0) {
                        saveBid(user, lot, auction, req);
                    }
                    else {
                        res.status(400).json("Unvalid bid");
                    }
                }
                else {
                    if (lot.lastBid.amount < 1000 && (amount - lot.lastBid.amount) % 100 === 0) {
                        saveBid(user, lot, auction, req);
                    }
                    else if (lot.lastBid.amount >= 1000 && 20000 > lot.lastBid.amount && (amount - lot.lastBid.amount) % 500 === 0) {
                        saveBid(user, lot, auction, req);
                    }
                    else if (lot.lastBid.amount >= 20000 && 50000 > lot.lastBid.amount && (amount - lot.lastBid.amount) % 1000 === 0) {
                        saveBid(user, lot, auction, req);
                    }
                    else if (50000 <= lot.lastBid.amount && (amount - lot.lastBid.amount) % 2000 === 0) {
                        saveBid(user, lot, auction, req);
                    }
                    else {
                        res.status(400).json("Unvalid bid");
                    }
                }

            }
        }
        else {
            res.status(403).json("Unverified account");
        }
    }
    catch (err) {
        //res.status(500).send({ err });
    }
}

module.exports.getAllBids = async (req, res) => {
    const bids = await BidModel.find();
    res.status(200).json(bids);
}

module.exports.getBid = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id)

    BidModel.findById(req.params.id, (err, docs) => {
        if (!err) res.send(docs);
        else console.log('ID not found : ' + err)
    });
}

module.exports.deleteBid = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        const bid = await BidModel.findByIdAndDelete(req.params.id) // Remove and return
        const lot = await LotModel.findById(bid.lotId)
        const user = await UserModel.findById(bid.bidderId)
        
        // Replace the last bid in lot
        lot.lastBid = lot.bids[lot.bids.length - 2];
        // Remove the last bidId in lot
        lot.bids.pop();

        // Remove the bidId in bids of the user
        user.bids = user.bids.filter(bidId => bidId != req.params.id);
        user.save();

        lot.save();

        res.status(200).json({ message: "Bid : '" + req.params.id + "' Successfully deleted. " })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err });
    }
}