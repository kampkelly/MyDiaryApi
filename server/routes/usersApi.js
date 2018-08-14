import express from 'express';
import UserController from '../controllers/UserController';
import checkAuth from '../helpers/checkAuth';

const usersRouter = express.Router();
const User = new UserController();

usersRouter.post('/auth/signup', (req, res) => {
	User.signUp(req, res);
});

usersRouter.post('/auth/login', (req, res) => {
	User.signIn(req, res);
});

usersRouter.get('/user/profile', checkAuth, (req, res) => {
	User.show(req, res);
});

usersRouter.put('/user/profile', checkAuth, (req, res) => {
	User.update(req, res);
});

usersRouter.put('/user/notifications', checkAuth, (req, res) => {
	User.saveNotification(req, res);
});

usersRouter.get('/user/cron', (req, res) => {
	User.cronEmail(req, res);
});

export default usersRouter;
