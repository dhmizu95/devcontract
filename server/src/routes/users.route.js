const express = require('express');
const registerValidate = require('../validation/register.validate');
const userController = require('../controllers/users.controller');

const router = express.Router();

// @route   Post api/users
// @desc    Register user
// @access  Public
router.post('/', registerValidate, userController.register);

module.exports = router;
