const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');
const checkAuths = require('../middleware/check-auth');

router.post('/signup', UserController.signUp);

router.post('/login', UserController.logIn);

router.get('/current-user', checkAuths.userAuth, UserController.currentUser);

router.post('/refresh-token', UserController.refreshToken);

module.exports = router;