const { check } = require('express-validator');

const textValidate = [check('text', 'Text is required.').not().isEmpty()];

module.exports = textValidate;

// it validates posts & comments
