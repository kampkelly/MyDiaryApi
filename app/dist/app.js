'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.mainServer = exports.mainApp = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();
var app = (0, _express2.default)();

app.set('port', process.env.PORT || 3000);

app.set('appVersion', '/api/v1');
app.use((0, _cors2.default)());
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json());
var server = app.listen(app.get('port'), function () {
	// console.log('Application started. Listening :)');
});

var mainApp = exports.mainApp = app;
var mainServer = exports.mainServer = server;
//# sourceMappingURL=app.js.map
