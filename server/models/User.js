import pg from 'pg';
import Joi from 'joi';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();
class User {
	constructor() {
		this.pool = new pg.Pool({
			user: process.env.username,
			host: process.env.host,
			database: process.env.database,
			password: process.env.password,
			port: 5432,
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

	create(req, callback) {
		const {
			email, fullName, password, dateOfBirth,
		} = req.body;
		Joi.validate({
			email, password, fullName, dateOfBirth,
		}, this.schema, (err) => {
			if (err) {
				callback(err.details[0].message);
			} else {
				const saltRounds = 10;
				const salt = bcryptjs.genSaltSync(saltRounds);
				const hash = bcryptjs.hashSync(password, salt);
				const sql = 'INSERT INTO users(fullName, email, password, dateOfBirth) VALUES($1, $2, $3, $4)';
				const values = [fullName, email, hash, dateOfBirth];
				this.pool.query(sql, values, (error) => {
					if (error) {
						callback(error.detail);
					} else {
						callback(error);
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

	showUser(req, callback) {
		const userId = req.userData.id;
		const sql = 'SELECT * FROM users WHERE id=$1 LIMIT 1';
		const values = [userId];
		this.pool.query(sql, values, (err, res) => {
			callback(err, res);
		});
	}
}

module.exports = User;
