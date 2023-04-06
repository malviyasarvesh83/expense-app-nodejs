const purchaseController = require('../controller/purchase-controller');
const userAuthenticate = require("../middleware/auth");

const express = require('express');
const router = express.Router();


router.get('/premiummembership', userAuthenticate.authenticate, purchaseController.purchasePremium);
router.post('/updatetransactionstatus', userAuthenticate.authenticate, purchaseController.updateTransactionStatus);
router.post('/paymentfailed', userAuthenticate.authenticate, purchaseController.paymentFailed);

module.exports = router;