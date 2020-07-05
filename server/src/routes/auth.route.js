const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', authController.test);

module.exports = router;
