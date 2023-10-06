const router = require('express').Router(); // On utilise le router d'express
const auctionController = require('../controllers/auction.controller');
const { checkAdmin } = require('../middleware/admin.middleware');
const { checkUser, requireAuth } = require('../middleware/auth.middleware');
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/auctionPictures')
    },
    
    filename: function (req, file, cb) {
        if (file.fieldname === 'picture') {
            cb(null, `./Auction_${Date.now()}_picture.jpg`);
        } else {
            cb(new Error('Champ du formulaire invalide'));
        }
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 8388608 } // 8 Mo in octets
}) 

// Auth : Création d'un lot :
// router.post("/register", [checkAdmin, upload.single('picture')], auctionController.createAuction); 
router.post("/register", upload.single('picture'), auctionController.createAuction); 

// Gestion des auctions dans la DB
router.get('/currentAuctionLots', auctionController.currentAuctionWithLots);
router.get('/auctionsWithSales', auctionController.getAllAuctionsWithSales);
router.get('/',  auctionController.getAllAuctions); 
router.get('/:id', auctionController.auctionInfo); // :id est un paramètre
router.get('/lots/:id', auctionController.auctionLots);
router.put('/:id', checkAdmin, upload.single('picture'),  auctionController.updateAuction);
router.put('/add/:id',  checkAdmin, auctionController.addLot);
router.patch('/close/:id', checkAdmin, auctionController.closeAuction);
router.delete('/:id', checkAdmin, auctionController.deleteAuction);

module.exports = router;