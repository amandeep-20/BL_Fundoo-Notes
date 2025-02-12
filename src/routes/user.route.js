import express from 'express';
import * as userController from '../controllers/user.controller';
import { newUserValidator } from '../validators/user.validator';
import { userAuth } from '../middlewares/auth.middleware';

const router = express.Router();


router.post('/register', newUserValidator, userController.newUser);

router.post('/login', userController.loginUser);

router.get('/getUsers', userAuth, userController.getUsers);

router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);

export default router;