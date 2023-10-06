const router = require('express').Router(); // On utilise le router d'express
const utilsController = require("../controllers/utils.controller");
const { checkAdmin } = require('../middleware/admin.middleware');

router.post("/upload/cgu", checkAdmin, utilsController.uploadCGU);
router.post("/upload/politiqueconf", checkAdmin, utilsController.uploadPolitiqueConf);
router.post("/upload/copyright", checkAdmin, utilsController.uploadCopyright);


module.exports = router;