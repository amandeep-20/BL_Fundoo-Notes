"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetPassword = exports.newUser = exports.loginUser = exports.getUsers = exports.forgotPassword = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _user = _interopRequireDefault(require("../models/user.model"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
//create new user
var newUser = exports.newUser = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(body) {
    var hashPassword, data;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return bcrypt.hash(body.password, 10);
        case 2:
          hashPassword = _context.sent;
          body.password = hashPassword;
          _context.next = 6;
          return _user["default"].create(body);
        case 6:
          data = _context.sent;
          return _context.abrupt("return", data);
        case 8:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function newUser(_x) {
    return _ref.apply(this, arguments);
  };
}();

// login
var loginUser = exports.loginUser = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(body) {
    var email, password, user, err, isPasswordValid, _err, token, userWithoutPassword;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          email = body.email, password = body.password; // Check if the user exists
          _context2.next = 3;
          return _user["default"].findOne({
            email: email
          });
        case 3:
          user = _context2.sent;
          if (user) {
            _context2.next = 8;
            break;
          }
          err = new Error('Invalid email');
          err.code = 400;
          throw err;
        case 8:
          _context2.next = 10;
          return bcrypt.compare(password, user.password);
        case 10:
          isPasswordValid = _context2.sent;
          if (isPasswordValid) {
            _context2.next = 15;
            break;
          }
          _err = new Error('Invalid password');
          _err.code = 400;
          throw _err;
        case 15:
          // jwt token gen
          token = jwt.sign({
            id: user._id,
            email: user.email
          },
          // Payload
          process.env.JWT_SECRET,
          // Secret key
          {
            expiresIn: '1h'
          } // Token expiry (adjust as needed)
          );
          userWithoutPassword = user.toObject();
          delete userWithoutPassword.password;
          return _context2.abrupt("return", {
            user: userWithoutPassword,
            token: token
          });
        case 19:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function loginUser(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

// get user
var getUsers = exports.getUsers = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var users;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return _user["default"].find({}, {
            password: 0
          });
        case 3:
          users = _context3.sent;
          return _context3.abrupt("return", users);
        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          throw new Error('Error fetching users');
        case 10:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 7]]);
  }));
  return function getUsers() {
    return _ref3.apply(this, arguments);
  };
}();

// forgot password
var recentOtp;
var forgotPassword = exports.forgotPassword = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(email) {
    var user, otp;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return _user["default"].findOne({
            email: email
          });
        case 2:
          user = _context4.sent;
          if (user) {
            _context4.next = 5;
            break;
          }
          throw {
            code: 400,
            message: 'User with this email does not exist'
          };
        case 5:
          // Generate OTP
          otp = Math.floor(100000 + Math.random() * 900000);
          recentOtp = otp;

          // console.log("OTP generated:", otp);
          return _context4.abrupt("return", {
            otp: otp
          });
        case 8:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function forgotPassword(_x3) {
    return _ref4.apply(this, arguments);
  };
}();

// Reset Password Function
var resetPassword = exports.resetPassword = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(email, otp, newPassword) {
    var user, passwordPattern, hashedPassword;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          if (!(!email || !otp || !newPassword)) {
            _context5.next = 2;
            break;
          }
          throw {
            code: 400,
            message: 'Email, OTP, and new password are required'
          };
        case 2:
          _context5.next = 4;
          return _user["default"].findOne({
            email: email
          });
        case 4:
          user = _context5.sent;
          if (user) {
            _context5.next = 7;
            break;
          }
          throw {
            code: 400,
            message: 'User with this email does not exist'
          };
        case 7:
          if (!(recentOtp !== otp)) {
            _context5.next = 9;
            break;
          }
          throw {
            code: 400,
            message: 'Invalid OTP'
          };
        case 9:
          // Validate password strength
          passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%*?&]{6,}$/;
          if (passwordPattern.test(newPassword)) {
            _context5.next = 12;
            break;
          }
          throw {
            code: 400,
            message: 'Password must be at least 6 characters long and include one uppercase letter, one lowercase letter, one number, and one special character (@$!%?&).'
          };
        case 12:
          _context5.next = 14;
          return bcrypt.hash(newPassword, 10);
        case 14:
          hashedPassword = _context5.sent;
          // Update password and clear OTP
          user.password = hashedPassword;
          recentOtp = null;
          user.otpExpiry = null;
          _context5.next = 20;
          return user.save();
        case 20:
          return _context5.abrupt("return", {
            message: 'Password reset successful'
          });
        case 21:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function resetPassword(_x4, _x5, _x6) {
    return _ref5.apply(this, arguments);
  };
}();