const { UserModel } = require("../models/user.model");
const { LotModel } = require("../models/lot.model");
const { BidModel } = require("../models/bid.model");
const AuctionModel = require("../models/auction.model");
const { SaleModel } = require("../models/sale.model");
const bcrypt = require("bcrypt");
const ObjectID = require("mongoose").Types.ObjectId;
const resetPasswordController = require("./password.controller");

/**
 * @function getAllUsers
 * @async
 * @param {Object} req - Objet contenant les informations de la requête HTTP.
 * @param {Object} res - Objet permettant de renvoyer une réponse HTTP.
 * @description Récupère tous les utilisateurs enregistrés dans la base de données en excluant leur mot de passe.
 */
module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password"); // On va trouver et prendre tout dans la table UserModel sauf le password
  res.status(200).json(users); // On renvoie la réponse avec un code 200.
};

/**
 * @function userInfo
 * @param {Object} req - Objet contenant les informations de la requête HTTP.
 * @param {Object} res - Objet permettant de renvoyer une réponse HTTP.
 * @description Récupère les informations d'un utilisateur spécifique en fonction de l'ID fourni dans les paramètres de la requête HTTP.
 */
module.exports.userInfo = (req, res) => {
  //console.log(req.params); // récupère les paramètres de la requête
  if (!ObjectID.isValid(req.params.id))
    // Test si l'id est connu
    return res.status(400).send("ID unknown : " + req.params.id);

  UserModel.findById(req.params.id, (err, docs) => {
    // docs = response
    if (!err) res.send(docs);
    else console.log("ID not found : " + err);
  }).select("-password");
};

/**
 * @function updateUser
 * @async
 * @param {Object} req - Objet contenant les informations de la requête HTTP.
 * @param {Object} res - Objet permettant de renvoyer une réponse HTTP.
 * @description Met à jour les informations d'un utilisateur spécifique en fonction de l'ID fourni dans les paramètres de la requête HTTP.
 */
module.exports.updateUser = async (req, res) => {
  // TODO : A compléter
  if (!ObjectID.isValid(req.params.id))
    // Test si l'id est connu
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    if (req.body.password !== undefined) {
      const salt = await bcrypt.genSalt(); // 'salage' du mot de passe
      await bcrypt
        .hash(req.body.password, salt)
        .then(async (passwordCrypted) => {
          await UserModel.findOneAndUpdate(
            { _id: req.params.id },
            {
              $set: {
                name: req.body.name,
                surname: req.body.surname,
                email: req.body.email,
                password: passwordCrypted,
                phoneNumber: req.body.phoneNumber,
                adress: req.body.adress,
                adressCity: req.body.adressCity,
                adressCountry: req.body.adressCountry,
                gender: req.body.gender,
                language: req.body.language,
                birthDate: req.body.birthDate,
                type: req.body.type,
                job: req.body.job,
                tvaNumber: req.body.tvaNumber,
                companyName: req.body.companyName,
              },
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
          )
            .then((docs) => res.send(docs)) // Si ça marche on renvoie l'user à jour
            .catch((err) => res.status(500).send({ message: err }));
        });
    } else {
      await UserModel.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: this.password,
            phoneNumber: req.body.phoneNumber,
            adress: req.body.adress,
            adressCity: req.body.adressCity,
            adressCountry: req.body.adressCountry,
            gender: req.body.gender,
            language: req.body.language,
            birthDate: req.body.birthDate,
            type: req.body.type,
            job: req.body.job,
            tvaNumber: req.body.tvaNumber,
            companyName: req.body.companyName,
          },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      )
        .then((docs) => res.send(docs)) // Si ça marche on renvoie l'user à jour
        .catch((err) => res.status(500).send({ message: err }));
    }
    // Erreur 500 : la requête envoyée par le navigateur n'a pas pu être traitée pour une raison qui n'a pas pu être identifiée
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await UserModel.findOne({ email: email });

    if (user === null) {
      return res.status(400).json("No account");
    }

    const randomPassword = Array(16)
      .fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz")
      .map((x) => {
        return x[Math.floor(Math.random() * x.length)];
      })
      .join("");

    await resetPasswordController
      .sendResetPasswordMail(user, randomPassword)
      .then(async () => {
        user.password = randomPassword; //hashedPassword; Le hashage est fait automatiquement sur le model
        await user.save();
        return res.status(200).send("Email send");
      })
      .catch((err) => res.status(500).send("Error : " + err));
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

