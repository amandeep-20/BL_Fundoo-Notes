import Note from '../models/note.model';
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';

 

// create note
export const createNote = async (body)=>{
    const note = await Note.create(body);
    return note;
};


// get all notes
export const getNotes = async (userId)=>{
    const note = await Note.find({userId,trash: false});
    return note;
};

export const getNoteById = async (noteId, userId) => {
    return await Note.findOne({ _id: noteId, userId }); // Ensure user can only access their own notes
};
  
// Update note by ID
export const updateNoteById = async (noteId, userId, updateData) => {
    return await Note.findOneAndUpdate(
        { _id: noteId, userId }, // Ensure user can only update their own notes
        updateData,
        { new: true } // Return updated note
    );
};


// delete
export const deleteNote = async (noteId) => {
    const note = await Note.findById(noteId);

    if (!note) {
        return null;
    }

    // Toggle trash value instead of deleting
    note.trash = !note.trash;
    await note.save();

    return note;
};

