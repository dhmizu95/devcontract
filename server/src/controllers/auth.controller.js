const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const expiresIn = require('config').get('expiresIn');
const secretOrKey = require('config').get('secretOrKey');

const { validationResult } = require('express-validator');

const User = require('../models/user');

// @route   GET api/auth
// @desc    Authenticate user
// @access  Private
const user = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		res.json({ user });
	} catch (error) {
		console.log(error.message);
		res.status(500).send('Server error');
	}
};

// @route   Post api/auth
// @desc    Autheticate user & get token
// @access  Public
const login = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { email, password } = req.body;

	try {
		let user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ error: [{ msg: 'Invalid credentials.' }] });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(404).json({ error: [{ msg: 'Invalid credentials.' }] });
		}

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

module.exports = { user, login };
