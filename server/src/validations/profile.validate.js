const { check } = require('express-validator');

const profileValidate = [
	check('status', 'Status is required.').not().isEmpty(),
	check('skills', 'Skills are required.').not().isEmpty(),
];

module.exports = profileValidate;
