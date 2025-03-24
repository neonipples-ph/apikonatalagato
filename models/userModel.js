const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullName: String,
  username: String,
  email: String,
  password: String, // Will not be selected in find() for security reasons
  age: Number,
  course: String,
  dateOfBirth: Date,
  joinedAt: { type: Date, default: Date.now },
  gender: String
});

module.exports = mongoose.model("User", UserSchema);
