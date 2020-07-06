const { check } = require('express-validator');

const experienceValidate = [
	check('title', 'Title is required.').not().notEmpty(),
	check('company', 'Company is required.').not().notEmpty(),
	check('from', 'From is required.').not().notEmpty(),
];

module.exports = experienceValidate;
