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
				res.status(409).json({
					message: error,
					status: 'Failed',
					entries: [],
				});
			} else {
				res.status(200).json({
					message: 'Retrieved',
					status: 'Success',
					entries: response.rows,
				});
			}
		});
	}

	show(req, res) {
		this.showEntry(req, (error, code, response) => {
			if (error) {
				res.status(code).json({
					message: error,
					status: 'Failed',
					entry: [],
				});
			} else {
				res.status(200).json({
					message: 'Retrieved',
					status: 'Success',
					entry: response.rows[0],
				});
			}
		});
	}

	create(req, res) {
		if (req.body.title === ' ' || req.body.description === ' ') {
			res.status(422).json({
				message: 'Please fill all the input fields!',
				status: 'Failed',
				entry: [],
			});
		} else if (req.body.title && req.body.description) {
			if (req.body.title.length < 10) {
				res.status(409).json({
					message: 'Your title is too short, minimum 10 letters!',
					status: 'Failed',
					entry: [],
				});
			} else if (req.body.description.length < 20) {
				res.status(409).json({
					message: 'Your description is too short, minimum 20 letters!',
					status: 'Failed',
					entry: [],
				});
			} else {
				this.createEntry(req, (error) => {
					if (error) {
						res.status(409).json({
							message: error,
							status: 'Failed',
							entry: { error },
						});
					} else {
						res.status(201).json({
							message: 'Entry has been created!',
							status: 'Success',
							entry: [],
						});
					}
				});
			}
		} else {
			res.status(400).json({
				message: 'Bad request!',
				status: 'Failed',
				entry: [],
			});
		}
	}

	update(req, res) {
		if (req.body.title === ' ' || req.body.description === ' ') {
			res.status(422).json({
				message: 'Please fill all the input fields!',
				status: 'Failed',
				entry: [],
			});
		} else if (req.body.title && req.body.description) {
			if (req.body.title.length < 10) {
				res.status(409).json({
					message: 'Your title is too short, minimum 10 letters!',
					status: 'Failed',
					entry: [],
				});
			} else if (req.body.description.length < 20) {
				res.status(409).json({
					message: 'Your description is too short, minimum 20 letters!',
					status: 'Failed',
					entry: [],
				});
			} else {
				this.updateEntry(req, (error, code) => {
					if (error) {
						res.status(code).json({
							message: error,
							status: 'Failed',
							entry: [],
						});
					} else {
						res.status(200).json({
							message: 'This entry has been updated!',
							status: 'Success',
							entry: [],
						});
					}
				});
			}
		} else {
			res.status(400).json({
				message: 'Bad request!',
				status: 'Failed',
				entry: [],
			});
		}
	}

	delete(req, res) {
		this.deleteEntry(req, (error) => {
			if (error) {
				res.status(400).json({
					message: error,
					status: 'Failed',
					entry: [],
				});
			} else {
				res.status(204).json({
					message: 'Entry Deleted!',
					status: 'Success',
					entry: [],
				});
			}
		});
	}
}

export default EntryController;
