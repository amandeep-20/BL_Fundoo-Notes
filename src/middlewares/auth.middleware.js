import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import HttpStatus from 'http-status-codes';

dotenv.config();

/**
 * Middleware to authenticate if user has a valid Authorization token
 * Authorization: Bearer <token>
 */
export const userAuth = async (req, res, next) => {
  try {
    let bearerToken = req.header('Authorization');
    if (!bearerToken) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: 'Authorization token is required',
      });
    }

    bearerToken = bearerToken.split(' ')[1]; // Extract token from "Bearer <token>"

    // Verify JWT token
    const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user data to request object

    next(); // Proceed to next middleware
  } catch (error) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      code: HttpStatus.UNAUTHORIZED,
      message: 'Invalid or expired token',
    });
  }
};
