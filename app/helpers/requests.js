'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Request = function () {
	function Request() {
		_classCallCheck(this, Request);

		this.request = _request2.default;
	}

	_createClass(Request, [{
		key: 'getOrDelete',
		value: function getOrDelete(method, url, headers, callback) {
			this.request({
				uri: url,
				method: method,
				headers: headers
			}, function (error, response, body) {
				callback(error, response, body);
			});
		}
	}, {
		key: 'postOrPut',
		value: function postOrPut(method, url, formData, headers, callback) {
			this.request({
				uri: url,
				method: method,
				form: formData,
				headers: headers
			}, function (error, response, body) {
				callback(error, response, body);
			});
		}
	}]);

	return Request;
}();

exports.default = Request;
//# sourceMappingURL=requests.js.map
