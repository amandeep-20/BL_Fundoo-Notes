import HttpStatus from 'http-status-codes';
import * as UserService from '../services/user.service';

export const newUser = async (req, res, next) => {
  try {
    console.log("Inside Controller");
    const data = await UserService.newUser(req.body);
    res.status(HttpStatus.CREATED).json({
      code: HttpStatus.CREATED,
      data: data,
      message: 'User created !!!!'
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const data = await UserService.loginUser(req.body);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: data,
      message: 'Login successful',
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const data = await UserService.getUsers(req.body);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: data,
      message: 'Login successful',
    });
  } catch (error) {
    next(error);
  }
};




export const forgotPassword = async (req, res, next) => {
  try {
      const data = await UserService.forgotPassword(req.body.email);
      res.status(HttpStatus.OK).json({
          code: HttpStatus.OK,
          data,
          message: 'OTP sent to email',
      });
  } catch (error) {
      next(error);
  }
};



export const resetPassword = async (req, res, next) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: "Email, OTP, and new password are required" });
        }

        const data = await UserService.resetPassword(email, otp, newPassword);

        res.status(HttpStatus.OK).json({
            data,
        });
    } catch (error) {
        next(error);
    }
};
