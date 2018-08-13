import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
class CreateSchema {
	constructor() {
		if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
			this.connectionString = process.env.DATABASE_URL;
			this.pool = new pg.Pool({
				connectionString: this.connectionString,
			});
		}
	}

	createDb() {
		if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
			this.pool.query('CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, fullName VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, dateOfBirth DATE NULL, reminderTime TIME DEFAULT NULL, createdAt TIMESTAMP DEFAULT CURRENT_DATE, updatedAt TIMESTAMP DEFAULT CURRENT_DATE)', () => {
				this.pool.query('CREATE TABLE IF NOT EXISTS entries(id SERIAL PRIMARY KEY, title VARCHAR(255) NOT NULL, description TEXT NOT NULL, user_id INTEGER NOT NULL REFERENCES users, createdAt TIMESTAMP DEFAULT CURRENT_DATE, updatedAt TIMESTAMP DEFAULT CURRENT_DATE)', () => {
					console.log('Tables Created!');
					this.pool.end();
				});
			});
		}
	}
}

export default CreateSchema;
