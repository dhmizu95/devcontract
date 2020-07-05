const Profile = require('../models/profile');
const User = require('../models/user');

const { validationResult } = require('express-validator');
// @route   GET api/profile/me
// @desc    Get current user profile
// @access  Private
const current_user_profile = async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.user.id,
		}).populate('user', ['name', 'avatar']);

		if (!profile) {
			res.status(400).json({ msg: 'Profile not found.' });
		}

		res.json(profile);
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server error.');
	}
};

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
const create_update_user_profile = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const {
		company,
		website,
		location,
		status,
		skills,
		bio,
		githubusername,
		facebook,
		youtube,
		twitter,
		linkdin,
		instagram,
	} = req.body;

	const profileFields = {};
	profileFields.user = req.user.id;
	if (company) profileFields.company = company;
	if (website) profileFields.website = website;
	if (location) profileFields.location = location;
	if (bio) profileFields.bio = bio;
	if (githubusername) profileFields.githubusername = githubusername;
	if (status) profileFields.status = status;
	if (skills) {
		profileFields.skills = skills.split(',').map((skill) => skill.trim());
	}

	// Social fields
	profileFields.social = {};
	if (youtube) profileFields.social.youtube = youtube;
	if (facebook) profileFields.social.facebook = facebook;
	if (twitter) profileFields.social.twitter = twitter;
	if (instagram) profileFields.social.instagram = instagram;
	if (linkdin) profileFields.social.linkdin = linkdin;

	try {
		let profile = await Profile.findOne({ user: req.user.id });

		// Update profile
		if (profile) {
			profile = await Profile.findOneAndUpdate(
				{ user: req.user.id },
				{ $set: profileFields },
				{ new: true }
			);

			return res.json(profile);
		}

		// Create Profile
		profile = new Profile(profileFields);
		await profile.save(profile);

		res.json(profile);
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server error.');
	}
};

// @route   GET api/profile
// @desc    Get all users profile
// @access  Public
const all_user_profile = async (req, res) => {
	try {
		const profiles = await Profile.find().populate('user', ['name', 'avatar']);

		res.json(profiles);
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server error.');
	}
};

const profile_by_user_id = async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.params.user_id,
		}).populate('user', ['name', 'avatar']);

		if (!profile) {
			res.status(400).json({ msg: 'Profile not found.' });
		}

		res.json(profile);
	} catch (error) {
		console.error(error.message);
		if (error.kind === 'ObjectId') {
			res.status(400).json({ msg: 'Profile not found.' });
		}

		res.status(500).send('Server error.');
	}
};

module.exports = {
	current_user_profile,
	create_update_user_profile,
	all_user_profile,
	profile_by_user_id,
};
