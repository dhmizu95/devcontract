const { check } = require('express-validator');

const educationValidate = [
	check('school', 'School is required.').not().notEmpty(),
	check('degree', 'Degree is required.').not().notEmpty(),
	check('fieldofstudy', 'Field of study is required.').not().notEmpty(),
	check('from', 'From is required.').not().notEmpty(),
];

module.exports = educationValidate;
