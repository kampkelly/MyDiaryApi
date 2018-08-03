'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _requests = require('../helpers/requests');

var _requests2 = _interopRequireDefault(_requests);

var _app = require('../app');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();
var expect = _chai2.default.expect;

var request = new _requests2.default();
var user = {
	email: 'kamp@gmail.com',
	password: 'password',
	confirmPassword: 'password',
	fullName: 'Kamp Name',
	dateOfBirth: '2018-04-02'
};
var token = null;
var headers = {
	token: token
};

describe('User Tests', function () {
	after(function () {
		_app.mainServer.close();
	});
	describe('auth()', function () {
		it('should signup a user with correct form details', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/auth/signup';
			request.postOrPut('POST', url, user, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(201);
				expect(jsonObject.message).to.be.equal('You have successfully signed up and signed in!');
				expect(jsonObject.status).to.be.equal('Success');
				done();
			});
		}).timeout(30000);

		it('should validate false on submitting empty field', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/auth/signup';
			var tempUser = {
				email: ' ',
				password: 'password',
				confirmPassword: 'password',
				fullName: 'User Name',
				dateOfBirth: '2018-04-02'
			};
			request.postOrPut('POST', url, tempUser, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject.message).to.be.equal('Please fill all the input fields!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should show error on sending incorrect form data', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/auth/signup';
			var tempUser = {
				email: 'user1@example.com',
				password: 'password',
				confirmPassword: 'password',
				username: 'User Name',
				dateOfBirth: '2018-04-02'
			};
			request.postOrPut('POST', url, tempUser, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.message).to.be.equal('Bad Request!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should show error on trying to signup with same email', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/auth/signup';
			request.postOrPut('POST', url, user, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(409);
				expect(jsonObject.message).to.be.equal('A user with this email already exists!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should show password too short', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/auth/signup';
			var tempUser = {
				email: 'user1@example.com',
				password: 'pass',
				confirmPassword: 'pass',
				fullName: 'User Name',
				dateOfBirth: '2018-04-02'
			};
			request.postOrPut('POST', url, tempUser, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject.message).to.be.equal('Password length must be at least 6 characters!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should show password not matching with confirm password', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/auth/signup';
			var tempUser = {
				email: 'user1@example.com',
				password: 'password',
				confirmPassword: 'password31',
				fullName: 'User Name',
				dateOfBirth: '2018-04-02'
			};
			request.postOrPut('POST', url, tempUser, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(401);
				expect(jsonObject.message).to.be.equal('Passwords do not match!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);
	});

	describe('signinUser()', function () {
		it('should signin user whose account exists', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/auth/login';
			var formData = {
				email: 'kamp@gmail.com',
				password: 'password'
			};
			request.postOrPut('POST', url, formData, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				headers.token = jsonObject.user.token;
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject.message).to.be.equal('You have signed in successfully!');
				expect(jsonObject.status).to.be.equal('Success');
				done();
			});
		}).timeout(30000);

		it('should validate false on submitting empty field', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/auth/login';
			var tempUser = {
				email: ' ',
				password: 'password'
			};
			request.postOrPut('POST', url, tempUser, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject.message).to.be.equal('Please fill all the input fields!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should show error on sending incorrect form data', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/auth/login';
			var tempUser = {
				username: 'user1@example.com',
				password: 'password'
			};
			request.postOrPut('POST', url, tempUser, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.message).to.be.equal('Bad Request!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('do not signin user whose email is not present', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/auth/login';
			var tempUser = {
				email: 'absentuser1@example.com',
				password: 'password'
			};
			request.postOrPut('POST', url, tempUser, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(401);
				expect(jsonObject.message).to.be.equal('Unauthorized! You are not allowed to log in!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);
	});

	describe('showProfile()', function () {
		it('should show a users profile who is signed in', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/user/profile';
			request.getOrDelete('GET', url, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject.message).to.not.be.an('Retrieved!');
				expect(jsonObject.status).to.be.equal('Success');
				done();
			});
		}).timeout(30000);

		it('should show error if token is invalid', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/user/profile';
			request.getOrDelete('GET', url, 'nnuio', function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(401);
				expect(jsonObject.message).to.be.equal('Unauthorized! You are not allowed to log in!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);
	});

	describe('UpdateProfile()', function () {
		it('should update a users profile who exists', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/user/profile';
			var formData = {
				email: 'mynewemail@gmail.com',
				fullName: 'New User',
				dateOfBirth: '2018-04-02'
			};
			request.postOrPut('PUT', url, formData, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject.message).to.be.equal('Your Profile has been updated!');
				expect(jsonObject.status).to.be.equal('Success');
				done();
			});
		}).timeout(30000);

		it('should validate false on submitting empty field', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/user/profile';
			var formData = {
				email: ' ',
				fullName: 'User Name',
				dateOfBirth: '2018-04'
			};
			request.postOrPut('PUT', url, formData, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject.message).to.be.equal('Please fill all the input fields!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should show error on sending incorrect form data', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/user/profile';
			var formData = {
				email: 'user1@example.com',
				username: 'User Name',
				dateOfBirth: '2018-04'
			};
			request.postOrPut('PUT', url, formData, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.message).to.be.equal('Bad Request!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);
	});

	describe('saveNotifications()', function () {
		it('should update user notification', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/user/notifications';
			var formData = {
				reminderTime: '10:00:00'
			};
			request.postOrPut('PUT', url, formData, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject.message).to.be.equal('Your notification setting has been updated!');
				expect(jsonObject.status).to.be.equal('Success');
				done();
			});
		}).timeout(30000);

		it('should return error when form field is empty', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/user/notifications';
			var formData = {
				reminderTime: ' '
			};
			request.postOrPut('PUT', url, formData, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject.message).to.be.equal('Please pick a date for your notification!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should return error when wrong form data is sent', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/user/notifications';
			var formData = {
				reminderDay: '10:00'
			};
			request.postOrPut('PUT', url, formData, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.message).to.be.equal('Bad Request!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);
	});
});
//# sourceMappingURL=users-spec.js.map
