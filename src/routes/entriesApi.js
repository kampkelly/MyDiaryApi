import express from 'express';

const entriesRouter = express.Router();

entriesRouter.get('/entries', (req, res) => {
	const datastructure = req.app.get('appData');
	if (!datastructure.entries) {
		res.status(500).json({ error: 'Internal Server Error' });
	} else {
		res.status(200).json(datastructure.entries);
	}
});

entriesRouter.get('/entries/:id', (req, res) => {
	const datastructure = req.app.get('appData');
	if (!datastructure.entries) {
		res.status(500).json({ error: 'Internal Server Error' });
	} else if (!Number.isInteger(Number(req.params.id))) {
		res.status(400).json({ error: 'Bad Request!' });
	} else if
	(datastructure.entries === undefined || datastructure.entries[req.params.id] === undefined) {
		res.status(404).json({ error: 'This entry cannot be found!' });
	} else {
		const entry = datastructure.entries[req.params.id];
		res.status(200).json(entry);
	}
});


export default entriesRouter;