/**
 * @function deleteUser
 * @async
 * @param {Object} req - Objet contenant les informations de la requête HTTP.
 * @param {Object} res - Objet permettant de renvoyer une réponse HTTP.
 * @description Supprime un utilisateur spécifique en fonction de l'ID fourni dans les paramètres de la requête HTTP.
 */
module.exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    // Test si l'id est connu
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await UserModel.deleteOne({ _id: req.params.id }).exec();
    res.status(200).json({
      message: "User : '" + req.params.id + "' Successfully deleted. ",
    });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

/**
 * @function followLot
 * @async
 * @param {Object} req - Objet contenant les informations de la requête HTTP.
 * @param {Object} res - Objet permettant de renvoyer une réponse HTTP.
 * @description Ajoute un lot dans la liste des lots suivis par un utilisateur spécifique en fonction de l'ID de l'utilisateur et de l'ID du lot fourni dans les paramètres de la requête HTTP.
 */
module.exports.followLot = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    // Test si l'id est connu
    return res.status(400).send("ID unknown : " + req.params.id);

  if (!ObjectID.isValid(req.body.idToFollow))
    // Test si l'id à follow est connu
    return res
      .status(400)
      .send("ID to follow unknown : " + req.body.idToFollow);

  try {
    // Ajoute à la liste followedLot
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { followedLot: req.body.idToFollow } },
      { new: true, upsert: true }
      // .then((docs) => res.status(201).json(docs)) // Si ça marche on renvoie l'user à jour. Attention qu'UNE réponse par requête.
      // .catch((err) => res.status(400).send({ message: err })),
    ),
      // Ajoute aux followers du lot
      await LotModel.findByIdAndUpdate(
        req.body.idToFollow,
        { $addToSet: { followers: req.params.id } },
        { new: true, upsert: true }
        //(err, doc) => console.log(err)
      )
        .then((doc) => res.send(doc))
        .catch((err) => res.status(500).send({ message: err }));
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

/**
 * @function unfollowLot
 * @async
 * @param {Object} req - Objet contenant les informations de la requête HTTP.
 * @param {Object} res - Objet permettant de renvoyer une réponse HTTP.
 * @description Retire un lot dans la liste des lots suivis par un utilisateur spécifique en fonction de l'ID de l'utilisateur et de l'ID du lot fourni dans les paramètres de la requête HTTP.
 */
module.exports.unfollowLot = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    // Test si l'id est connu
    return res.status(400).send("ID unknown : " + req.params.id);

  if (!ObjectID.isValid(req.body.idToUnFollow))
    // Test si l'id à follow est connu
    return res
      .status(400)
      .send("ID to unfollow unknown : " + req.body.idToUnFollow);

  try {
    // Retire de la liste followedLot
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { followedLot: req.body.idToUnFollow } },
      { new: true, upsert: true }
    )
      .then((docs) => res.status(201).json(docs)) // Si ça marche on renvoie l'user à jour
      .catch((err) => res.status(400).send({ message: err }));
    // Retire aux followers du lots
    await LotModel.findByIdAndUpdate(
      req.body.idToUnFollow,
      { $pull: { followers: req.params.id } },
      { new: true, upsert: true }
    ).catch((err) => res.status(400).json({ message: err }));
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.followedLots = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  await UserModel.findById(req.params.id)
    .then(async (user) => {
      try {
        var lots = [];
        var index = 0;
        if (user.followedLot.length > 0) {
          user.followedLot.forEach(async (lotId) => {
            await LotModel.findById(lotId)
              .then((lot) => {
                index++;
                lots.push(lot);
                if (index === user.followedLot.length) {
                  res.status(200).json(lots);
                }
              })
              .catch((err) => res.status(500).json(err));
          });
        } else {
          res.status(200).json("No followed lot");
        }
      } catch (err) {
        return res.status(500).json({ error: err });
      }
    })
    .catch((err) => res.status(500).json({ message: err }));
};

