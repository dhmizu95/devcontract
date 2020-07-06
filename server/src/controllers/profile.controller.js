const Profile = require('../models/profile.model');
const User = require('../models/user.model');
const githubClientID = require('config').get('githubClientID');
const githubClientSecret = require('config').get('githubClientSecret');
const axios = require('axios');
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

// @route   DELETE api/profile
// @desc    Delete user, profile & posts
// @access  Private
const delete_user_profile_posts = async (req, res) => {
	try {
		// @todo - remove user posts

		// Remove profile
		const profile = await Profile.findOneAndRemove({ user: req.user.id });

		// Remove user
		const user = await User.findOneAndRemove({ _id: req.user.id });

		res.json('User deleted.');
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server error.');
	}
};

// @route   PUT api/profile/experience
// @desc    Create or update user profile experience
// @access  Private
const add_profile_experience = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { title, company, location, from, to, current, description } = req.body;

	const newExperience = {
		title,
		company,
		location,
		from,
		to,
		current,
		description,
	};

	try {
		const profile = await Profile.findOne({ user: req.user.id });

		profile.experience.unshift(newExperience);
		await profile.save();

		res.json(profile);
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server error.');
	}
};

// @route   Delete api/profile/experience/:exp_id
// @desc    Delete user profile experience
// @access  Private
const delete_profile_experience = async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id });

		const removeIndex = profile.experience
			.map((item) => item.id)
			.indexOf(req.params.exp_id);

		profile.experience.splice(removeIndex, 1);

		await profile.save();

		res.json(profile);
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server error.');
	}
};

// @route   PUT api/profile/education
// @desc    Create or update user profile education
// @access  Private
const add_profile_education = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const {
		school,
		degree,
		fieldofstudy,
		from,
		to,
		current,
		description,
	} = req.body;

	const newEducation = {
		school,
		degree,
		fieldofstudy,
		from,
		to,
		current,
		description,
	};

	try {
		const profile = await Profile.findOne({ user: req.user.id });

		profile.education.unshift(newEducation);
		await profile.save();

		res.json(profile);
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server error.');
	}
};

// @route   Delete api/profile/education/:edu_id
// @desc    Delete user profile education
// @access  Private
const delete_profile_education = async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id });

		const removeIndex = profile.education
			.map((item) => item.id)
			.indexOf(req.params.edu_id);

		profile.education.splice(removeIndex, 1);

		await profile.save();

		res.json(profile);
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server error.');
	}
};

// @route   Get api/profile/github/:username
// @desc    Get users github profile
// @access  Public
const github_profile = async (req, res) => {
	try {
		const uri = encodeURI(
			`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${githubClientID}&client_secret=${githubClientSecret}`
		);
		const headers = {
			'user-agent': 'node.js',
		};

		const gitHubResponse = await axios.get(uri, { headers });
		return res.json(gitHubResponse.data);
	} catch (error) {
		console.error(error.message);
		res.status(404).json({ msg: 'No Github profile found' });
	}
};

module.exports = {
	current_user_profile,
	create_update_user_profile,
	all_user_profile,
	profile_by_user_id,
	delete_user_profile_posts,
	add_profile_experience,
	delete_profile_experience,
	add_profile_education,
	delete_profile_education,
	github_profile,
};
