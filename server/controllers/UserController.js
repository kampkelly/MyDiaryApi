import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User';


dotenv.config();
class UserController extends User {
	constructor() {
		super();
		this.user = '';
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
}

export default UserController;
