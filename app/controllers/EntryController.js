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
			this.allEntries(req, function (error, response) {
				if (error) {
					res.status(409).json({
						message: error,
						status: 'Failed',
						entries: []
					});
				} else {
					res.status(200).json({
						message: 'Retrieved',
						status: 'Success',
						entries: response.rows
					});
				}
			});
		}
	}, {
		key: 'show',
		value: function show(req, res) {
			this.showEntry(req, function (error, code, response) {
				if (error) {
					res.status(code).json({
						message: error,
						status: 'Failed',
						entry: []
					});
				} else {
					res.status(200).json({
						message: 'Retrieved',
						status: 'Success',
						entry: response.rows[0]
					});
				}
			});
		}
	}, {
		key: 'create',
		value: function create(req, res) {
			if (req.body.title === ' ' || req.body.description === ' ') {
				res.status(422).json({
					message: 'Please fill all the input fields!',
					status: 'Failed',
					entry: []
				});
			} else if (req.body.title && req.body.description) {
				if (req.body.title.length < 10) {
					res.status(409).json({
						message: 'Your title is too short, minimum 10 letters!',
						status: 'Failed',
						entry: []
					});
				} else if (req.body.description.length < 20) {
					res.status(409).json({
						message: 'Your description is too short, minimum 20 letters!',
						status: 'Failed',
						entry: []
					});
				} else {
					this.createEntry(req, function (error) {
						if (error) {
							res.status(409).json({
								message: error,
								status: 'Failed',
								entry: { error: error }
							});
						} else {
							res.status(201).json({
								message: 'Entry has been created!',
								status: 'Success',
								entry: []
							});
						}
					});
				}
			} else {
				res.status(400).json({
					message: 'Bad request!',
					status: 'Failed',
					entry: []
				});
			}
		}
	}, {
		key: 'update',
		value: function update(req, res) {
			if (req.body.title === ' ' || req.body.description === ' ') {
				res.status(422).json({
					message: 'Please fill all the input fields!',
					status: 'Failed',
					entry: []
				});
			} else if (req.body.title && req.body.description) {
				if (req.body.title.length < 10) {
					res.status(409).json({
						message: 'Your title is too short, minimum 10 letters!',
						status: 'Failed',
						entry: []
					});
				} else if (req.body.description.length < 20) {
					res.status(409).json({
						message: 'Your description is too short, minimum 20 letters!',
						status: 'Failed',
						entry: []
					});
				} else {
					this.updateEntry(req, function (error, code) {
						if (error) {
							res.status(code).json({
								message: error,
								status: 'Failed',
								entry: []
							});
						} else {
							res.status(200).json({
								message: 'This entry has been updated!',
								status: 'Success',
								entry: []
							});
						}
					});
				}
			} else {
				res.status(400).json({
					message: 'Bad request!',
					status: 'Failed',
					entry: []
				});
			}
		}
	}, {
		key: 'delete',
		value: function _delete(req, res) {
			this.deleteEntry(req, function (error) {
				if (error) {
					res.status(400).json({
						message: error,
						status: 'Failed',
						entry: []
					});
				} else {
					res.status(204).json({
						message: 'Entry Deleted!',
						status: 'Success',
						entry: []
					});
				}
			});
		}
	}]);

	return EntryController;
}(_Entry3.default);

exports.default = EntryController;
//# sourceMappingURL=EntryController.js.map
