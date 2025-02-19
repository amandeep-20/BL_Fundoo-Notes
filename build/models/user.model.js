"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = require("mongoose");
var userSchema = new _mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNo: {
    type: Number
  },
  password: {
    type: String,
    required: true
    // select : false
  }
}, {
  timestamps: true
});
var _default = exports["default"] = (0, _mongoose.model)('User', userSchema);