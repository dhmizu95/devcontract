const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller');

// @route   GET api/users
// @desc    Test route
// @access  Public
router.get('/', userController.test);

module.exports = router;
