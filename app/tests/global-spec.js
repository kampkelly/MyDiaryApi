'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _requests = require('../helpers/requests');

var _requests2 = _interopRequireDefault(_requests);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();
var expect = _chai2.default.expect;

var request = new _requests2.default();

describe('Test Global Routes', function () {
	describe('visitInvalidRoute()', function () {
		it('should show not found when a user visits a mispelt address', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/no_entries';
			var headers = {
				'Content-Type': 'application/json'
			};
			request.getOrDelete('GET', url, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(404);
				expect(jsonObject.message).to.be.equal('Not Found! The page you are trying to access does not exist!');
				done();
			});
		}).timeout(20000);
	});
});
//# sourceMappingURL=global-spec.js.map
