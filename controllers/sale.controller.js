const AuctionModel = require("../models/auction.model");
const { LotModel } = require("../models/lot.model");
const { SaleModel } = require("../models/sale.model");
const { UserModel } = require("../models/user.model");
const moment = require('moment');


module.exports.createSale = async (data, res) => {

    const user = await UserModel.findById(data.userId);
    if (user === null) return res.status(500).json('User not found');

    const lot = await LotModel.findById(data.lotId);
    if (lot === null) return res.status(500).json('Lot not found');

    if (data.bid === null) return res.status(500).json('Bid not found');

    const body = {
        userId: user._id,
        lot: lot,
        bid: data.bid,
    }

    await SaleModel.create(body)
        .then(async (sale) => {
            await AuctionModel.findById(lot.auction)
                .then(async (auction) => {
                    auction.sales.push(sale._id);
                    await auction.save()
                    // .then(() =>
                    //     res.status(201).json(sale)
                    // )
                })
                .catch((err) => console.log(err))//res.status(500).json(err))
        }).catch((err) => console.log(err))//res.status(500).json(err))

}

module.exports.generateSalesOfAuction = async (auction, res) => {

    await AuctionModel.findById(auction._id)
        .then((auction) => {
            if (auction !== null) {
                auction.catalogue.forEach(async (lotId) => {
                    await LotModel.findById(lotId)
                        .then(async (lot) => {
                            if (lot.lastBid) {
                                await this.createSale(
                                    {
                                        userId: lot.lastBid.bidderId,
                                        lotId: lot._id,
                                        bid: lot.lastBid,
                                    },
                                    res
                                )
                            }
                        })
                        .catch((err) => console.error(err))// res.status(500).json(err));
                })
            }
        }
        ).catch((err) => console.error(err))// res.status(500).json(err));
}


module.exports.getAllSales = async (req, res) => {
    try {
        const sales = await SaleModel.find();
        res.status(200).json(sales);
    } catch (err) {
        res.status(500).json(err);
    }

}

module.exports.getNumSaleSameDay = async (req, res) => {
    try {
        const thisSale = await SaleModel.findById(req.params.id);
        const sales = await SaleModel.find({ updatedAt: { $eq: thisSale.updatedAt } });
        var numSaleToday = 0;
        sales.slice().forEach((sale) => {
            numSaleToday++;
        })
        res.status(200).json(numSaleToday);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }

}