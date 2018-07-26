import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const checkAuth = (req, res, next) => {
	try {
		const decoded = jwt.verify(req.headers.token, process.env.secret_token);
		req.userData = decoded;
		return next();
	} catch (error) {
		return res.status(401).json({ error: 'Unauthorized! You are not allowed to log in!' });
	}
};

module.exports = checkAuth;
