const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const authController = require('../controllers/auth.controller');
const auth = require('../middlewares/auth.middleware');
const profileValidate = require('../validations/profile.validate');

// @route   POST api/posts
// @desc    Test route
// @access  Public
router.post('/', [auth, profileValidate], postController.test);

module.exports = router;
