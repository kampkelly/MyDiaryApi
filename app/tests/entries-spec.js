'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _requests = require('../helpers/requests');

var _requests2 = _interopRequireDefault(_requests);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();
var expect = _chai2.default.expect;

var request = new _requests2.default();
var payload = {
	email: 'coolentry@gmail.com',
	id: 1
};
var token = _jsonwebtoken2.default.sign(payload, process.env.secret_token, { expiresIn: 6000 });
var headers = {
	token: token
};

describe('Test Entries Routes', function () {
	describe('createEntry()', function () {
		it('should create an entry', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/entries';
			var formData = {
				title: ' New title is here',
				description: 'New Description can be found at this location'
			};
			request.postOrPut('POST', url, formData, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(201);
				expect(jsonObject.message).to.be.equal('Entry has been created!');
				expect(jsonObject.status).to.be.equal('Success');
				done();
			});
		}).timeout(30000);

		it('validation should fail when any form field is empty', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/entries';
			var formData = {
				title: ' ',
				description: 'New Description'
			};
			request.postOrPut('POST', url, formData, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject.message).to.be.equal('Please fill all the input fields!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should give error on sending incorrect form data', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/entries';
			var formData = {
				name: ' ',
				body: 'New Description'
			};
			request.postOrPut('POST', url, formData, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.message).to.be.equal('Bad request!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should give title too short when less than 10 letters', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/entries';
			var formData = {
				title: 'New',
				description: 'New Description for this blog post'
			};
			request.postOrPut('POST', url, formData, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(409);
				expect(jsonObject.message).to.be.equal('Your title is too short, minimum 10 letters!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should give description too short when less than 20 letters', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/entries';
			var formData = {
				title: 'The New Title Here',
				description: 'New one'
			};
			request.postOrPut('POST', url, formData, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(409);
				expect(jsonObject.message).to.be.equal('Your description is too short, minimum 20 letters!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);
	});

	describe('showAllEntries()', function () {
		it('should show all entries', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/entries';
			request.getOrDelete('GET', url, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject.message).to.be.equal('Retrieved');
				expect(jsonObject.status).to.be.equal('Success');
				done();
			});
		}).timeout(30000);

		it('should show all entries with limit in query params', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/entries?limit=4';
			request.getOrDelete('GET', url, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject.message).to.be.equal('Retrieved');
				expect(jsonObject.status).to.be.equal('Success');
				expect(jsonObject.entries).to.have.lengthOf.at.most(4);
				done();
			});
		}).timeout(30000);
	});

	describe('showOneEntries()', function () {
		it('should show one entry', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/entries/1';
			request.getOrDelete('GET', url, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject.message).to.be.equal('Retrieved');
				expect(jsonObject.status).to.be.equal('Success');
				expect(jsonObject.entry).to.be.a('Object');
				done();
			});
		}).timeout(30000);
	});

	describe('updateEntry()', function () {
		it('validation should fail when any form field is empty', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/entries/1';
			var formData = {
				title: ' ',
				description: 'Cool'
			};
			request.postOrPut('PUT', url, formData, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject.message).to.be.equal('Please fill all the input fields!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should give error when incorrect form data is sent', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/entries/1';
			var formData = {
				name: 'First Title',
				body: 'Cool'
			};
			request.postOrPut('PUT', url, formData, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.message).to.be.equal('Bad request!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should give title too short when less than 10 letters', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/entries/1';
			var formData = {
				title: 'New',
				description: 'New Description for this blog post'
			};
			request.postOrPut('PUT', url, formData, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(409);
				expect(jsonObject.message).to.be.equal('Your title is too short, minimum 10 letters!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should give description too short when less than 20 letters', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/entries/1';
			var formData = {
				title: 'The New Title Here',
				description: 'New one'
			};
			request.postOrPut('PUT', url, formData, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(409);
				expect(jsonObject.message).to.be.equal('Your description is too short, minimum 20 letters!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should update an entry', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/entries/1';
			var formData = {
				title: 'The New Title Here',
				description: 'This is the new description also'
			};
			request.postOrPut('PUT', url, formData, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject.message).to.be.equal('This entry has been updated!');
				expect(jsonObject.status).to.be.equal('Success');
				done();
			});
		}).timeout(30000);
	});

	describe('deleteEntry()', function () {
		it('should delete an entry', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/entries/1';
			request.getOrDelete('DELETE', url, headers, function (error, res, body) {
				console.log(body);
				expect(res.statusCode).to.be.equal(204);
				done();
			});
		}).timeout(30000);

		it('should show error when id doesnt exist', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/entries/700';
			request.getOrDelete('DELETE', url, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.message).to.be.equal('This entry does not exist or you do not have permission to delete it!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);
	});
});
//# sourceMappingURL=entries-spec.js.map
