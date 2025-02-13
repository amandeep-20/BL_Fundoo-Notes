import Note from '../models/note.model';
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';

 

// create note
export const createNote = async (userId, body) => {
    if (!body.title || !body.description) {
      throw { code: 400, message: 'Title and description are required' };
    }
  
    if (!userId) {
      throw { code: 401, message: 'Unauthorized: No user ID found' };
    }
  
    const note = await Note.create({
      title: body.title,
      description: body.description,
      userId: userId, 
    });
  
    return note;
  };
  

// get all notes
export const getNotes = async (userId)=>{
    const note = await Note.find({userId,trash: false});
    return note;
};

export const getNoteById = async (noteId, userId) => {
    if (!noteId) {
      throw { code: 400, message: 'Note ID is required' };
    }
    if (!userId) {
      throw { code: 401, message: 'Unauthorized: No user ID found' };
    }
  
    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) {
      throw { code: 404, message: 'Note not found' };
    }
  
    return note;
  };
  
  
// Update note by ID
export const updateNoteById = async (noteId, userId, updateData) => {
  if (!noteId) {
    throw { code: 400, message: 'Note ID is required' };
  }
  if (!userId) {
    throw { code: 401, message: 'Unauthorized: No user ID found' };
  }
  if (!updateData || Object.keys(updateData).length === 0) {
    throw { code: 400, message: 'Update data is required' };
  }

  const updatedNote = await Note.findOneAndUpdate(
    { _id: noteId, userId }, // Ensure user can only update their own notes
    updateData,
    { new: true } // Return updated note
  );

  if (!updatedNote) {
    throw { code: 404, message: 'Note not found or unauthorized' };
  }

  return updatedNote;
};



// delete
export const deleteNote = async (noteId) => {
  if (!noteId) {
    throw { code: 400, message: 'Note ID is required' };
  }

  const note = await Note.findById(noteId);
  if (!note) {
    throw { code: 404, message: 'Note not found' };
  }

  // Toggle trash status instead of deleting
  note.trash = !note.trash;
  await note.save();

  return note;
};

