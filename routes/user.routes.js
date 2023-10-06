const router = require('express').Router(); // On utilise le router d'express
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const { checkAdmin, checkAdminOrOwner } = require('../middleware/admin.middleware');
const { requireAuth } = require('../middleware/auth.middleware');
const multer = require('multer');

// Auth : Création d'un user :
router.post("/register", authController.signUp); // si on fait api/user/register on appel la fonction signUp de authController
router.post("/login", authController.signIn); // JWT generation and pass to cookies
router.get("/logout", authController.logout); // remove JWT from cookies

// Gestion de l'user dans la DB
router.get('/', checkAdmin, userController.getAllUsers);
router.get('/:id', checkAdminOrOwner, userController.userInfo); // :id est un paramètre
router.put('/:id', userController.updateUser);
router.put('/block/:id', checkAdmin, userController.updateBlocked);
router.put('/verify/:id', userController.verifyUser);
router.delete('/:id', checkAdmin, userController.deleteUser);
router.patch('/follow/:id', userController.followLot); //La méthode PATCH d'une requête HTTP applique des modifications partielles à une ressource.
router.patch('/unfollow/:id', userController.unfollowLot);
router.get('/followedLots/:id', checkAdminOrOwner, userController.followedLots);
router.get('/followedLotsInfos/:id', checkAdminOrOwner, userController.followedLotsInfos);
router.get('/bids/:id', checkAdminOrOwner, userController.bids);
router.get('/sales/:id', checkAdminOrOwner, userController.getSales);


const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/billings/' + req.body.auctionId);
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + req.body.userId+ '-' + file.originalname);
        }
    })
});

router.post('/sendBill', upload.single('bill'), userController.receiveBill);
router.post('/modifyBill', upload.single('bill'), userController.modifyBill);


module.exports = router;