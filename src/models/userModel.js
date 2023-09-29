const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: {
    type: String,
    required: true,
    maxlength: 1024,
    minlength: 5,
  },
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

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(5).max(50).required(),
    password: Joi.string().min(5).max(255).required(),
    role: Joi.string().valid("buyer", "seller").required(),
  });

  return schema.validate(user);
}

const User = mongoose.model("User", userSchema);
module.exports = {
  User,
  validate: validateUser,
};
