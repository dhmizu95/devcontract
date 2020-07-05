const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const profileValidate = require('../validation/profile.validate');
const auth = require('../middleware/auth.middleware');

// @route   GET api/profile/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, profileController.current_user_profile);

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post(
	'/',
	[auth, profileValidate],
	profileController.create_update_user_profile
);

// @route   GET api/profile
// @desc    Get all users profile
// @access  Public
router.get('/', profileController.all_user_profile);

// @route   GET api/profile/user/:user_id
// @desc    Get all users profile
// @access  Public
router.get('/user/:user_id', profileController.profile_by_user_id);

module.exports = router;
