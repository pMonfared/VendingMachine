const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  deposit: Number,
  role: String,
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      userId: this._id,
      role: this.role,
    },
    process.env.SECRET_KEY
  );
  return token;
};

module.exports = mongoose.model("User", userSchema);
