"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newUserValidator = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _joi = _interopRequireDefault(require("@hapi/joi"));
var _user = _interopRequireDefault(require("../models/user.model"));
var newUserValidator = exports.newUserValidator = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var schema, _schema$validate, error, value, existingUser;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          // console.log('Inside Validator');
          schema = _joi["default"].object({
            name: _joi["default"].string().min(4).required().messages({
              'string.min': 'Name must be at least 4 characters long.',
              'any.required': 'Name is required.'
            }),
            email: _joi["default"].string().email().pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/).required().messages({
              'string.email': 'Invalid email format.',
              'any.required': 'Email is required and must be a Gmail address.'
            }),
            phoneNo: _joi["default"].number().integer().min(6000000000).max(9999999999).optional().messages({
              'number.base': 'Phone number must be a number.',
              'number.min': 'Phone number must be a 10-digit number starting with 6, 7, 8, or 9.',
              'number.max': 'Phone number must be a 10-digit number starting with 6, 7, 8, or 9.'
            }),
            password: _joi["default"].string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%*?&]{6,}$/).required().messages({
              'string.pattern.base': 'Password must be at least 6 characters long, include one uppercase, one lowercase, one number, and one special character.',
              'any.required': 'Password is required.'
            })
          });
          _schema$validate = schema.validate(req.body, {
            abortEarly: false
          }), error = _schema$validate.error, value = _schema$validate.value;
          if (!error) {
            _context.next = 4;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            errors: error.details.map(function (err) {
              return err.message;
            })
          }));
        case 4:
          _context.prev = 4;
          _context.next = 7;
          return _user["default"].findOne({
            email: value.email
          });
        case 7:
          existingUser = _context.sent;
          if (!existingUser) {
            _context.next = 10;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            error: 'Email is already registered.'
          }));
        case 10:
          req.validatedBody = value;
          next();
          _context.next = 18;
          break;
        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](4);
          console.error('Database Error:', _context.t0);
          return _context.abrupt("return", res.status(500).json({
            error: 'Internal Server Error'
          }));
        case 18:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[4, 14]]);
  }));
  return function newUserValidator(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();