const { check } = require('express-validator');

const loginValidate = [
	check('email', 'Please inuclude a valid email.').isEmail(),
	check('password', 'Password is required.').exists(),
];

module.exports = loginValidate;
