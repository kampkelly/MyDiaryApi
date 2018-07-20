import chai from 'chai';
import dotenv from 'dotenv';
import Request from '../lib/requests';
import { mainServer } from '../app';

dotenv.config();
const { expect } = chai;
const request = new Request();
const user = {
	email: 'user1@example.com',
	password: 'password',
	fullName: 'User Name',
	dob: '2018-04',
};

describe('User Tests', () => {
	after(() => {
		mainServer.close();
	});
	describe('signupUser()', () => {
		it('should signup a user with correct form details', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/users`;
			request.postOrPut('POST', url, user, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(201);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.message).to.be.equal('You have successfully signed up!');
				done();
			});
		}).timeout(10000);

		it('should validate false on submitting empty field', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/users`;
			const tempUser = {
				email: ' ',
				password: 'password',
				fullName: 'User Name',
				dob: '2018-04',
			};
			request.postOrPut('POST', url, tempUser, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.error).to.be.equal('Please fill in all the fields properly!');
				done();
			});
		}).timeout(10000);

		it('should show error on sending incorrect form data', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/users`;
			const tempUser = {
				email: 'user1@example.com',
				password: 'password',
				username: 'User Name',
				dob: '2018-04',
			};
			request.postOrPut('POST', url, tempUser, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.error).to.be.equal('Invalid Request!');
				done();
			});
		}).timeout(10000);

		it('should not allow same email to signup twice', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/users`;
			request.postOrPut('POST', url, user, (error, res, body) => {
				console.log(`${error}/${res}/${body}`);
			});
			request.postOrPut('POST', url, user, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(409);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.error).to.be.equal('This email has already been taken!');
				done();
			});
		}).timeout(10000);
	});

	describe('signinUser()', () => {
		it('should signin a user whose email is present', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/users/signin`;
			const formData = {
				email: 'user1@example.com',
				password: 'password',
			};
			request.postOrPut('POST', url, formData, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.message).to.be.equal('You have successfully signed in!');
				done();
			});
		}).timeout(10000);

		it('should validate false on submitting empty field', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/users/signin`;
			const tempUser = {
				email: ' ',
				password: 'password',
			};
			request.postOrPut('POST', url, tempUser, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.error).to.be.equal('Please fill in all the fields properly!');
				done();
			});
		}).timeout(10000);

		it('should show error on sending incorrect form data', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/users/signin`;
			const tempUser = {
				username: 'user1@example.com',
				password: 'password',
			};
			request.postOrPut('POST', url, tempUser, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.error).to.be.equal('Invalid Request!');
				done();
			});
		}).timeout(10000);

		it('do not signin user whose email is not present', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/users/signin`;
			const tempUser = {
				email: 'absentuser1@example.com',
				password: 'password',
			};
			request.postOrPut('POST', url, tempUser, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(401);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.error).to.be.equal('Unauthorized! You are not allowed to log in!');
				done();
			});
		}).timeout(10000);
	});

	describe('showProfile()', () => {
		it('should show a users profile whose id is valid', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/users/0`;
			request.getOrDelete('GET', url, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject).to.be.a('object');
				done();
			});
		}).timeout(10000);

		it('should show error if user id is invalid', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/users/10`;
			request.getOrDelete('GET', url, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(404);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.error).to.be.equal('Not Found! This user does not exist!');
				done();
			});
		}).timeout(10000);
	});

	describe('UpdateProfile()', () => {
		it('should update a users profile who exists', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/users/0`;
			const formData = {
				email: 'mynewemail@gmail.com',
				fullName: 'New User',
				dob: '2018-04',
			};
			request.postOrPut('PUT', url, formData, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.message).to.be.equal('User Profile has been updated!');
				done();
			});
		}).timeout(10000);

		it('should return error for user who does not exist', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/users/10`;
			const formData = {
				email: 'mynewemail@gmail.com',
				fullName: 'New User',
				dob: '2018-04',
			};
			request.postOrPut('PUT', url, formData, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(404);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.error).to.be.equal('This user does not exist!');
				done();
			});
		}).timeout(10000);

		it('should validate false on submitting empty field', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/users/0`;
			const formData = {
				email: ' ',
				fullName: 'User Name',
				dob: '2018-04',
			};
			request.postOrPut('PUT', url, formData, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.error).to.be.equal('Please fill in all the fields properly!');
				done();
			});
		}).timeout(10000);

		it('should show error on sending incorrect form data', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/users/0`;
			const formData = {
				email: 'user1@example.com',
				username: 'User Name',
				dob: '2018-04',
			};
			request.postOrPut('PUT', url, formData, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.error).to.be.equal('Invalid Request!');
				done();
			});
		}).timeout(10000);
	});

	describe('saveNotifications()', () => {
		it('should save notifications when user and form data are correct', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/users/0/notifications`;
			const formData = {
				reminderTime: '10:00',
			};
			request.postOrPut('PUT', url, formData, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.message).to.be.equal('Your notification settings has been updated!');
				done();
			});
		}).timeout(10000);

		it('should return error when form field is empty', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/users/0/notifications`;
			const formData = {
				reminderTime: ' ',
			};
			request.postOrPut('PUT', url, formData, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.error).to.be.equal('Please pick a date for your notification!');
				done();
			});
		}).timeout(10000);

		it('should return error when wrong form data is sent', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/users/0/notifications`;
			const formData = {
				reminderDay: '10:00',
			};
			request.postOrPut('PUT', url, formData, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.error).to.be.equal('Invalid request!');
				done();
			});
		}).timeout(10000);

		it('should return error on trying to update user that does not exist', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/users/10/notifications`;
			const formData = {
				reminderTime: '10:00',
			};
			request.postOrPut('PUT', url, formData, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(404);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.error).to.be.equal('Not Found! This user does not exist!');
				done();
			});
		}).timeout(10000);
	});
});
