'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pg = require('pg');

var _pg2 = _interopRequireDefault(_pg);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_dotenv2.default.config();

var Entry = function () {
	function Entry() {
		_classCallCheck(this, Entry);

		if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
			this.connectionString = process.env.DATABASE_URL;
		} else if (process.env.NODE_ENV === 'test') {
			this.connectionString = process.env.test_DATABASE_URL;
		}
		this.pool = new _pg2.default.Pool({
			connectionString: this.connectionString
		});
		this.schema = {
			title: _joi2.default.string().min(2),
			description: _joi2.default.string().trim().min(2),
			userId: _joi2.default.number()
		};
	}

	_createClass(Entry, [{
		key: 'allEntries',
		value: function allEntries(req, callback) {
			var userId = req.userData.id;
			var sql = void 0;
			var values = void 0;
			if (req.query.limit) {
				sql = 'SELECT * FROM entries WHERE user_id=$1 ORDER BY id DESC LIMIT $2';
				values = [userId, req.query.limit];
			} else {
				sql = 'SELECT * FROM entries WHERE user_id=$1 ORDER BY id DESC';
				values = [userId];
			}
			this.pool.query(sql, values, function (error, res) {
				if (error) {
					callback(error.detail, res);
				} else {
					callback(error, res);
				}
			});
		}
	}, {
		key: 'createEntry',
		value: function createEntry(req, callback) {
			var _this = this;

			var _req$body = req.body,
			    title = _req$body.title,
			    description = _req$body.description;

			var userId = req.userData.id;
			_joi2.default.validate({
				title: title, description: description, userId: userId
			}, this.schema, function (err) {
				if (err) {
					callback(err.details[0].message);
				} else {
					var sql = 'INSERT INTO entries(title, description, user_id) VALUES($1, $2, $3)';
					var values = [title, description, userId];
					_this.pool.query(sql, values, function (error) {
						if (error) {
							callback(error);
						} else {
							callback(error);
						}
					});
				}
			});
		}
	}, {
		key: 'showEntry',
		value: function showEntry(req, callback) {
			var userId = req.userData.id;
			var sql = 'SELECT * FROM entries WHERE id=$1';
			var values = [req.params.id];
			this.pool.query(sql, values, function (error, response) {
				if (error) {
					callback(error, 400, false);
				} else {
					var res = response;
					if (response.rows.length >= 1) {
						if (res.rows[0].user_id === userId) {
							callback(error, 200, res);
						} else {
							callback('You do not have permission to view this entry!', 403, false);
						}
					} else {
						callback('No entry found!', 404, false);
					}
				}
			});
		}
	}, {
		key: 'updateEntry',
		value: function updateEntry(req, callback) {
			var _this2 = this;

			var _req$body2 = req.body,
			    title = _req$body2.title,
			    description = _req$body2.description;

			var userId = req.userData.id;
			_joi2.default.validate({
				title: title, description: description, userId: userId
			}, this.schema, function (err) {
				if (err) {
					callback(err.details[0].message);
				} else {
					var sql = 'SELECT * FROM entries WHERE id=$1';
					var values = [req.params.id];
					_this2.pool.query(sql, values, function (error, response) {
						if (error) {
							callback(error.detail, 400);
						} else if (response.rows.length < 1) {
							callback('This entry does not exist!', 404);
						} else if (!error) {
							if (response.rows[0].user_id === userId) {
								var time = Date.now();
								var timeCreated = (0, _moment2.default)(response.rows[0].createdAt).format('X');
								var timeNow = (0, _moment2.default)().format('X');
								var diff = (timeNow - timeCreated) / 86400;
								if (diff <= 1) {
									var updateSql = 'UPDATE entries SET title=$1, description=$2 WHERE id=$3';
									var updateValues = [title, description, req.params.id];
									_this2.pool.query(updateSql, updateValues, function (updateError) {
										callback(updateError, 200);
									});
								} else if (time !== response.rows[0].createdAt) {
									callback('This entry is old and can no longer be updated!', 403);
								}
							} else if (response.rows[0].user_id !== userId) {
								callback('You do not have permission to edit this entry!', 403);
							}
						}
					});
				}
			});
		}
	}, {
		key: 'deleteEntry',
		value: function deleteEntry(req, callback) {
			var _this3 = this;

			var userId = req.userData.id;
			var sql = 'SELECT * FROM entries WHERE id=$1 AND user_id=$2';
			var values = [req.params.id, userId];
			this.pool.query(sql, values, function (error, response) {
				if (error) {
					callback(error);
				} else {
					var res = response;
					if (res.rows.length >= 1) {
						var deleteSql = 'DELETE FROM entries WHERE id=$1';
						var deleteValues = [req.params.id];
						_this3.pool.query(deleteSql, deleteValues, function (deleteError) {
							callback(deleteError);
						});
					} else {
						callback('This entry does not exist or you do not have permission to delete it!');
					}
				}
			});
		}
	}]);

	return Entry;
}();

exports.default = Entry;
//# sourceMappingURL=Entry.js.map
