const { check } = require('express-validator');

const registerValidate = [
	check('name', 'Name is required.').not().isEmpty(),
	check('email', 'Please inuclude a valid email.').isEmail(),
	check(
		'password',
		'Please include a password with 6 or more characters.'
	).isLength({ min: 6 }),
];

module.exports = registerValidate;
