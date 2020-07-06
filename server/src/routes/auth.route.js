const express = require('express');

const auth = require('../middlewares/auth.middleware');
const authController = require('../controllers/auth.controller');
const loginValidate = require('../validations/login.validate');

const router = express.Router();

// @route   GET api/auth
// @desc    Authenticate user
// @access  Private
router.get('/', auth, authController.user);

// @route   GET api/auth
// @desc    Authenticate user & get token
// @access  Private
router.post('/', loginValidate, authController.login);

module.exports = router;
