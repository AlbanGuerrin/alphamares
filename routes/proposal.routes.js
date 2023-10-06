const router = require('express').Router();
const proposalController = require('../controllers/proposal.controller')
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/proposalPictures')
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 } // 10 Mo 
})


router.post("/send", upload.array('pictures', 10), proposalController.sendEmailProposal);

module.exports = router;