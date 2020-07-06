const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const profileValidate = require('../validation/profile.validate');
const experienceValidate = require('../validation/experience.validate');
const auth = require('../middleware/auth.middleware');
const educationValidate = require('../validation/education.validate');

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

// @route   DELETE api/profile
// @desc    Delete user, profile & posts
// @access  Private
router.delete('/', auth, profileController.delete_user_profile_posts);

// @route   PUT api/profile/experience
// @desc    Create or update user profile experience
// @access  Private
router.put(
	'/experience',
	[auth, experienceValidate],
	profileController.add_profile_experience
);

// @route   Delete api/profile/experience/:exp_id
// @desc    Delete user profile experience
// @access  Private
router.delete(
	'/experience/:exp_id',
	auth,
	profileController.delete_profile_experience
);

// @route   PUT api/profile/education
// @desc    Create or update user profile education
// @access  Private
router.put(
	'/education',
	[auth, educationValidate],
	profileController.add_profile_education
);

// @route   Delete api/profile/education/:edu_id
// @desc    Delete user profile education
// @access  Private
router.delete(
	'/education/:edu_id',
	auth,
	profileController.delete_profile_education
);
module.exports = router;
