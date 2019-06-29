'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _UserController = require('../controllers/UserController');

var _UserController2 = _interopRequireDefault(_UserController);

var _checkAuth = require('../helpers/checkAuth');

var _checkAuth2 = _interopRequireDefault(_checkAuth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var usersRouter = _express2.default.Router();
var User = new _UserController2.default();

usersRouter.post('/auth/signup', function (req, res) {
	User.signUp(req, res);
});

usersRouter.post('/auth/login', function (req, res) {
	User.signIn(req, res);
});

usersRouter.post('/auth/forgot_password', function (req, res) {
	User.forgotPassword(req, res);
});

usersRouter.get('/user/profile', _checkAuth2.default, function (req, res) {
	User.show(req, res);
});

usersRouter.put('/user/profile', _checkAuth2.default, function (req, res) {
	User.update(req, res);
});

usersRouter.put('/user/notifications', _checkAuth2.default, function (req, res) {
	User.saveNotification(req, res);
});

usersRouter.get('/user/cron', function (req, res) {
	User.cronEmail(req, res);
});

exports.default = usersRouter;
//# sourceMappingURL=usersApi.js.map
