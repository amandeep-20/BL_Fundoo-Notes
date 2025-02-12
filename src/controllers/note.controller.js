import HttpStatus from 'http-status-codes';
import *as NoteService from '../services/note.service';

import Note from '../models/note.model';

export const createNote = async (req, res, next) => {
  try {
    // Validate if the request body contains title and description
    if (!req.body.title || !req.body.description) {
      return res.status(400).json({
        code: 400,
        message: 'Title and description are required',
      });
    }

    const { title, description } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: No user ID found' });
    }

    const newNote = await Note.create({
      title,
      description,
      userId: req.user.id, // Ensure user ID is attached
    });

    res.status(201).json({ message: 'Note created', data: newNote });
  } catch (error) {
    next(error);
  }
};


export const getNotes = async(req, res, next)=>{
    try{
        const data = await NoteService.getNotes(req.user.id);
        res.status(HttpStatus.OK).json({
            code: HttpStatus.OK,
            data: data,
            message: 'Note Is Fetched' 
        });
    }
    catch(error){
        next(error);
    }
}

export const getNoteById = async (req, res, next) => {
    try {
      const data = await NoteService.getNoteById(req.params.id, req.user.id);
      console.log(req.params);
      console.log(req.user);
      if (!data) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Note not found' });
      }
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: data,
        message: 'Note Is Fetched' 
    });
    } catch (error) {
      next(error);
    }
};
  
  // Update a note by ID
export const updateNoteById = async (req, res, next) => {
    try {
      const data = await NoteService.updateNoteById(req.params.id, req.user.id, req.body);
      if (!data) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Note not found or unauthorized' });
      }
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: data,
        message: 'Note updated !!!' 
    });
    } catch (error) {
      next(error);
    }
};


export const deleteNote = async (req, res, next) => {
  try {
      const data = await NoteService.deleteNote(req.params.id);

      if (!data) {
          return res.status(HttpStatus.NOT_FOUND).json({
              code: HttpStatus.NOT_FOUND,
              message: 'Note not found'
          });
      }

      res.status(HttpStatus.OK).json({
          code: HttpStatus.OK,
          data: data,
          message: data.trash ? 'Note moved to trash' : 'Note restored'
      });
  } catch (error) {
      next(error);
  }
};


