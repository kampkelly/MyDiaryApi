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
			res.status(422).json({
				message: 'Please fill all the input fields!',
				status: 'Failed',
				user: [],
			});
		} else if (password.length < 6) {
			res.status(422).json({
				message: 'Password length must be at least 6 characters!',
				status: 'Failed',
				user: [],
			});
		} else if (password !== confirmPassword) {
			res.status(401).json({
				message: 'Passwords do not match!',
				status: 'Failed',
				user: [],
			});
		} else if (!email || !fullName || !password) {
			res.status(400).json({
				message: 'Bad Request!',
				status: 'Failed',
				user: [],
			});
		} else if (dateOfBirth && dateOfBirth.match(regEx) === null) {
			res.status(422).json({
				message: 'Date of birth is not in the right format (yyyy-mm-dd)!',
				status: 'Failed',
				user: [],
			});
		} else {
			req.body.email = req.body.email.toLowerCase().replace(/\s+/g, '');
			req.body.password = req.body.password.toLowerCase();
			this.create(req, (error, response) => {
				if (error) {
					res.status(409).json({
						message: error,
						status: 'Failed',
						user: [],
					});
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
			res.status(422).json({
				message: 'Please fill all the input fields!',
				status: 'Failed',
				user: [],
			});
		} else if (!email || !password) {
			res.status(400).json({
				message: 'Bad Request!',
				status: 'Failed',
				user: [],
			});
		} else if (password.length < 6) {
			res.status(422).json({
				message: 'Password length must be at least 6 characters!',
				status: 'Failed',
				user: [],
			});
		} else {
			this.loginUser(req, (err, response) => {
				if (err) {
					res.status(500).json({
						message: err,
						status: 'Failed',
						user: [],
					});
				} else if (!response.rows || response.rows[0] === undefined) {
					res.status(401).json({
						message: 'Unauthorized! You are not allowed to log in!',
						status: 'Failed',
						user: [],
					});
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
				res.status(400).json({
					message: err,
					status: 'Failed',
					user: [],
				});
			} else {
				let user = response.rows[0];
				user = Object.assign({}, user);
				delete user.password;
				res.status(200).json({
					message: 'Retrieved!',
					status: 'Success',
					user: { user },
				});
			}
		});
	}

	update(req, res) {
		if (!req.body.email || !req.body.fullName) {
			res.status(400).json({
				message: 'Bad Request!',
				status: 'Failed',
				user: [],
			});
		} else if (req.body.email === ' ' || req.body.fullName === ' ') {
			res.status(422).json({
				message: 'Please fill all the input fields!',
				status: 'Failed',
				user: [],
			});
		} else {
			this.updateUser(req, (err, response) => {
				if (err) {
					res.status(400).json({
						message: err,
						status: 'Failed',
						user: [],
					});
				} else {
					let user = response.rows[0];
					user = Object.assign({}, user);
					delete user.password;
					res.status(200).json({
						user,
						message: 'Your Profile has been updated!',
						status: 'Success',
					});
				}
			});
		}
	}

	saveNotification(req, res) {
		if (!req.body.reminderTime) {
			res.status(400).json({
				message: 'Bad Request!',
				status: 'Failed',
				user: [],
			});
		} else if (req.body.reminderTime === ' ') {
			res.status(422).json({
				message: 'Please pick a date for your notification!',
				status: 'Failed',
				user: [],
			});
		} else {
			this.setReminder(req, (err, response) => {
				if (err) {
					res.status(400).json({
						message: err,
						status: 'Failed',
						user: [],
					});
				} else {
					let user = response.rows[0];
					user = Object.assign({}, user);
					delete user.password;
					res.status(200).json({
						user,
						message: 'Your notification setting has been updated!',
						status: 'Success',
					});
				}
			});
		}
	}

	forgotPassword(req, res) {
		if (!req.body.email) {
			res.status(400).json({
				message: 'Bad Request!',
				status: 'Failed',
				user: [],
			});
		} else if (req.body.email === ' ') {
			res.status(422).json({
				message: 'Please pick a date for your notification!',
				status: 'Failed',
				user: [],
			});
		} else {
			this.sendNewPassword(req, (err, response, password) => {
				if (err) {
					res.status(404).json({
						message: err,
						status: 'Failed',
						user: [],
					});
				} else {
					this.processMail('support@mydiary.com', response.rows[0].email, 'Password Reset For MyDiary', `Hi ${response.rows[0].fullname}, you requested to reset your password. This is your new password: "${password}", you will need this to login as from now on. Please keep it safe. If this was not done by you. Please contact us. Thank you!`);
					res.status(200).json({
						message: 'Your password has been reset and email sent to your email address',
						status: 'Success',
						email: response.rows[0].email,
					});
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
				res.status(409).json({
					message: error,
					status: 'Failed',
					data: [],
				});
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
				res.status(200).json({
					message: 'Retrieved',
					status: 'Success',
					data: 'Cron job ran successfully!',
				});
			}
		});
	}
}

export default UserController;
