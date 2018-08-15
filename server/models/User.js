import pg from 'pg';
import Joi from 'joi';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();
class User {
	constructor() {
		if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
			this.connectionString = process.env.DATABASE_URL;
		} else if (process.env.NODE_ENV === 'test') {
			this.connectionString = process.env.test_DATABASE_URL;
		}
		this.pool = new pg.Pool({
			connectionString: this.connectionString,
		});
		this.schema = {
			email: Joi.string().email().uppercase().trim(),
			password: Joi.string().trim()
				.min(6),
			confirmPassword: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).uppercase().trim()
				.min(6),
			fullName: Joi.string(),
			dateOfBirth: Joi.string(),
		};
	}

	getAllUsers(req, callback) {
		const sql = 'SELECT * FROM users';
		this.pool.query(sql, (error, res) => {
			if (error) {
				callback(error.detail, res);
			} else {
				callback(error, res);
			}
		});
	}

	create(req, callback) {
		const {
			email, fullName, password, dateOfBirth,
		} = req.body;
		Joi.validate({
			email, password, fullName,
		}, this.schema, (err) => {
			if (err) {
				callback('The email must be a valid email!');
			} else {
				const saltRounds = 10;
				const salt = bcryptjs.genSaltSync(saltRounds);
				const hash = bcryptjs.hashSync(password, salt);
				let sql = '';
				let values = '';
				if (dateOfBirth === '') {
					sql = 'INSERT INTO users(fullName, email, password) VALUES($1, $2, $3) RETURNING *';
					values = [fullName, email, hash];
				} else if (dateOfBirth !== '') {
					sql = 'INSERT INTO users(fullName, email, password, dateOfBirth) VALUES($1, $2, $3, $4) RETURNING *';
					values = [fullName, email, hash, dateOfBirth];
				}
				this.pool.query(sql, values, (error, res) => {
					if (error) {
						callback('A user with this email already exists!', res);
					} else {
						callback(error, res);
					}
				});
			}
		});
	}

	loginUser(req, callback) {
		let {
			email, password,
		} = req.body;
		password = password.toLowerCase();
		email = email.toLowerCase().replace(/\s+/g, '');
		Joi.validate({
			email, password,
		}, this.schema, (error) => {
			if (error) {
				callback('The email must be a valid email!');
			} else {
				const sql = 'SELECT * FROM users WHERE email=$1 LIMIT 1';
				const values = [email];
				this.pool.query(sql, values, (err, res) => {
					if (err !== undefined) {
						callback(err, res);
					} else if (err === undefined) {
						if (!res.rows[0]) {
							callback(err, false);
						} else {
							const hash = res.rows[0].password;
							bcryptjs.compare(password, hash, (errOnHash, resOnHash) => {
								if (resOnHash === true) {
									callback(err, res);
								} else {
									callback(err, resOnHash);
								}
							});
						}
					}
				});
			}
		});
	}

	showUser(req, callback) {
		const userId = req.userData.id;
		const sql = 'SELECT * FROM users WHERE id=$1 LIMIT 1';
		const values = [userId];
		this.pool.query(sql, values, (err, res) => {
			callback(err, res);
		});
	}

	updateUser(req, callback) {
		const userId = req.userData.id;
		const {
			email, fullName, dateOfBirth,
		} = req.body;
		Joi.validate({
			email,
		}, this.schema, (error) => {
			if (error) {
				callback('The email must be a valid email!');
			} else {
				let sql = '';
				let values = '';
				if (dateOfBirth === '') {
					sql = 'UPDATE users SET email=$1, fullName=$2 WHERE id=$4 RETURNING *';
					values = [email, fullName, userId];
				} else if (dateOfBirth !== '') {
					sql = 'UPDATE users SET email=$1, fullName=$2, dateOfBirth=$3 WHERE id=$4 RETURNING *';
					values = [email, fullName, dateOfBirth, userId];
				}
				this.pool.query(sql, values, (err, res) => {
					callback(err, res);
				});
			}
		});
	}

	setReminder(req, callback) {
		const userId = req.userData.id;
		const sql = 'UPDATE users SET reminderTime=$1 WHERE id=$2 RETURNING *';
		const values = [req.body.reminderTime, userId];
		this.pool.query(sql, values, (err, res) => {
			callback(err, res);
		});
	}

	sendNewPassword(req, callback) {
		const saltRounds = 10;
		const salt = bcryptjs.genSaltSync(saltRounds);
		const password = 'passworddkj';
		const hash = bcryptjs.hashSync(password, salt);
		const sql = 'UPDATE users SET password=$1 WHERE email=$2 RETURNING email, fullname';
		const values = [hash, req.body.email];
		this.pool.query(sql, values, (err, res) => {
			if (res.rows.length < 1) {
				callback('This email does not exist on our database!', null, null);
			} else {
				callback(null, res, password);
			}
		});
	}
}

export default User;
