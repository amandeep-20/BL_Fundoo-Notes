"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userAuth = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _httpStatusCodes = _interopRequireDefault(require("http-status-codes"));
_dotenv["default"].config();

/**
 * Middleware to authenticate if user has a valid Authorization token
 * Authorization: Bearer <token>
 */
var userAuth = exports.userAuth = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var bearerToken, decoded;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          bearerToken = req.header('Authorization');
          if (bearerToken) {
            _context.next = 4;
            break;
          }
          return _context.abrupt("return", res.status(_httpStatusCodes["default"].BAD_REQUEST).json({
            code: _httpStatusCodes["default"].BAD_REQUEST,
            message: 'Authorization token is required'
          }));
        case 4:
          bearerToken = bearerToken.split(' ')[1]; // Extract token from "Bearer <token>"

          // Verify JWT token
          decoded = _jsonwebtoken["default"].verify(bearerToken, process.env.JWT_SECRET);
          req.user = decoded; // Attach decoded user data to request object

          next(); // Proceed to next middleware
          _context.next = 13;
          break;
        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(_httpStatusCodes["default"].UNAUTHORIZED).json({
            code: _httpStatusCodes["default"].UNAUTHORIZED,
            message: 'Invalid or expired token'
          }));
        case 13:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 10]]);
  }));
  return function userAuth(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();