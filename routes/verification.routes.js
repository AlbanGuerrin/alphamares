const router = require('express').Router(); 
const verificationController = require('./../controllers/verification.controller')

router.post("/email-verification/:email", verificationController.sendEmailVerification);
router.patch("/email-verification/:token", verificationController.checkTokenEmailVerification);


module.exports = router;