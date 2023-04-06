const express = require('express');
const router = express.Router();

const userAuthenticate = require('../middleware/auth');
const premiumFeatureController = require('../controller/premiumFeature-controller');

router.get('/showleaderboard', userAuthenticate.authenticate, premiumFeatureController.getUserLeaderBoard);


module.exports = router;