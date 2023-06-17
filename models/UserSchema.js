const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
