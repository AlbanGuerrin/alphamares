const AuctionModel = require('../models/auction.model');
const { LotModel } = require('../models/lot.model');
const ObjectID = require('mongoose').Types.ObjectId;
const moment = require('moment');
const fs = require('fs')
const path = require('path');
const saleController = require('./sale.controller');
const { SaleModel } = require('../models/sale.model');
const { UserModel } = require('../models/user.model');
const { deleteLot } = require('./lot.controller');


module.exports.createAuction = async (req, res) => {
    if (req.file !== null) {
        const newAuction = new AuctionModel(req.body);
        newAuction.closed = false;

        if (req.file) {
            newAuction.picture = req.file.path.split("uploads/").pop();
        }
        try {
            const auction = await newAuction.save();
            res.status(201).json(auction);
        }
        catch (err) {
            console.log(err);
            res.status(200).send({ err })
        }
    }
}

module.exports.getAllAuctions = async (req, res) => {
    const auctions = await AuctionModel.find();
    res.status(200).json(auctions);
}


module.exports.auctionInfo = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) // Test si l'id est connu
        return res.status(400).send('ID unknown : ' + req.params.id)

    AuctionModel.findById(req.params.id, (err, docs) => {  // docs = response
        if (!err) res.send(docs);
        else console.log('ID not found : ' + err)
    });
}


module.exports.auctionLots = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) // Test si l'id est connu
        return res.status(400).send('ID unknown : ' + req.params.id)

    AuctionModel.findById(req.params.id, async (err, auction) => {  // docs = response
        if (!err && auction !== null) {
            var lots = [];
            var index = 0;
            //console.log(auction.catalogue);
            await auction.catalogue.forEach(async (lotId) => {
                await LotModel.findById(lotId)
                    .then((lot) => {
                        index++;
                        lots.push(lot);
                        if (index === auction.catalogue.length) {
                            res.status(200).json(lots)
                        }
                    })
                    .catch((err) => res.status(500).json(err));
            })
        }
        else res.status(500).json('ID not found : ' + err)
    });
}

/**
 * @function updateAuction
 * @async
 * @param {Object} req - Objet contenant les informations de la requête HTTP.
 * @param {Object} res - Objet permettant de renvoyer une réponse HTTP.
 * @description Met à jour les informations d'une enchère spécifique en fonction de l'ID fourni dans la requête HTTP.
 */
module.exports.updateAuction = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) // Test si l'id est connu
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        const auction = await AuctionModel.findById(req.params.id);
        auction.title = req.body.title;
        auction.titleEN = req.body.titleEN;
        auction.start = req.body.start;
        auction.end = req.body.end;
        auction.description = req.body.description;
        auction.descriptionEN = req.body.descriptionEN;

        if (req.file) {
            if (auction.picture){
                fs.unlinkSync('uploads/' + auction.picture);
            }
            auction.picture = req.file.path.split("uploads/").pop();
        }

        await auction.save().then(async () => {
            await AuctionModel.findById(req.params.id).then(
                (auction) => {
                    auction.catalogue.forEach(async (lotId) => {
                        await LotModel.findById(lotId)
                            .then((lot) => {
                                lot.start = req.body.start;
                                lot.end = moment(req.body.end).add(5 * (lot.number - 1), 'minutes');
                                lot.save();
                            })
                            .catch((err) => res.status(500).json(err));
                    })
                }
            )
        })
            .then((docs) => res.send(docs)) // Si ça marche on renvoie le lot à jour
            .catch((err) => res.status(500).send({ message: err })); // Erreur 500 : la requête envoyée par le navigateur n'a pas pu être traitée pour une raison qui n'a pas pu être identifiée
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};


/**
 * @function deleteAuction
 * @async
 * @param {Object} req - Objet contenant les informations de la requête HTTP.
 * @param {Object} res - Objet permettant de renvoyer une réponse HTTP.
 * @description Supprime une enchère ainsi que ses lots.
 */
module.exports.deleteAuction = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) // Test si l'id est connu
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        const auction = await AuctionModel.findById(req.params.id);
        auction.catalogue.forEach(async (lotId) => {
            deleteLot(lotId);
        });
        auction.delete();
        res.status(200).json({ message: "Auction : '" + req.params.id + "' Successfully deleted. " })
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}


module.exports.addLot = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) // Test si l'id est connu
        return res.status(400).send('ID auction unknown : ' + req.params.id);

    if (!ObjectID.isValid(req.body.idToAdd)) // Test si l'id à add est connu
        return res.status(400).send('ID to add unknown : ' + req.body.idToAdd);

    try {
        // Ajoute au catalogue
        await AuctionModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { catalogue: req.body.idToAdd } },
            { new: true, upsert: true }
        ),

            // Ajoute l'id de l'auction au lot
            await LotModel.findByIdAndUpdate(
                req.body.idToAdd,
                { $addToSet: { auction: req.params.id } },
                { new: true, upsert: true }

            ).then((doc) => res.send("Succesfully added : " + doc))
                .catch((err) => res.status(500).send({ message: err }))


    } catch (err) {
        return res.status(500).json({ error: err });
    }
}



module.exports.currentAuctionWithLots = async (req, res) => {
    AuctionModel.find({ closed: false })
        .then(async (current) => {
            const auction = current[0];
            var lots = [];
            var i = 0;
            if (auction !== undefined) {
                while (i < auction.catalogue.length) {
                    await LotModel.findById(auction.catalogue[i])
                        .then((lot) => {
                            lots.push(lot);
                            i++;
                        })
                        .catch((err) => res.status(500).json(err));
                };
                res.status(200).json({ auction, lots })
            } else {
                res.status(204).json();
            }
        })
}

module.exports.closeAuction = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) // Test si l'id est connu
        return res.status(400).send('ID auction unknown : ' + req.params.id);

    await AuctionModel.findOneAndUpdate(
        { _id: req.params.id },
        {
            $set: {
                closed: true,
            }
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    ).then((auction) => {
        const dir = path.join(__dirname, '..', 'uploads', 'billings');
        fs.mkdir(path.join(dir, auction._id.toString()), { recursive: true }, (err) => {
            if (err) {
                console.error(err);
                res.status(500).send({ message: err });
            } else {
                saleController.generateSalesOfAuction(auction, res)
                res.status(200).send();
            }
        });
    })
        .catch((err) => console.error(err))//res.status(500).send({ message: err }))
}


module.exports.getAllAuctionsWithSales = async (req, res) => {
    const auctions = await AuctionModel.find();
    var auctionsWithSales = [];
    var index = 0;
    var sales = [];
    while (index < auctions.length) {
        sales = await getSalesAuctionWithUser(auctions[index])
            .then((sales) => {
                auctionsWithSales.push({ auction: auctions[index], sales: sales });
                index++;
            })
            .catch((err) => res.status(500).json(err))
    }
    res.status(200).json(auctionsWithSales);
}

getSalesAuctionWithUser = async (auction) => {
    if (auction.sales !== undefined) {
        if (auction.sales.length) {
            var index = 0;
            var sales = [];
            var saleId;
            while (index < auction.sales.length) {
                saleId = auction.sales[index];
                await SaleModel.findById(saleId)
                    .then(async (sale) => {
                        await UserModel.findById(sale.userId)
                            .then((user) => {
                                sales.push({
                                    sale: sale,
                                    user: user,
                                })
                                index++;
                            })
                            .catch((err) => console.log(err))
                    })
                    .catch((err) => console.log(err))
            }
            return sales;
        }
        return [];
    }
    return [];
}
