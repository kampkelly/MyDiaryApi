'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pg = require('pg');

var _pg2 = _interopRequireDefault(_pg);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_dotenv2.default.config();

var User = function () {
	function User() {
		_classCallCheck(this, User);

		if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
			this.connectionString = process.env.DATABASE_URL;
		} else if (process.env.NODE_ENV === 'test') {
			this.connectionString = process.env.test_DATABASE_URL;
		}
		this.pool = new _pg2.default.Pool({
			connectionString: this.connectionString
		});
		this.schema = {
			email: _joi2.default.string().email().uppercase().trim(),
			password: _joi2.default.string().trim().min(6),
			confirmPassword: _joi2.default.string().regex(/^[a-zA-Z0-9]{3,30}$/).uppercase().trim().min(6),
			fullName: _joi2.default.string(),
			dateOfBirth: _joi2.default.string()
		};
	}

	_createClass(User, [{
		key: 'create',
		value: function create(req, callback) {
			var _this = this;

			var _req$body = req.body,
			    email = _req$body.email,
			    fullName = _req$body.fullName,
			    password = _req$body.password,
			    dateOfBirth = _req$body.dateOfBirth;

			_joi2.default.validate({
				email: email, password: password, fullName: fullName, dateOfBirth: dateOfBirth
			}, this.schema, function (err) {
				if (err) {
					callback('The email must be a valid email!');
				} else {
					var saltRounds = 10;
					var salt = _bcryptjs2.default.genSaltSync(saltRounds);
					var hash = _bcryptjs2.default.hashSync(password, salt);
					var sql = 'INSERT INTO users(fullName, email, password, dateOfBirth) VALUES($1, $2, $3, $4) RETURNING id';
					var values = [fullName, email, hash, dateOfBirth];
					_this.pool.query(sql, values, function (error, res) {
						if (error) {
							callback('A user with this email already exists!', res);
						} else {
							callback(error, res);
						}
					});
				}
			});
		}
	}, {
		key: 'loginUser',
		value: function loginUser(req, callback) {
			var _this2 = this;

			var _req$body2 = req.body,
			    email = _req$body2.email,
			    password = _req$body2.password;

			password = password.toLowerCase();
			email = email.toLowerCase().replace(/\s+/g, '');
			_joi2.default.validate({
				email: email, password: password
			}, this.schema, function (error) {
				if (error) {
					callback('The email must be a valid email!');
				} else {
					var sql = 'SELECT * FROM users WHERE email=$1 LIMIT 1';
					var values = [email];
					_this2.pool.query(sql, values, function (err, res) {
						if (err !== undefined) {
							callback(err, res);
						} else if (err === undefined) {
							if (!res.rows[0]) {
								callback(err, false);
							} else {
								var hash = res.rows[0].password;
								_bcryptjs2.default.compare(password, hash, function (errOnHash, resOnHash) {
									if (resOnHash === true) {
										callback(err, res);
									} else {
										callback(err, resOnHash);
									}
								});
							}
						}
					});
				}
			});
		}
	}, {
		key: 'showUser',
		value: function showUser(req, callback) {
			var userId = req.userData.id;
			var sql = 'SELECT * FROM users WHERE id=$1 LIMIT 1';
			var values = [userId];
			this.pool.query(sql, values, function (err, res) {
				callback(err, res);
			});
		}
	}, {
		key: 'updateUser',
		value: function updateUser(req, callback) {
			var _this3 = this;

			var userId = req.userData.id;
			var _req$body3 = req.body,
			    email = _req$body3.email,
			    fullName = _req$body3.fullName,
			    dateOfBirth = _req$body3.dateOfBirth;

			_joi2.default.validate({
				email: email
			}, this.schema, function (error) {
				if (error) {
					callback('The email must be a valid email!');
				} else {
					var sql = 'UPDATE users SET email=$1, fullName=$2, dateOfBirth=$3 WHERE id=$4';
					var values = [email, fullName, dateOfBirth, userId];
					_this3.pool.query(sql, values, function (err, res) {
						callback(err, res);
					});
				}
			});
		}
	}, {
		key: 'setReminder',
		value: function setReminder(req, callback) {
			var userId = req.userData.id;
			var sql = 'UPDATE users SET reminderTime=$1 WHERE id=$2';
			var values = [req.body.reminderTime, userId];
			this.pool.query(sql, values, function (err, res) {
				callback(err, res);
			});
		}
	}]);

	return User;
}();

exports.default = User;
//# sourceMappingURL=User.js.map
