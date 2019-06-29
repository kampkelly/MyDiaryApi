'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _User2 = require('../models/User');

var _User3 = _interopRequireDefault(_User2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

_dotenv2.default.config();

var UserController = function (_User) {
	_inherits(UserController, _User);

	function UserController() {
		_classCallCheck(this, UserController);

		var _this = _possibleConstructorReturn(this, (UserController.__proto__ || Object.getPrototypeOf(UserController)).call(this));

		_this.user = '';
		_this.transporter = _nodemailer2.default.createTransport({
			service: process.env.emailHost,
			auth: {
				user: process.env.emailUsername,
				pass: process.env.emailPassword
			}
		});
		return _this;
	}

	_createClass(UserController, [{
		key: 'signUp',
		value: function signUp(req, res) {
			var _this2 = this;

			var _req$body = req.body,
			    email = _req$body.email,
			    password = _req$body.password,
			    confirmPassword = _req$body.confirmPassword,
			    fullName = _req$body.fullName,
			    dateOfBirth = _req$body.dateOfBirth;

			var regEx = /^\d{4}-\d{2}-\d{2}$/;
			if (email === ' ' || fullName === ' ' || password === ' ') {
				this.responseFormat(res, 422, 'Please fill all the input fields!', 'Failed', 'user', []);
			} else if (password.length < 6) {
				this.responseFormat(res, 422, 'Password length must be at least 6 characters!', 'Failed', 'user', []);
			} else if (password !== confirmPassword) {
				this.responseFormat(res, 401, 'Passwords do not match!', 'Failed', 'user', []);
			} else if (!email || !fullName || !password) {
				this.responseFormat(res, 400, 'Bad Request!', 'Failed', 'user', []);
			} else if (dateOfBirth && dateOfBirth.match(regEx) === null) {
				this.responseFormat(res, 422, 'Date of birth is not in the right format (yyyy-mm-dd)!', 'Failed', 'user', []);
			} else {
				req.body.email = req.body.email.toLowerCase().replace(/\s+/g, '');
				req.body.password = req.body.password.toLowerCase();
				this.create(req, function (error, response) {
					if (error) {
						_this2.responseFormat(res, 409, error, 'Failed', 'user', []);
					} else {
						var payload = {
							email: req.body.email,
							id: response.rows[0].id
						};
						var user = response.rows[0];
						user = Object.assign({}, user);
						delete user.password;
						var token = _jsonwebtoken2.default.sign(payload, process.env.secret_token, { expiresIn: 60000 });
						_this2.processMail('support@mydiary.com', email, 'Welcome To MyDiary', 'Hi ' + fullName + ', welcome to MyDiary. These are your signin details - email: "' + email + '", password: "' + password + '". Please keep them safe. Thank you!');
						res.status(201).json({
							user: user,
							token: token,
							message: 'You have successfully signed up and signed in!',
							status: 'Success'
						});
					}
				});
			}
		}
	}, {
		key: 'signIn',
		value: function signIn(req, res) {
			var _this3 = this;

			var _req$body2 = req.body,
			    email = _req$body2.email,
			    password = _req$body2.password;

			if (email === ' ' || password === ' ') {
				this.responseFormat(res, 422, 'Please fill all the input fields!', 'Failed', 'user', []);
			} else if (!email || !password) {
				this.responseFormat(res, 400, 'Bad Request!', 'Failed', 'user', []);
			} else if (password.length < 6) {
				this.responseFormat(res, 422, 'Password length must be at least 6 characters!', 'Failed', 'user', []);
			} else {
				this.loginUser(req, function (err, response) {
					if (err) {
						_this3.responseFormat(res, 500, err, 'Failed', 'user', []);
					} else if (!response.rows || response.rows[0] === undefined) {
						_this3.responseFormat(res, 401, 'Unauthorized! You are not allowed to log in!', 'Failed', 'user', []);
					} else {
						var user = response.rows[0];
						var payload = {
							email: response.rows[0].email,
							id: response.rows[0].id
						};
						user = Object.assign({}, user);
						delete user.password;
						var token = _jsonwebtoken2.default.sign(payload, process.env.secret_token, { expiresIn: 60000 });
						res.status(200).json({
							user: user,
							token: token,
							message: 'You have signed in successfully!',
							status: 'Success'
						});
					}
				});
			}
		}
	}, {
		key: 'show',
		value: function show(req, res) {
			var _this4 = this;

			this.showUser(req, function (err, response) {
				if (err) {
					_this4.responseFormat(res, 400, err, 'Failed', 'user', []);
				} else {
					var user = response.rows[0];
					user = Object.assign({}, user);
					delete user.password;
					_this4.responseFormat(res, 200, 'Retrieved!', 'Success', 'user', user);
				}
			});
		}
	}, {
		key: 'update',
		value: function update(req, res) {
			var _this5 = this;

			if (!req.body.email || !req.body.fullName) {
				this.responseFormat(res, 400, 'Bad Request!', 'Failed', 'user', []);
			} else if (req.body.email === ' ' || req.body.fullName === ' ') {
				this.responseFormat(res, 422, 'Please fill all the input fields!', 'Failed', 'user', []);
			} else {
				this.updateUser(req, function (err, response) {
					if (err) {
						_this5.responseFormat(res, 400, err, 'Failed', 'user', []);
					} else {
						var user = response.rows[0];
						user = Object.assign({}, user);
						delete user.password;
						_this5.responseFormat(res, 200, 'Your Profile has been updated!', 'Success', 'user', user);
					}
				});
			}
		}
	}, {
		key: 'saveNotification',
		value: function saveNotification(req, res) {
			var _this6 = this;

			if (!req.body.reminderTime) {
				this.responseFormat(res, 400, 'Bad Request!', 'Failed', 'user', []);
			} else if (req.body.reminderTime === ' ') {
				this.responseFormat(res, 422, 'Please pick a date for your notification!', 'Failed', 'user', []);
			} else {
				this.setReminder(req, function (err, response) {
					if (err) {
						_this6.responseFormat(res, 400, err, 'Failed', 'user', []);
					} else {
						var user = response.rows[0];
						user = Object.assign({}, user);
						delete user.password;
						_this6.responseFormat(res, 200, 'Your notification setting has been updated!', 'Success', 'user', user);
					}
				});
			}
		}
	}, {
		key: 'forgotPassword',
		value: function forgotPassword(req, res) {
			var _this7 = this;

			if (!req.body.email) {
				this.responseFormat(res, 400, 'Bad Request!', 'Failed', 'user', []);
			} else if (req.body.email === ' ') {
				this.responseFormat(res, 422, 'Please enter email!', 'Failed', 'user', []);
			} else {
				this.sendNewPassword(req, function (err, response, password) {
					if (err) {
						_this7.responseFormat(res, 404, err, 'Failed', 'user', []);
					} else {
						_this7.processMail('support@mydiary.com', response.rows[0].email, 'Password Reset For MyDiary', 'Hi ' + response.rows[0].fullname + ', you requested to reset your password. This is your new password: "' + password + '", you will need this to login as from now on. Please keep it safe. If this was not done by you. Please contact us. Thank you!');
						_this7.responseFormat(res, 200, 'Your password has been reset and email sent to your email address', 'Success', 'email', response.rows[0].email);
					}
				});
			}
		}
	}, {
		key: 'processMail',
		value: function processMail(from, to, subject, text) {
			var mailOptions = {
				from: from, to: to, subject: subject, text: text
			};
			this.transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.log(error);
				} else {
					console.log('Email sent: ' + info.response);
				}
			});
		}
	}, {
		key: 'cronEmail',
		value: function cronEmail(req, res) {
			var _this8 = this;

			this.getAllUsers(req, function (error, response) {
				if (error) {
					_this8.responseFormat(res, 409, error, 'Failed', 'data', []);
				} else {
					var user = '';
					for (var i = 0; i < response.rows.length; i += 1) {
						user = response.rows[i];
						if (user.remindertime !== null && user.remindertime !== ' ') {
							var currentHour = (0, _moment2.default)().get('hour');
							var reminderHour = user.remindertime.split(':')[0];
							if (currentHour - reminderHour === 0) {
								_this8.processMail('support@mydiary.com', user.email, 'Notification For MyDiary', 'Hi ' + user.fullname + ', you are receiving this email because you have chosen to be reminded daily to add a new entry to your MyDiary application. Thank you!');
							}
						}
					}
					_this8.responseFormat(res, 200, 'Cron job ran successfully!', 'Success', 'data', []);
				}
			});
		}
		// eslint-disable-next-line

	}, {
		key: 'responseFormat',
		value: function responseFormat(res, code, message, status, data, value) {
			res.status(code).json(_defineProperty({
				message: message,
				status: status
			}, data, value));
		}
	}]);

	return UserController;
}(_User3.default);

exports.default = UserController;
//# sourceMappingURL=UserController.js.map
