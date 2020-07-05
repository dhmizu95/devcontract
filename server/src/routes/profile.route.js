const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');

// @route   GET api/profile
// @desc    Test route
// @access  Public
router.get('/', profileController.test);

module.exports = router;
