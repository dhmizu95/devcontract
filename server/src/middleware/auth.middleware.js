const jwt = require('jsonwebtoken');
const { secretOrKey } = require('../config/keys');

const auth = (req, res, next) => {
	const token = req.header('x-auth-token');

	if (!token) {
		return res.status(401).json({ msg: 'No token, authorization denied.' });
	}

	try {
		const decoded = jwt.verify(token, secretOrKey);

		req.user = decoded.user;
		next();
	} catch (error) {
		res.status(401).json({ msg: 'Token is not valid.' });
	}
};

module.exports = auth;
