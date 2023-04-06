const express = require('express');
const router = express.Router();
const { signUp, login, allUsers, totalExpenses, downloadFiles } = require('../controller/user-controller');

const userAuthenticate = require('../middleware/auth');

router.post('/signup', signUp);
router.post('/login', login);
router.get('/allusers', userAuthenticate.authenticate, allUsers);
router.get('/totalexpenses', userAuthenticate.authenticate, totalExpenses);
router.get('/downloadfiles', userAuthenticate.authenticate, downloadFiles);

module.exports = router;