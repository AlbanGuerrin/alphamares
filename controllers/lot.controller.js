const { LotModel } = require('../models/lot.model');
const { SaleModel } = require('../models/sale.model');
const { UserModel } = require('../models/user.model');
const AuctionModel = require('../models/auction.model');
const ObjectID = require('mongoose').Types.ObjectId;
const moment = require('moment');
const fs = require('fs');
const { BidModel } = require('../models/bid.model');


/**
 * @function createLot
 * @async
 * @param {Object} req - Objet contenant les informations de la requête HTTP.
 * @param {Object} res - Objet permettant de renvoyer une réponse HTTP.
 * @description Crée un nouveau lot à partir des informations fournies dans la requête HTTP.
 */
module.exports.createLot = async (req, res) => {
    try {
        const newLot = new LotModel(req.body);
        newLot.closed = false;
        newLot.candidacyAccepted = true;

        if (req.files['pictures']) {
            const pictures = req.files['pictures'];
            pictures.forEach(function (picture) {
                newLot.pictures.push(picture.path.split("uploads/").pop());
            })
        }

        if (req.files['pictureMother']) {
            const pictureMother = req.files['pictureMother'][0];
            newLot.pictureMother = pictureMother.path.split("uploads/").pop();
        }

        if (req.files['pictureFather']) {
            const pictureFather = req.files['pictureFather'][0];
            newLot.pictureFather = pictureFather.path.split("uploads/").pop();
        }

        if (req.files['veterinaryDocuments']) {
            const veterinaryDocuments = req.files['veterinaryDocuments'];
            veterinaryDocuments.forEach(function (doc) {
                newLot.veterinaryDocuments.push(doc.path.split("uploads/").pop());
            })
        }

        if (req.files['blackType']) {
            const blackType = req.files['blackType'][0];
            newLot.blackType = blackType.path.split("uploads/").pop();
        }

        try {
            await AuctionModel.findById(newLot.auction).then(async (auction) => {
                newLot.start = auction.start;
                newLot.end = moment(auction.end).add(5 * (newLot.number - 1), 'minutes');
                auction.catalogue.forEach(async (lotId) => {
                    await LotModel.findById(lotId).then((lot) => {
                        if (lot.number >= newLot.number) {
                            lot.number += 1;
                            lot.end = moment(auction.end).add(5 * (lot.number - 1), 'minutes');
                            lot.save();
                        }
                    })
                })
            })
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
            return
        }

        await newLot.save().then(async (lot) => {
            // Ajoute au catalogue
            await AuctionModel.findByIdAndUpdate(
                lot.auction,
                { $addToSet: { catalogue: lot._id.toString() } },
                { new: true, upsert: true }
            ).then((doc) => {
                res.status(201).json("Succesfully added : " + lot)
            }).catch((err) => {
                console.log(err);
                res.status(500).send(err);
                return
            })
        }).catch((err) => {
            console.log(err);
            res.status(500).send(err);
            return
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}

/**
 * @function getAllLots
 * @async
 * @param {Object} req - Objet contenant les informations de la requête HTTP.
 * @param {Object} res - Objet permettant de renvoyer une réponse HTTP.
 * @description Récupère tous les lots enregistrés dans la base de données.
 */
module.exports.getAllLots = async (req, res) => {
    const lots = await LotModel.find();
    res.status(200).json(lots); // On renvoie la réponse avec un code 200.
}

/**
 * @function lotInfo
 * @param {Object} req - Objet contenant les informations de la requête HTTP.
 * @param {Object} res - Objet permettant de renvoyer une réponse HTTP.
 * @description Récupère les informations d'un lot spécifique en fonction de l'ID fourni dans les paramètres de la requête HTTP.
 */
module.exports.lotInfo = (req, res) => {
    //console.log(req.params); // récupère les paramètres de la requête
    if (!ObjectID.isValid(req.params.id)) // Test si l'id est connu
        return res.status(400).send('ID unknown : ' + req.params.id)

    LotModel.findById(req.params.id, (err, docs) => {  // docs = response
        if (!err) res.send(docs);
        else console.log('ID not found : ' + err)
    });
}

module.exports.lotAndAuction = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) // Test si l'id est connu
        return res.status(400).send('ID unknown : ' + req.params.id)

    await LotModel.findById(req.params.id)
        .then(async (lot) => {
            try {
                await AuctionModel.findById(lot.auction)
                    .then((auction) => res.status(200).json({ lot, auction }))
                    .catch((err) => res.status(500).json({ message: err }))
            } catch (err) {
                return res.status(500).json({ error: err });
            }
        })
        .catch((err) => res.status(500).json({ message: err }))
}

/**
 * @function updateLot
 * @async
 * @param {Object} req - Objet contenant les informations de la requête HTTP.
 * @param {Object} res - Objet permettant de renvoyer une réponse HTTP.
 * @description Met à jour les informations d'un lot spécifique en fonction de l'ID fourni dans les paramètres de la requête HTTP.
 */
module.exports.updateLot = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) // Test si l'id est connu
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        const lot = await LotModel.findById(req.params.id);
        const oldNumber = lot.number;
        const newNumber = req.body.number;
        if (newNumber !== oldNumber) {
            lot.number = newNumber;
            await AuctionModel.findById(lot.auction).then((auction) => {
                auction.catalogue.forEach(async (lotId) => {
                    await LotModel.findById(lotId).then((otherLot) => {
                        if (otherLot.number <= newNumber && otherLot.number > oldNumber) {
                            otherLot.number -= 1;
                            otherLot.end = moment(auction.end).add(5 * (otherLot.number - 1), 'minutes');
                            otherLot.save();
                        }
                        if (otherLot.number >= newNumber && otherLot.number < oldNumber) {
                            otherLot.number += 1;
                            otherLot.end = moment(auction.end).add(5 * (otherLot.number - 1), 'minutes');
                            otherLot.save();
                        }
                    })
                })
            }
            )
        }
        lot.name = req.body.name;
        lot.title = req.body.title;
        lot.titleEN = req.body.titleEN;
        lot.name = req.body.name;
        lot.type = req.body.type;
        lot.race = req.body.race;
        lot.sexe = req.body.sexe;
        lot.location = req.body.location;
        lot.price = req.body.price;
        lot.tva = req.body.tva;
        lot.pedigree.gen1.father = req.body["pedigree.gen1.father"];
        lot.pedigree.gen1.mother = req.body["pedigree.gen1.mother"];
        lot.pedigree.gen2.GFPaternal = req.body["pedigree.gen2.GFPaternal"];
        lot.pedigree.gen2.GMPaternal = req.body["pedigree.gen2.GMPaternal"];
        lot.pedigree.gen2.GFMaternal = req.body["pedigree.gen2.GFMaternal"];
        lot.pedigree.gen2.GMMaternal = req.body["pedigree.gen2.GMMaternal"];
        lot.pedigree.gen3.GGFPF = req.body["pedigree.gen3.GGFPF"];
        lot.pedigree.gen3.GGMPF = req.body["pedigree.gen3.GGMPF"];
        lot.pedigree.gen3.GGFPM = req.body["pedigree.gen3.GGFPM"];
        lot.pedigree.gen3.GGMPM = req.body["pedigree.gen3.GGMPM"];
        lot.pedigree.gen3.GGFMF = req.body["pedigree.gen3.GGFMF"];
        lot.pedigree.gen3.GGMMF = req.body["pedigree.gen3.GGMMF"];
        lot.pedigree.gen3.GGFMM = req.body["pedigree.gen3.GGFMM"];
        lot.pedigree.gen3.GGMMM = req.body["pedigree.gen3.GGMMM"];
        lot.reproduction = req.body.reproduction;
        lot.sellerNationality = req.body.sellerNationality;
        lot.sellerType = req.body.sellerType;
        lot.dueDate = req.body.dueDate;
        lot.birthDate = req.body.birthDate;
        lot.productionDate = req.body.productionDate;
        lot.size = req.body.size;
        lot.carrierSize = req.body.carrierSize;
        lot.carrierAge = req.body.carrierAge;
        lot.bondCarrier = req.body.bondCarrier;
        lot.carrierForSale = req.body.carrierForSale;
        lot.fatherFoal = req.body.fatherFoal;
        lot.commentFR = req.body.commentFR;
        lot.commentEN = req.body.commentEN;


        if (req.files['pictures']) {
            if (lot.pictures[0]) {
                pictures.forEach((picture) => {
                    fs.unlinkSync('uploads/' + picture);
                })
            }
            const pictures = req.files['pictures'];
            pictures.forEach(function (picture) {
                lot.pictures.push(picture.path.split("uploads/").pop());
            })
        }

        if (req.files['pictureMother']) {
            if (lot.pictureMother) {
                fs.unlinkSync('uploads/' + lot.pictureMother);
            }
            const pictureMother = req.files['pictureMother'][0];
            lot.pictureMother = pictureMother.path.split("uploads/").pop();
        }

        if (req.files['pictureFather']) {
            if (lot.father) {
                fs.unlinkSync('uploads/' + lot.pictureFather);
            }
            const pictureFather = req.files['pictureFather'][0];
            lot.pictureFather = pictureFather.path.split("uploads/").pop();
        }

        if (req.files['veterinaryDocuments']) {
            if (lot.veterinaryDocuments[0]) {
                veterinaryDocuments.forEach((doc) => {
                    fs.unlinkSync('uploads/' + doc);
                })
            }
            const veterinaryDocuments = req.files['veterinaryDocuments'];
            veterinaryDocuments.forEach(function (doc) {
                lot.veterinaryDocuments.push(doc.path.split("uploads/").pop());
            })
        }

        if (req.files['blackType']) {
            if (lot.blackType) {
                fs.unlinkSync('uploads/' + lot.blackType);
            }
            const blackType = req.files['blackType'][0];
            lot.blackType = blackType.path.split("uploads/").pop();
        }
        await lot.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err });
    }
};

