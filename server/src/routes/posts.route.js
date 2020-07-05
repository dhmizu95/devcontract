const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts.controller');

// @route   GET api/posts
// @desc    Test route
// @access  Public
router.get('/', postsController.test);

module.exports = router;
