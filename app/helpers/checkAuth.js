'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();
var checkAuth = function checkAuth(req, res, next) {
	try {
		var decoded = _jsonwebtoken2.default.verify(req.headers.token, process.env.secret_token);
		req.userData = decoded;
		return next();
	} catch (error) {
		return res.status(401).json({
			message: 'Unauthorized! You are not allowed to log in!',
			status: 'Failed',
			data: []
		});
	}
};

exports.default = checkAuth;
//# sourceMappingURL=checkAuth.js.map