module.exports.followedLotsInfos = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  await UserModel.findById(req.params.id)
    .then(async (user) => {
      try {
        var lots = [];
        var index = 0;
        if (user.followedLot.length > 0) {
          user.followedLot.forEach(async (lotId) => {
            await LotModel.findById(lotId)
              .then(async (lot) => {
                await AuctionModel.findById(lot.auction)
                  .then((auction) => {
                    index++;
                    lots.push({ lot, auction });
                    if (index === user.followedLot.length) {
                      res.status(200).json(lots);
                    }
                  })
                  .catch((err) => res.status(500).json(err));
              })
              .catch((err) => res.status(500).json(err));
          });
        } else {
          res.status(200).json("No followed lot");
        }
      } catch (err) {
        return res.status(500).json({ error: err });
      }
    })
    .catch((err) => res.status(500).json({ message: err }));
};

module.exports.bids = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  await UserModel.findById(req.params.id)
    .then(async (user) => {
      try {
        if (user.bids.length > 0) {
          var bids = [];
          var index = 0;
          user.bids.forEach(async (bidId, index) => {
            await BidModel.findById(bidId).then(async (bid) => {
              if (bid) {
                const win = await SaleModel.findOne({ "bid._id": bid._id });
                if (win !== null) {
                  bid = bid.toJSON();
                  bid.win = true;
                }
                bids.push(bid);
                index++;
                if (index === user.bids.length) {
                  return res.status(200).json(bids);
                }
              }
            });
          });
        } else {
          return res.status(200).json("No bid");
        }
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
      }
    })
    .catch((err) => res.status(500).json({ message: err }));
};

module.exports.receiveBill = async (req, res) => {
  if (!ObjectID.isValid(req.body.saleId))
    return res.status(400).send("ID unknown : " + req.body.saleId);

  const sale = await SaleModel.findByIdAndUpdate(
    { _id: req.body.saleId },
    {
      $set: {
        bill: req.file.path.split("uploads/").pop(),
        isBillSent: true,
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )
  await UserModel.findByIdAndUpdate(
      { _id: req.body.userId },
      {
        $push: {
          previousSales: sale._id,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .then(() => res.status(200).json("Sale added"))
      .catch((err) => res.status(500).json({ message: err }));
};

module.exports.modifyBill = async (req, res) => {
  if (!ObjectID.isValid(req.body.saleId))
    return res.status(400).send("ID unknown : " + req.body.saleId);

  await SaleModel.findByIdAndUpdate(
    { _id: req.body.saleId },
    {
      $set: {
        bill: req.file.path.split("uploads/").pop(),
      },
    },
    { setDefaultsOnInsert: true }
  )
      .then(() => res.status(200).json("Sale added"))
      .catch((err) => res.status(500).json(err))
  
};

module.exports.getSales = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  await UserModel.findById(req.params.id)
    .then(async (user) => {
      if (user.previousSales !== undefined) {
        var index = 0;
        var sales = [];
        var saleId;
        if (user.previousSales.length) {
          while (index < user.previousSales.length) {
            saleId = user.previousSales[index];
            await SaleModel.findById(saleId)
              .then(async (sale) => {
                sales.push(sale);
                index++;
              })
              .catch((err) => console.log(err));
          }
          return res.status(208).json(sales);
        } else {
          return res.status(200).json(sales);
        }
      }
    })
    .catch((err) => res.status(500).json(err));
};

module.exports.updateBlocked = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    // Test si l'id est connu
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          blocked: req.body.blocked,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .then((docs) => res.send(docs)) // Si ça marche on renvoie l'user à jour
      .catch((err) => res.status(500).send({ message: err })); // Erreur 500 : la requête envoyée par le navigateur n'a pas pu être traitée pour une raison qui n'a pas pu être identifiée
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.verifyUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    // Test si l'id est connu
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          verified: true,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .then((docs) => res.send(docs)) // Si ça marche on renvoie l'user à jour
      .catch((err) => res.status(500).send({ message: err })); // Erreur 500 : la requête envoyée par le navigateur n'a pas pu être traitée pour une raison qui n'a pas pu être identifiée
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
