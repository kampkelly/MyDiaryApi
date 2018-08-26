import chai from 'chai';
import dotenv from 'dotenv';
import Request from '../helpers/requests';
import { mainServer } from '../app';

dotenv.config();
const { expect } = chai;
const request = new Request();
const user = {
	email: 'kamp@gmail.com',
	password: 'password',
	confirmPassword: 'password',
	fullName: 'Kamp Name',
	dateOfBirth: '2018-04-02',
};
const token = null;
const headers = {
	token,
};

describe('User Tests', () => {
	after(() => {
		mainServer.close();
	});
	describe('auth()', () => {
		it('should signup a user with correct form details', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/auth/signup`;
			request.postOrPut('POST', url, user, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(201);
				expect(jsonObject.message).to.be.equal('You have successfully signed up and signed in!');
				expect(jsonObject.status).to.be.equal('Success');
				done();
			});
		}).timeout(30000);

		it('should validate false on submitting empty field', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/auth/signup`;
			const tempUser = {
				email: ' ',
				password: 'password',
				confirmPassword: 'password',
				fullName: 'User Name',
				dateOfBirth: '2018-04-02',
			};
			request.postOrPut('POST', url, tempUser, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject.message).to.be.equal('Please fill all the input fields!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should show error on sending incorrect form data', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/auth/signup`;
			const tempUser = {
				email: 'user1@example.com',
				password: 'password',
				confirmPassword: 'password',
				username: 'User Name',
				dateOfBirth: '2018-04-02',
			};
			request.postOrPut('POST', url, tempUser, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.message).to.be.equal('Bad Request!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should show error on trying to signup with same email', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/auth/signup`;
			request.postOrPut('POST', url, user, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(409);
				expect(jsonObject.message).to.be.equal('A user with this email already exists!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should show password too short', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/auth/signup`;
			const tempUser = {
				email: 'user1@example.com',
				password: 'pass',
				confirmPassword: 'pass',
				fullName: 'User Name',
				dateOfBirth: '2018-04-02',
			};
			request.postOrPut('POST', url, tempUser, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject.message).to.be.equal('Password length must be at least 6 characters!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should show password not matching with confirm password', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/auth/signup`;
			const tempUser = {
				email: 'user1@example.com',
				password: 'password',
				confirmPassword: 'password31',
				fullName: 'User Name',
				dateOfBirth: '2018-04-02',
			};
			request.postOrPut('POST', url, tempUser, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(401);
				expect(jsonObject.message).to.be.equal('Passwords do not match!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);
	});

	describe('signinUser()', () => {
		it('should signin user whose account exists', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/auth/login`;
			const formData = {
				email: 'kamp@gmail.com',
				password: 'password',
			};
			request.postOrPut('POST', url, formData, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				headers.token = jsonObject.token;
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject.message).to.be.equal('You have signed in successfully!');
				expect(jsonObject.status).to.be.equal('Success');
				done();
			});
		}).timeout(30000);

		it('should validate false on submitting empty field', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/auth/login`;
			const tempUser = {
				email: ' ',
				password: 'password',
			};
			request.postOrPut('POST', url, tempUser, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject.message).to.be.equal('Please fill all the input fields!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should show error on sending incorrect form data', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/auth/login`;
			const tempUser = {
				username: 'user1@example.com',
				password: 'password',
			};
			request.postOrPut('POST', url, tempUser, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.message).to.be.equal('Bad Request!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('do not signin user whose email is not present', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/auth/login`;
			const tempUser = {
				email: 'absentuser1@example.com',
				password: 'password',
			};
			request.postOrPut('POST', url, tempUser, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(401);
				expect(jsonObject.message).to.be.equal('Unauthorized! You are not allowed to log in!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);
	});

	describe('showProfile()', () => {
		it('should show a users profile who is signed in', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/user/profile`;
			request.getOrDelete('GET', url, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject.message).to.not.be.an('Retrieved!');
				expect(jsonObject.status).to.be.equal('Success');
				done();
			});
		}).timeout(30000);

		it('should show error if token is invalid', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/user/profile`;
			request.getOrDelete('GET', url, [], (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(401);
				expect(jsonObject.message).to.be.equal('Unauthorized! You are not allowed to log in!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);
	});

	describe('UpdateProfile()', () => {
		it('should update a users profile who exists', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/user/profile`;
			const formData = {
				email: 'mynewemail@gmail.com',
				fullName: 'New User',
				dateOfBirth: '2018-04-02',
			};
			request.postOrPut('PUT', url, formData, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject.message).to.be.equal('Your Profile has been updated!');
				expect(jsonObject.status).to.be.equal('Success');
				done();
			});
		}).timeout(30000);

		it('should validate false on submitting empty field', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/user/profile`;
			const formData = {
				email: ' ',
				fullName: 'User Name',
				dateOfBirth: '2018-04',
			};
			request.postOrPut('PUT', url, formData, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject.message).to.be.equal('Please fill all the input fields!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should show error on sending incorrect form data', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/user/profile`;
			const formData = {
				email: 'user1@example.com',
				username: 'User Name',
				dateOfBirth: '2018-04',
			};
			request.postOrPut('PUT', url, formData, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.message).to.be.equal('Bad Request!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);
	});

	describe('saveNotifications()', () => {
		it('should update user notification', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/user/notifications`;
			const formData = {
				reminderTime: '10:00:00',
			};
			request.postOrPut('PUT', url, formData, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject.message).to.be.equal('Your notification setting has been updated!');
				expect(jsonObject.status).to.be.equal('Success');
				done();
			});
		}).timeout(30000);

		it('should return error when form field is empty', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/user/notifications`;
			const formData = {
				reminderTime: ' ',
			};
			request.postOrPut('PUT', url, formData, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject.message).to.be.equal('Please pick a date for your notification!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should return error when wrong form data is sent', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/user/notifications`;
			const formData = {
				reminderDay: '10:00',
			};
			request.postOrPut('PUT', url, formData, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.message).to.be.equal('Bad Request!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);
	});

	describe('forgotPassword()', () => {
		it('should send existing user the password if forgotten', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/auth/forgot_password`;
			const formData = {
				email: 'mynewemail@gmail.com',
			};
			request.postOrPut('POST', url, formData, [], (error, res, body) => {
				console.log(error);
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject.message).to.be.equal('Your password has been reset and email sent to your email address');
				expect(jsonObject.status).to.be.equal('Success');
				done();
			});
		}).timeout(30000);

		it('should show bad request if email is not sent', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/auth/forgot_password`;
			const formData = {
				fullName: 'kamp',
			};
			request.postOrPut('POST', url, formData, [], (error, res, body) => {
				console.log(error);
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.message).to.be.equal('Bad Request!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should not send if email is empty', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/auth/forgot_password`;
			const formData = {
				email: ' ',
			};
			request.postOrPut('POST', url, formData, [], (error, res, body) => {
				console.log(error);
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject.message).to.be.equal('Please enter email!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should show 404 if email does not exist in database', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/auth/forgot_password`;
			const formData = {
				email: 'kamp@gmail.com',
			};
			request.postOrPut('POST', url, formData, [], (error, res, body) => {
				console.log(error);
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(404);
				expect(jsonObject.message).to.be.equal('This email does not exist on our database!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);
	});

	describe('runCronJob()', () => {
		it('should send daily reminder email to users', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/user/cron`;
			request.getOrDelete('GET', url, [], (error, res, body) => {
				console.log(error);
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject.message).to.be.equal('Cron job ran successfully!');
				expect(jsonObject.status).to.be.equal('Success');
				done();
			});
		}).timeout(30000);
	});
});
