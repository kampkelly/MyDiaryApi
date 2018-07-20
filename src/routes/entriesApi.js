import express from 'express';
import EntryController from '../controllers/EntryController';

const entriesRouter = express.Router();
const Entry = new EntryController();

entriesRouter.get('/entries', (req, res) => {
	Entry.index(req, res);
});

entriesRouter.get('/entries/:id', (req, res) => {
	Entry.show(req, res);
});

entriesRouter.post('/entries', (req, res) => {
	Entry.create(req, res);
});


entriesRouter.put('/entries/:id', (req, res) => {
	const datastructure = req.app.get('appData');
	if (req.body.title === ' ' || req.body.description === ' ') {
		res.status(422).json({ error: 'Please fill in all the fields properly!' });
	} else if (!datastructure.entries) {
		res.status(500).json({ error: 'Internal Server Error!' });
	} else if
	(datastructure.entries === undefined || datastructure.entries[req.params.id] === undefined) {
		res.status(404).json({ error: 'This entry does not exist!' });
	} else if (req.body.title && req.body.description) {
		datastructure.entries[req.params.id].title = req.body.title;
		datastructure.entries[req.params.id].description = req.body.description;
		res.status(200).json({ message: 'This entry has been updated!' });
	} else {
		res.status(400).json({ error: 'Invalid request!' });
	}
});

entriesRouter.delete('/entries/:id', (req, res) => {
	const datastructure = req.app.get('appData');
	if (!datastructure.entries) {
		res.status(500).json({ error: 'Internal Server Error!' });
	} else if
	(datastructure.entries === undefined || datastructure.entries[req.params.id] === undefined) {
		res.status(404).json({ error: 'This entry does not exist!' });
	} else {
		datastructure.entries.splice(req.params.id, 1);
		res.status(204).json();
	}
});


export default entriesRouter;
