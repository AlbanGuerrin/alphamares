const router = require('express').Router(); // On utilise le router d'express
const lotController = require('../controllers/lot.controller');
const { checkAdmin } = require('../middleware/admin.middleware');
const multer = require('multer')

var i = 1;
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/lotUploads')
    },

    filename: function (req, file, cb) {
        if (file.fieldname === 'pictures') {
            cb(null, `./Lot_${Date.now()}_picture_${i}.jpg`);
            i++;
        } else if (file.fieldname === 'pictureMother') {
            cb(null, `./Lot_${Date.now()}_mother.jpg`);
        } else if (file.fieldname === 'pictureFather') {
            cb(null, `./Lot_${Date.now()}_father.jpg`);
        } else if (file.fieldname === 'veterinaryDocuments') {
            cb(null, `./Lot_${Date.now()}_${file.originalname.split('.pdf')[0]}.pdf`);
        } else if (file.fieldname === 'blackType') {
            cb(null, `./Lot_${Date.now()}_blackType.pdf`);
        } else {
            cb(new Error('Champ du formulaire invalide'));
        }
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 8388608 } // 8 Mo in octets
})

const middleware = upload.fields([
    { name: 'pictures', maxCount: 10 },
    { name: 'pictureMother', maxCount: 1 },
    { name: 'pictureFather', maxCount: 1 },
    { name: 'veterinaryDocuments', maxCount: 10 },
    { name: 'blackType', maxCount: 1 }
])

// Création d'un lot :
router.post("/register",
    function (req, res) {
        middleware(req, res, function (err) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else{
                lotController.createLot(req,res);
            }
        })
    });

// Update d'un lot
router.put("/:id",
    function (req, res) {
        middleware(req, res, function (err) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else{
                lotController.updateLot(req,res);
            }
        })
    });

// Gestion du lot dans la DB
router.get('/', lotController.getAllLots); // Si on fait un get avec juste '/' il nous retourne tout les lots
router.get('/:id', lotController.lotInfo); // :id est un paramètre
router.put('/extend/:id', checkAdmin, lotController.extend); // :id est un paramètre
router.get('/lotAndAuction/:id', lotController.lotAndAuction);
router.delete('/:id', checkAdmin, lotController.deleteLot);

module.exports = router;