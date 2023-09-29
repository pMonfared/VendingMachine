const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  deposit: Number,
  role: String,
});

module.exports = mongoose.model("User", userSchema);
