import express from 'express';
import EntryController from '../controllers/EntryController';
import checkAuth from '../helpers/checkAuth';

const entriesRouter = express.Router();
const Entry = new EntryController();

entriesRouter.get('/entries', checkAuth, (req, res) => {
	Entry.index(req, res);
});

entriesRouter.get('/entries/:id', checkAuth, (req, res) => {
	Entry.show(req, res);
});

entriesRouter.post('/entries', checkAuth, (req, res) => {
	Entry.create(req, res);
});

entriesRouter.put('/entries/:id', checkAuth, (req, res) => {
	Entry.update(req, res);
});

entriesRouter.delete('/entries/:id', checkAuth, (req, res) => {
	Entry.delete(req, res);
});


export default entriesRouter;
