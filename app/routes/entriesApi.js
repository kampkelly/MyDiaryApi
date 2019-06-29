'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _EntryController = require('../controllers/EntryController');

var _EntryController2 = _interopRequireDefault(_EntryController);

var _checkAuth = require('../helpers/checkAuth');

var _checkAuth2 = _interopRequireDefault(_checkAuth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var entriesRouter = _express2.default.Router();
var Entry = new _EntryController2.default();

entriesRouter.get('/entries', _checkAuth2.default, function (req, res) {
	Entry.index(req, res);
});

entriesRouter.get('/entries/:id', _checkAuth2.default, function (req, res) {
	Entry.show(req, res);
});

entriesRouter.post('/entries', _checkAuth2.default, function (req, res) {
	Entry.create(req, res);
});

entriesRouter.put('/entries/:id', _checkAuth2.default, function (req, res) {
	Entry.update(req, res);
});

entriesRouter.delete('/entries/:id', _checkAuth2.default, function (req, res) {
	Entry.delete(req, res);
});

exports.default = entriesRouter;
//# sourceMappingURL=entriesApi.js.map
