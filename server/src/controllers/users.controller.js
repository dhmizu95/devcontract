const mongoose = require('mongoose');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const expiresIn = require('config').get('expiresIn');
const secretOrKey = require('config').get('secretOrKey');

const { validationResult } = require('express-validator');

const User = require('../models/user');

// @route   Post api/users
// @desc    Register user
// @access  Public
const register = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { name, email, password } = req.body;

	try {
		let user = await User.findOne({ email });

		if (user) {
			return res.status(404).json({ error: [{ msg: 'User already exists.' }] });
		}

		const avatar = gravatar.url(email, {
			s: 200,
			r: 'pg',
			d: 'mm',
		});

		user = new User({
			name,
			email,
			avatar,
			password,
		});

		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);

		await user.save();

		const payload = {
			user: {
				id: user.id,
			},
		};

		jwt.sign(payload, secretOrKey, { expiresIn }, (err, token) => {
			if (err) throw err;
			res.json({ token });
		});
	} catch (error) {
		console.log(error.message);
		res.status(404).json('Server error');
	}
};

module.exports = { register };
