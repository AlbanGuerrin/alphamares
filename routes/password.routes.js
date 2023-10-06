const router = require('express').Router();
const passwordController = require('../controllers/password.controller');

router.post('/sendMailResetPassword/',passwordController.sendMailResetPassword);
router.get('/check-token/:token/:email',passwordController.checkToken);
router.put('/reset-password/:token/:email',passwordController.resetPassword);

module.exports = router;