import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import moment from 'moment';
import User from '../models/User';


dotenv.config();
class UserController extends User {
	constructor() {
		super();
		this.user = '';
		this.transporter = nodemailer.createTransport({
			service: process.env.emailHost,
			auth: {
				user: process.env.emailUsername,
				pass: process.env.emailPassword,
			},
		});
	}

	signUp(req, res) {
		const {
			email, password, confirmPassword, fullName, dateOfBirth,
		} = req.body;
		const regEx = /^\d{4}-\d{2}-\d{2}$/;
		if (email === ' ' || fullName === ' ' || password === ' ') {
			this.responseFormat(res, 422, 'Please fill all the input fields!', 'Failed', 'user', []);
		} else if (password.length < 6) {
			this.responseFormat(res, 422, 'Password length must be at least 6 characters!', 'Failed', 'user', []);
		} else if (password !== confirmPassword) {
			this.responseFormat(res, 401, 'Passwords do not match!', 'Failed', 'user', []);
		} else if (!email || !fullName || !password) {
			this.responseFormat(res, 400, 'Bad Request!', 'Failed', 'user', []);
		} else if (dateOfBirth && dateOfBirth.match(regEx) === null) {
			this.responseFormat(res, 422, 'Date of birth is not in the right format (yyyy-mm-dd)!', 'Failed', 'user', []);
		} else {
			req.body.email = req.body.email.toLowerCase().replace(/\s+/g, '');
			req.body.password = req.body.password.toLowerCase();
			this.create(req, (error, response) => {
				if (error) {
					this.responseFormat(res, 409, error, 'Failed', 'user', []);
				} else {
					const payload = {
						email: req.body.email,
						id: response.rows[0].id,
					};
					let user = response.rows[0];
					user = Object.assign({}, user);
					delete user.password;
					const token = jwt.sign(payload, process.env.secret_token, { expiresIn: 60000 });
					this.processMail('support@mydiary.com', email, 'Welcome To MyDiary', `Hi ${fullName}, welcome to MyDiary. These are your signin details - email: "${email}", password: "${password}". Please keep them safe. Thank you!`);
					res.status(201).json({
						user,
						token,
						message: 'You have successfully signed up and signed in!',
						status: 'Success',
					});
				}
			});
		}
	}

	signIn(req, res) {
		const { email, password } = req.body;
		if (email === ' ' || password === ' ') {
			this.responseFormat(res, 422, 'Please fill all the input fields!', 'Failed', 'user', []);
		} else if (!email || !password) {
			this.responseFormat(res, 400, 'Bad Request!', 'Failed', 'user', []);
		} else if (password.length < 6) {
			this.responseFormat(res, 422, 'Password length must be at least 6 characters!', 'Failed', 'user', []);
		} else {
			this.loginUser(req, (err, response) => {
				if (err) {
					this.responseFormat(res, 500, err, 'Failed', 'user', []);
				} else if (!response.rows || response.rows[0] === undefined) {
					this.responseFormat(res, 401, 'Unauthorized! You are not allowed to log in!', 'Failed', 'user', []);
				} else {
					let user = response.rows[0];
					const payload = {
						email: response.rows[0].email,
						id: response.rows[0].id,
					};
					user = Object.assign({}, user);
					delete user.password;
					const token = jwt.sign(payload, process.env.secret_token, { expiresIn: 60000 });
					res.status(200).json({
						user,
						token,
						message: 'You have signed in successfully!',
						status: 'Success',
					});
				}
			});
		}
	}

	show(req, res) {
		this.showUser(req, (err, response) => {
			if (err) {
				this.responseFormat(res, 400, err, 'Failed', 'user', []);
			} else {
				let user = response.rows[0];
				user = Object.assign({}, user);
				delete user.password;
				this.responseFormat(res, 200, 'Retrieved!', 'Success', 'user', user);
			}
		});
	}

	update(req, res) {
		if (!req.body.email || !req.body.fullName) {
			this.responseFormat(res, 400, 'Bad Request!', 'Failed', 'user', []);
		} else if (req.body.email === ' ' || req.body.fullName === ' ') {
			this.responseFormat(res, 422, 'Please fill all the input fields!', 'Failed', 'user', []);
		} else {
			this.updateUser(req, (err, response) => {
				if (err) {
					this.responseFormat(res, 400, err, 'Failed', 'user', []);
				} else {
					let user = response.rows[0];
					user = Object.assign({}, user);
					delete user.password;
					this.responseFormat(res, 200, 'Your Profile has been updated!', 'Success', 'user', user);
				}
			});
		}
	}

	saveNotification(req, res) {
		if (!req.body.reminderTime) {
			this.responseFormat(res, 400, 'Bad Request!', 'Failed', 'user', []);
		} else if (req.body.reminderTime === ' ') {
			this.responseFormat(res, 422, 'Please pick a date for your notification!', 'Failed', 'user', []);
		} else {
			this.setReminder(req, (err, response) => {
				if (err) {
					this.responseFormat(res, 400, err, 'Failed', 'user', []);
				} else {
					let user = response.rows[0];
					user = Object.assign({}, user);
					delete user.password;
					this.responseFormat(res, 200, 'Your notification setting has been updated!', 'Success', 'user', user);
				}
			});
		}
	}

	forgotPassword(req, res) {
		if (!req.body.email) {
			this.responseFormat(res, 400, 'Bad Request!', 'Failed', 'user', []);
		} else if (req.body.email === ' ') {
			this.responseFormat(res, 422, 'Please enter email!', 'Failed', 'user', []);
		} else {
			this.sendNewPassword(req, (err, response, password) => {
				if (err) {
					this.responseFormat(res, 404, err, 'Failed', 'user', []);
				} else {
					this.processMail('support@mydiary.com', response.rows[0].email, 'Password Reset For MyDiary', `Hi ${response.rows[0].fullname}, you requested to reset your password. This is your new password: "${password}", you will need this to login as from now on. Please keep it safe. If this was not done by you. Please contact us. Thank you!`);
					this.responseFormat(res, 200, 'Your password has been reset and email sent to your email address', 'Success', 'email', response.rows[0].email);
				}
			});
		}
	}

	processMail(from, to, subject, text) {
		const mailOptions = {
			from, to, subject, text,
		};
		this.transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.log(error);
			} else {
				console.log(`Email sent: ${info.response}`);
			}
		});
	}

	cronEmail(req, res) {
		this.getAllUsers(req, (error, response) => {
			if (error) {
				this.responseFormat(res, 409, error, 'Failed', 'data', []);
			} else {
				let user = '';
				for (let i = 0; i < response.rows.length; i += 1) {
					user = response.rows[i];
					if (user.remindertime !== null && user.remindertime !== ' ') {
						const currentHour = moment().get('hour');
						const reminderHour = user.remindertime.split(':')[0];
						if ((currentHour - reminderHour) === 0) {
							this.processMail('support@mydiary.com', user.email, 'Notification For MyDiary', `Hi ${user.fullname}, you are receiving this email because you have chosen to be reminded daily to add a new entry to your MyDiary application. Thank you!`);
						}
					}
				}
				this.responseFormat(res, 200, 'Cron job ran successfully!', 'Success', 'data', []);
			}
		});
	}
	// eslint-disable-next-line
	responseFormat(res, code, message, status, data, value) {
		res.status(code).json({
			message,
			status,
			[data]: value,
		});
	}
}

export default UserController;
