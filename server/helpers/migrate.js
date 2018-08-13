import pg from 'pg';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';

dotenv.config();
const saltRounds = 10;
const salt = bcryptjs.genSaltSync(saltRounds);
const hash = bcryptjs.hashSync('password', salt);
class Migrate {
	constructor() {
		if (process.env.NODE_ENV === 'test') {
			this.connectionString = process.env.test_DATABASE_URL;
		}
		this.pool = new pg.Pool({
			connectionString: this.connectionString,
		});
	}

	runMigration() {
		if (process.env.NODE_ENV === 'test') {
			console.log('running test migration');
			this.pool.query('DROP TABLE entries', () => {
				this.pool.query('DROP TABLE users', () => {
					this.pool.query('CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, fullName VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, dateOfBirth DATE NULL, reminderTime TIME DEFAULT NULL, createdAt TIMESTAMP DEFAULT CURRENT_DATE, updatedAt TIMESTAMP DEFAULT CURRENT_DATE)', () => {
						this.pool.query('CREATE TABLE IF NOT EXISTS entries(id SERIAL PRIMARY KEY, title VARCHAR(255) NOT NULL, description TEXT NOT NULL, user_id INTEGER NOT NULL REFERENCES users, createdAt TIMESTAMP DEFAULT CURRENT_DATE, updatedAt TIMESTAMP DEFAULT CURRENT_DATE)', () => {
							const sql = 'INSERT INTO users(fullName, email, password, dateOfBirth) VALUES($1, $2, $3, $4)';
							const values = ['Cool Entry', 'coolentry@gmail.com', hash, '1999-03-04'];
							this.pool.query(sql, values, () => {
								console.log('done');
								this.pool.end();
							});
						});
					});
				});
			});
		}
	}
}

const migration = new Migrate();
migration.runMigration();
