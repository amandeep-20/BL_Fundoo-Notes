import express from 'express';
import * as NoteController from '../controllers/note.controller';
import { userAuth } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/', userAuth, NoteController.createNote);
router.get('/', userAuth, NoteController.getNotes);
router.get('/:id', userAuth, NoteController.getNoteById); // Get by ID
router.put('/:id', userAuth, NoteController.updateNoteById);
router.delete('/:id', userAuth, NoteController.deleteNote);

export default router;