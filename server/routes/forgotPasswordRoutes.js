const express = require('express');
const router = express.Router();
const forgotPasswordController = require('../controller/forgotPassword-Controller');
const userAuthenticate = require('../middleware/auth');

router.post('/forgotpassword', forgotPasswordController.forgotPassword);
router.get("/resetpassword/:id", forgotPasswordController.resetPassword);
router.post("/updatepassword/:id", forgotPasswordController.updatePassword);

module.exports = router;