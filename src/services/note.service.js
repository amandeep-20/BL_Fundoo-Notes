import Note from '../models/note.model';
import User from '../models/user.model.js';
 

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


// forgot password
const otpStore = new Map();
export const forgotPassword = async (email) => {
    // console.log("Searching email:", email);
    const user = await User.findOne({ email });

    if (!user) {
        throw { code: 400, message: 'User with this email does not exist' };
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // console.log("OTP generated:", otp);
    return {otp};
};


import bcrypt from 'bcrypt';

const otpStore2 = {}; // Temporary storage for OTPs (Ideally, use a database or Redis)

// Reset Password Function
export const resetPassword = async (email, otp, newPassword) => {
    console.log("Resetting password for:", email);

    // Check if OTP is valid
    if (!otpStore2[email] || otpStore2[email] !== otp) {
        throw { code: 400, message: 'Invalid OTP or OTP expired' };
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Find user and update password
    const user = await User.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true }
    );

    if (!user) {
        throw { code: 400, message: 'User with this email does not exist' };
    }

    // Delete OTP after successful reset
    delete otpStore[email];

    return { message: 'Password reset successful' };
};


