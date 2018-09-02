import dotenv from 'dotenv';
import Entry from '../models/Entry';

dotenv.config();
class EntryController extends Entry {
	constructor() {
		super();
		this.entry = '';
	}

	index(req, res) {
		this.allEntries(req, (error, response) => {
			if (error) {
				this.responseFormat(res, 409, error, 'Failed', 'entries', []);
			} else {
				this.responseFormat(res, 200, 'Retrieved', 'Success', 'entries', response);
			}
		});
	}

	show(req, res) {
		this.showEntry(req, (error, code, response) => {
			if (error) {
				this.responseFormat(res, code, error, 'Failed', 'entry', []);
			} else {
				this.responseFormat(res, 200, 'Retrieved', 'Success', 'entry', response.rows[0]);
			}
		});
	}

	create(req, res) {
		if (req.body.title === ' ' || req.body.description === ' ') {
			this.responseFormat(res, 422, 'Please fill all the input fields!', 'Failed', 'entry', []);
		} else if (req.body.title && req.body.description) {
			if (req.body.title.length < 10) {
				this.responseFormat(res, 409, 'Your title is too short, minimum 10 letters!', 'Failed', 'entry', []);
			} else if (req.body.description.length < 20) {
				this.responseFormat(res, 409, 'Your description is too short, minimum 20 letters!', 'Failed', 'entry', []);
			} else {
				this.createEntry(req, (error, response) => {
					if (error) {
						this.responseFormat(res, 409, error, 'Failed', 'entry', error);
					} else {
						this.responseFormat(res, 201, 'Entry has been created!', 'Success', 'entry', response.rows[0]);
					}
				});
			}
		} else {
			this.responseFormat(res, 400, 'Bad request!', 'Failed', 'entry', []);
		}
	}

	update(req, res) {
		if (req.body.title === ' ' || req.body.description === ' ') {
			this.responseFormat(res, 422, 'Please fill all the input fields!', 'Failed', 'entry', []);
		} else if (req.body.title && req.body.description) {
			if (req.body.title.length < 10) {
				this.responseFormat(res, 409, 'Your title is too short, minimum 10 letters!', 'Failed', 'entry', []);
			} else if (req.body.description.length < 20) {
				this.responseFormat(res, 409, 'Your description is too short, minimum 20 letters!', 'Failed', 'entry', []);
			} else {
				this.updateEntry(req, (error, code, response) => {
					if (error) {
						this.responseFormat(res, code, error, 'Failed', 'entry', []);
					} else {
						this.responseFormat(res, 200, 'This entry has been updated!', 'Success', 'entry', response.rows[0]);
					}
				});
			}
		} else {
			this.responseFormat(res, 400, 'Bad request!', 'Failed', 'entry', []);
		}
	}

	delete(req, res) {
		this.deleteEntry(req, (error) => {
			if (error) {
				this.responseFormat(res, 400, error, 'Failed', 'entry', []);
			} else {
				this.responseFormat(res, 204, 'Entry Deleted!', 'Success', 'entry', []);
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

export default EntryController;