/**
 * @function deleteLot
 * @async
 * @param {Object} req - Objet contenant les informations de la requête HTTP.
 * @param {Object} res - Objet permettant de renvoyer une réponse HTTP.
 * @description Supprime un lot spécifique en fonction de l'ID fourni dans les paramètres de la requête HTTP.
 */
module.exports.deleteLot = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) // Test si l'id est connu
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        const lotId = req.params.id;
        const lot = await LotModel.findByIdAndDelete(lotId);
        if (lot) {

            // Mise à jour de l'enchère
            const auction = await AuctionModel.findById(lot.auction);
            auction.catalogue = auction.lots.filter((lot) => lot !== lotId);
            auction.save();

            // Décalage des numéro des lots
            const lotsAfter = await LotModel.find({ auction: auction._id, number: { $gt: lot.number } });
            lotsAfter.forEach(async (lotAfter) => {
                lotAfter.number = lotAfter.number - 1;
                await lotAfter.save();
            })

            // Suppression des enchères et des ventes si il y en a
            const bids = await BidModel.find({ lotId: lotId });
            if (bids.length > 0) {
                bids.forEach(async (bid) => {
                    await BidModel.findByIdAndDelete(bid._id);
                })
                await SaleModel.deleteOne({ 'lot._id': lotId });
            }

            // Supression dans les favoris 
            const followers = await UserModel.find({ followedLot: { $elemMatch: { $eq: 3 } } });
            if (followers) {
                followers.forEach(async (follower) => {
                    follower.followedLot = follower.followedLot.filter((lot) => lot !== lotId);
                    await follower.save();
                })
            }
            return res.status(200).json({ message: "Lot : '" + req.params.id + "' Successfully deleted. " })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}


module.exports.extend = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) // Test si l'id est connu
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        const lot = await LotModel.findById(req.params.id)
        lot.end = moment(lot.end).add(req.body.extendOf, 'minutes')
        lot.save()
        return res.status(200).send();
    } catch (err) {
        return res.status(500).json({ message: err });
    }
}