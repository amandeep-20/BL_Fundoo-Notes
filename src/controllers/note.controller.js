import HttpStatus from 'http-status-codes';
import *as NoteService from '../services/note.service';

import Note from '../models/note.model';

export const createNote = async (req, res, next) => {
  try {
    const newNote = await NoteService.createNote(req.user?.id, req.body);
    res.status(201).json({ 
      message: 'Note created', 
      data: newNote 
    });
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
    const data = await NoteService.getNoteById(req.params.id, req.user?.id);
    res.status(200).json({ 
      code: 200, 
      data, 
      message: 'Note Is Fetched' });
  } catch (error) {
    res.status(error.code || 400).json({ message: error.message});
  }
};
  
  // Update a note by ID
  export const updateNoteById = async (req, res, next) => {
    try {
      const updatedNote = await NoteService.updateNoteById(req.params.id, req.user?.id, req.body);
      res.status(200).json({ code: 200, data: updatedNote, message: 'Note updated successfully!' });
    } catch (error) {
      res.status(error.code || 400).json({ message: error.message});
    }
  };


  export const deleteNote= async (req, res, next) => {
    try {
      const updatedNote = await NoteService.deleteNote(req.params.id);
      res.status(200).json({
        code: 200,
        data: updatedNote,
        message: updatedNote.trash ? 'Note moved to trash' : 'Note restored',
      });
    } catch (error) {
      next(error)
    }
  };


