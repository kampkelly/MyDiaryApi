'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _Entry2 = require('../models/Entry');

var _Entry3 = _interopRequireDefault(_Entry2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

_dotenv2.default.config();

var EntryController = function (_Entry) {
	_inherits(EntryController, _Entry);

	function EntryController() {
		_classCallCheck(this, EntryController);

		var _this = _possibleConstructorReturn(this, (EntryController.__proto__ || Object.getPrototypeOf(EntryController)).call(this));

		_this.entry = '';
		return _this;
	}

	_createClass(EntryController, [{
		key: 'index',
		value: function index(req, res) {
			var _this2 = this;

			this.allEntries(req, function (error, response) {
				if (error) {
					_this2.responseFormat(res, 409, error, 'Failed', 'entries', []);
				} else {
					_this2.responseFormat(res, 200, 'Retrieved', 'Success', 'entries', response.rows);
				}
			});
		}
	}, {
		key: 'show',
		value: function show(req, res) {
			var _this3 = this;

			this.showEntry(req, function (error, code, response) {
				if (error) {
					_this3.responseFormat(res, code, error, 'Failed', 'entry', []);
				} else {
					_this3.responseFormat(res, 200, 'Retrieved', 'Success', 'entry', response.rows[0]);
				}
			});
		}
	}, {
		key: 'create',
		value: function create(req, res) {
			var _this4 = this;

			if (req.body.title === ' ' || req.body.description === ' ') {
				this.responseFormat(res, 422, 'Please fill all the input fields!', 'Failed', 'entry', []);
			} else if (req.body.title && req.body.description) {
				if (req.body.title.length < 10) {
					this.responseFormat(res, 409, 'Your title is too short, minimum 10 letters!', 'Failed', 'entry', []);
				} else if (req.body.description.length < 20) {
					this.responseFormat(res, 409, 'Your description is too short, minimum 20 letters!', 'Failed', 'entry', []);
				} else {
					this.createEntry(req, function (error, response) {
						if (error) {
							_this4.responseFormat(res, 409, error, 'Failed', 'entry', error);
						} else {
							_this4.responseFormat(res, 201, 'Entry has been created!', 'Success', 'entry', response.rows[0]);
						}
					});
				}
			} else {
				this.responseFormat(res, 400, 'Bad request!', 'Failed', 'entry', []);
			}
		}
	}, {
		key: 'update',
		value: function update(req, res) {
			var _this5 = this;

			if (req.body.title === ' ' || req.body.description === ' ') {
				this.responseFormat(res, 422, 'Please fill all the input fields!', 'Failed', 'entry', []);
			} else if (req.body.title && req.body.description) {
				if (req.body.title.length < 10) {
					this.responseFormat(res, 409, 'Your title is too short, minimum 10 letters!', 'Failed', 'entry', []);
				} else if (req.body.description.length < 20) {
					this.responseFormat(res, 409, 'Your description is too short, minimum 20 letters!', 'Failed', 'entry', []);
				} else {
					this.updateEntry(req, function (error, code, response) {
						if (error) {
							_this5.responseFormat(res, code, error, 'Failed', 'entry', []);
						} else {
							_this5.responseFormat(res, 200, 'This entry has been updated!', 'Success', 'entry', response.rows[0]);
						}
					});
				}
			} else {
				this.responseFormat(res, 400, 'Bad request!', 'Failed', 'entry', []);
			}
		}
	}, {
		key: 'delete',
		value: function _delete(req, res) {
			var _this6 = this;

			this.deleteEntry(req, function (error) {
				if (error) {
					_this6.responseFormat(res, 400, error, 'Failed', 'entry', []);
				} else {
					_this6.responseFormat(res, 204, 'Entry Deleted!', 'Success', 'entry', []);
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

	return EntryController;
}(_Entry3.default);

exports.default = EntryController;
//# sourceMappingURL=EntryController.js.map
