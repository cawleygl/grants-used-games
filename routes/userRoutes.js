const express = require('express');
const controller = require('../controllers/userController');
const { isGuest, isLoggedIn } = require('../middleware/auth');
const { validateSignUp, validateLogIn, validateResult } = require('../middleware/validator');

const router = express.Router();

// GET /users/new - Send new user form
router.get('/new', isGuest, controller.new);

// POST /users - Create a new user account
router.post('/', isGuest, validateSignUp, validateResult, controller.create);

// GET /users/login - Send login form
router.get('/login', isGuest, controller.login);

// POST /users/login - Authenticate user login request
router.post('/login', isGuest, validateLogIn, validateResult, controller.authenticate);

// GET /users/profile - Send user profile
router.get('/profile', isLoggedIn, controller.profile);

// GET /users/logout - Log user out
router.get('/logout', isLoggedIn, controller.logout);

module.exports = router;