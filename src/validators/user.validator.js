import Joi from '@hapi/joi';
import User from '../models/user.model';

export const newUserValidator = async (req, res, next) => {
  // console.log('Inside Validator');

  const schema = Joi.object({
    name: Joi.string().min(4).required().messages({
      'string.min': 'Name must be at least 4 characters long.',
      'any.required': 'Name is required.',
    }),
    email: Joi.string()
      .email()
      .pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
      .required()
      .messages({
        'string.email': 'Invalid email format.',
        'any.required': 'Email is required and must be a Gmail address.',
      }),
    phoneNo: Joi.number()
      .integer()
      .min(6000000000)
      .max(9999999999)
      .optional()
      .messages({
        'number.base': 'Phone number must be a number.',
        'number.min': 'Phone number must be a 10-digit number starting with 6, 7, 8, or 9.',
        'number.max': 'Phone number must be a 10-digit number starting with 6, 7, 8, or 9.',
      }),
    password: Joi.string()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%*?&]{6,}$/)
      .required()
      .messages({
        'string.pattern.base':
          'Password must be at least 6 characters long, include one uppercase, one lowercase, one number, and one special character.',
        'any.required': 'Password is required.',
      }),
  });

  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({ errors: error.details.map((err) => err.message) });
  }

  try {
    const existingUser = await User.findOne({ email: value.email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    req.validatedBody = value;
    next();
  } catch (dbError) {
    console.error('Database Error:', dbError);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};