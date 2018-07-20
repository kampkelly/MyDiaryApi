'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UserController = function () {
	function UserController() {
		_classCallCheck(this, UserController);

		this.dataStructure = '';
	}

	_createClass(UserController, [{
		key: 'signup',
		value: function signup(req, res) {
			this.dataStructure = req.app.get('appData');
			var _req$body = req.body,
			    email = _req$body.email,
			    password = _req$body.password,
			    dob = _req$body.dob,
			    fullName = _req$body.fullName;

			if (email === ' ' || dob === ' ' || fullName === ' ' || password === ' ' || password < 6) {
				res.status(422).json({ error: 'Please fill in all the fields properly!' });
			} else if (!email || !dob || !fullName || !password) {
				res.status(400).json({ error: 'Invalid Request!' });
			} else if (!this.dataStructure.users) {
				res.status(500).json({ error: 'Internal Server Error!' });
			} else {
				var user = this.dataStructure.users.filter(function (u) {
					return u.email === email && u.password === password;
				});
				if (user.length > 0 && user[0].email) {
					res.status(409).json({ error: 'This email has already been taken!' });
				} else {
					this.dataStructure.users.push(req.body);
					var payload = {
						email: req.body.email
					};
					var token = _jsonwebtoken2.default.sign(payload, '123abcd4', { expiresIn: 60000 });
					res.setHeader('token', token);
					res.status(201).json({ message: 'You have successfully signed up!' });
				}
			}
		}
	}, {
		key: 'signin',
		value: function signin(req, res) {
			this.dataStructure = req.app.get('appData');
			var _req$body2 = req.body,
			    email = _req$body2.email,
			    password = _req$body2.password;

			if (email === ' ' || password === ' ' || password < 6) {
				res.status(422).json({ error: 'Please fill in all the fields properly!' });
			} else if (!email || !password) {
				res.status(400).json({ error: 'Invalid Request!' });
			} else if (!this.dataStructure.users) {
				res.status(500).json({ error: 'Internal Server Error!' });
			} else {
				var user = this.dataStructure.users.filter(function (u) {
					return u.email === email && u.password === password;
				});
				if (user.length > 0 && user[0].email) {
					var payload = {
						email: user.email
					};
					user = Object.assign({}, user[0]);
					delete user.password;
					var token = _jsonwebtoken2.default.sign(payload, '123abcd45', { expiresIn: 60000 });
					res.setHeader('token', token);
					res.status(200).json({ message: 'You have successfully signed in!', user: user });
				} else {
					res.status(401).json({ error: 'Unauthorized! You are not allowed to log in!' });
				}
			}
		}
	}]);

	return UserController;
}();

module.exports = UserController;
//# sourceMappingURL=UserController.js.map
