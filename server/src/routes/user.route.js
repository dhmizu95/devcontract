const express = require('express');
const registerValidate = require('../validations/register.validate');
const userController = require('../controllers/user.controller');

const router = express.Router();

// @route   Post api/user
// @desc    Register user
// @access  Public
router.post('/', registerValidate, userController.register);

module.exports = router;
