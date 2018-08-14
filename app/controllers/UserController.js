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
			service: 'mailtrap',
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
			var _req$body = req.body,
			    email = _req$body.email,
			    password = _req$body.password,
			    confirmPassword = _req$body.confirmPassword,
			    fullName = _req$body.fullName,
			    dateOfBirth = _req$body.dateOfBirth;

			var regEx = /^\d{4}-\d{2}-\d{2}$/;
			if (email === ' ' || fullName === ' ' || password === ' ') {
				res.status(422).json({
					message: 'Please fill all the input fields!',
					status: 'Failed',
					user: []
				});
			} else if (password.length < 6) {
				res.status(422).json({
					message: 'Password length must be at least 6 characters!',
					status: 'Failed',
					user: []
				});
			} else if (password !== confirmPassword) {
				res.status(401).json({
					message: 'Passwords do not match!',
					status: 'Failed',
					user: []
				});
			} else if (!email || !fullName || !password) {
				res.status(400).json({
					message: 'Bad Request!',
					status: 'Failed',
					user: []
				});
			} else if (dateOfBirth && dateOfBirth.match(regEx) === null) {
				res.status(422).json({
					message: 'Date of birth is not in the right format (yyyy-mm-dd)!',
					status: 'Failed',
					user: []
				});
			} else {
				req.body.email = req.body.email.toLowerCase().replace(/\s+/g, '');
				req.body.password = req.body.password.toLowerCase();
				this.create(req, function (error, response) {
					if (error) {
						res.status(409).json({
							message: error,
							status: 'Failed',
							user: []
						});
					} else {
						var payload = {
							email: req.body.email,
							id: response.rows[0].id
						};
						var user = response.rows[0];
						user = Object.assign({}, user);
						delete user.password;
						var token = _jsonwebtoken2.default.sign(payload, process.env.secret_token, { expiresIn: 60000 });
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
			var _req$body2 = req.body,
			    email = _req$body2.email,
			    password = _req$body2.password;

			if (email === ' ' || password === ' ') {
				res.status(422).json({
					message: 'Please fill all the input fields!',
					status: 'Failed',
					user: []
				});
			} else if (!email || !password) {
				res.status(400).json({
					message: 'Bad Request!',
					status: 'Failed',
					user: []
				});
			} else if (password.length < 6) {
				res.status(422).json({
					message: 'Password length must be at least 6 characters!',
					status: 'Failed',
					user: []
				});
			} else {
				this.loginUser(req, function (err, response) {
					if (err) {
						res.status(500).json({
							message: err,
							status: 'Failed',
							user: []
						});
					} else if (!response.rows || response.rows[0] === undefined) {
						res.status(401).json({
							message: 'Unauthorized! You are not allowed to log in!',
							status: 'Failed',
							user: []
						});
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
			this.showUser(req, function (err, response) {
				if (err) {
					res.status(400).json({
						message: err,
						status: 'Failed',
						user: []
					});
				} else {
					var user = response.rows[0];
					user = Object.assign({}, user);
					delete user.password;
					res.status(200).json({
						message: 'Retrieved!',
						status: 'Success',
						user: { user: user }
					});
				}
			});
		}
	}, {
		key: 'update',
		value: function update(req, res) {
			if (!req.body.email || !req.body.fullName) {
				res.status(400).json({
					message: 'Bad Request!',
					status: 'Failed',
					user: []
				});
			} else if (req.body.email === ' ' || req.body.fullName === ' ') {
				res.status(422).json({
					message: 'Please fill all the input fields!',
					status: 'Failed',
					user: []
				});
			} else {
				this.updateUser(req, function (err, response) {
					if (err) {
						res.status(400).json({
							message: err,
							status: 'Failed',
							user: []
						});
					} else {
						var user = response.rows[0];
						user = Object.assign({}, user);
						delete user.password;
						res.status(200).json({
							user: user,
							message: 'Your Profile has been updated!',
							status: 'Success'
						});
					}
				});
			}
		}
	}, {
		key: 'saveNotification',
		value: function saveNotification(req, res) {
			if (!req.body.reminderTime) {
				res.status(400).json({
					message: 'Bad Request!',
					status: 'Failed',
					user: []
				});
			} else if (req.body.reminderTime === ' ') {
				res.status(422).json({
					message: 'Please pick a date for your notification!',
					status: 'Failed',
					user: []
				});
			} else {
				this.setReminder(req, function (err, response) {
					if (err) {
						res.status(400).json({
							message: err,
							status: 'Failed',
							user: []
						});
					} else {
						var user = response.rows[0];
						user = Object.assign({}, user);
						delete user.password;
						res.status(200).json({
							user: user,
							message: 'Your notification setting has been updated!',
							status: 'Success'
						});
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
			var _this2 = this;

			this.getAllUsers(req, function (error, response) {
				if (error) {
					res.status(409).json({
						message: error,
						status: 'Failed',
						data: []
					});
				} else {
					var user = '';
					for (var i = 0; i < response.rows.length; i += 1) {
						user = response.rows[i];
						if (user.remindertime !== null && user.remindertime !== ' ') {
							var currentHour = (0, _moment2.default)().get('hour');
							var reminderHour = user.remindertime.split(':')[0];
							if (currentHour - reminderHour === 0) {
								_this2.processMail('support@mydiary.com', user.email, 'Notification For MyDiary', 'Hi ' + user.fullname + ', you are receiving this email because you have chosen to be reminded daily to add a new entry to your MyDiary application. Thank you!');
							}
						}
					}
					res.status(200).json({
						message: 'Retrieved',
						status: 'Success',
						data: 'Cron job ran successfully!'
					});
				}
			});
		}
	}]);

	return UserController;
}(_User3.default);

exports.default = UserController;
//# sourceMappingURL=UserController.js.map
