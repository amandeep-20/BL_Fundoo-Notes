import User from '../models/user.model';
const bcrypt  = require("bcrypt");
const jwt = require('jsonwebtoken');
import dotenv from 'dotenv';

//create new user
export const newUser = async (body) => {
  const hashPassword = await bcrypt.hash(body.password,10);
  body.password = hashPassword;
  const data = await User.create(body);
  return data;
};

// login
export const loginUser = async (body) => {
  const { email, password } = body;
  // Check if the user exists
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error('Invalid email');
    err.code = 400;
    throw err;
  }
  // Compare entered password with hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const err = new Error('Invalid password');
    err.code = 400;
    throw err;
  }

  // jwt token gen
  const token = jwt.sign(
    { id: user._id, email: user.email }, // Payload
    process.env.JWT_SECRET, // Secret key
    { expiresIn: '1h' } // Token expiry (adjust as needed)
  );

  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;
  return { user: userWithoutPassword , token};
};

// get user
export const getUsers = async () => {
  try {
    const users = await User.find({}, { password: 0 }); // Excludes passwords
    return users;
  } catch (error) {
    throw new Error('Error fetching users');
  }
};

// forgot password
let recentOtp;
export const forgotPassword = async (email) => {
    // console.log("Searching email:", email);
    const user = await User.findOne({ email });

    if (!user) {
        throw { code: 400, message: 'User with this email does not exist' };
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    recentOtp=otp;

    // console.log("OTP generated:", otp);
    return {otp};
};





// Reset Password Function
export const resetPassword = async (email, otp, newPassword) => {
  if (!email || !otp || !newPassword) {
    throw { code: 400, message: 'Email, OTP, and new password are required' };
  }

  // Fetch user and OTP from the database
  const user = await User.findOne({ email });
  if (!user) {
    throw { code: 400, message: 'User with this email does not exist' };
  }

  if (recentOtp !== otp) {
    throw { code: 400, message: 'Invalid OTP' };
  }

  // Validate password strength
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (!passwordPattern.test(newPassword)) {
    throw { 
      code: 400, 
      message: 'Password must be at least 6 characters long and include one uppercase letter, one lowercase letter, one number, and one special character (@$!%?&).' 
    };
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password and clear OTP
  user.password = hashedPassword;
  recentOtp = null;
  user.otpExpiry = null;
  await user.save();

  return { message: 'Password reset successful' };
};