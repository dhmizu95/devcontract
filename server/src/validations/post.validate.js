const { check } = require('express-validator');

const postValidate = [check('text', 'Text is required.').not().isEmpty()];

module.exports = postValidate;
