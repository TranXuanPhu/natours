const express = require('express');
const viewController = require('../app/controllers/viewController.js');
const userController = require('../app/controllers/userController.js');
const authController = require('../app/controllers/authController.js');

const router = express.Router();

router.get('/signup', viewController.signupForm);
router.get('/login', viewController.loginForm);
router.get('/logout', viewController.logout);
router.get('/', viewController.overView);

module.exports = router;
