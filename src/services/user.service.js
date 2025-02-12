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
  // Check if OTP is valid
  if (recentOtp !== parseInt(otp)) {
      throw { code: 400, message: 'OTP does not match' };
  }

  // Validate password strength using regex
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (!passwordPattern.test(newPassword)) {
      throw { 
          code: 400, 
          message: 'Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%?&).' 
      };
  }

  const emailPattren = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if(!emailPattren.test(email)){
    throw{
      code: 400,
      message: "Invalid Email!!",
    }
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

  // Reset OTP
  recentOtp = null;

  return { message: 'Password reset successful' };
};
