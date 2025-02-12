import express from 'express';
import * as NoteController from '../controllers/note.controller';
import { userAuth } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/create', userAuth, NoteController.createNote);
router.get('/getNotes', userAuth, NoteController.getNotes);
router.get('/:id', userAuth, NoteController.getNoteById); // Get by ID
router.put('/:id', userAuth, NoteController.updateNoteById);
router.delete('/delete/:id', userAuth, NoteController.deleteNote);
router.post('/forgot-password', NoteController.forgotPassword);
router.post('/reset-password', NoteController.resetPassword);
export default router;