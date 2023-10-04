// Import required modules
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

// Define the user schema for the MongoDB collection
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true }, // User's unique username
  password: {
    type: String,
    required: true,
    maxlength: 1024, // Maximum length for the hashed password
    minlength: 5, // Minimum length for the password
  },
  deposit: Number, // User's deposit amount
  role: String, // User's role (buyer or seller)
});

// Method to generate an authentication token for the user
userSchema.methods.generateAuthToken = function () {
  // Generate a JSON Web Token (JWT) with user's ID and role, using a secret key
  const token = jwt.sign(
    {
      userId: this._id, // User's MongoDB document ID
      role: this.role, // User's role (buyer or seller)
    },
    process.env.SECRET_KEY // Secret key used to sign the token
    //{ expiresIn: "1h" }
    /*
    the expiresIn option is crucial for security and session management.
    It ensures that tokens have a limited lifetime, reducing the risk 
    associated with long-lived tokens. However, it requires users to reauthenticate
    after their tokens expire, which is a common practice to enhance security.
    The choice of the expiration time ('1h' in this case) should align with
    your application's security requirements and user experience considerations.
    */
  );
  return token;
};

// Function to validate user input using Joi schema
function validateUser(user) {
  // Define a Joi schema for user input validation
  const schema = Joi.object({
    username: Joi.string().min(5).max(50).required(), // Username validation
    password: Joi.string().min(5).max(255).required(), // Password validation
    role: Joi.string().valid("buyer", "seller").required(), // Role validation
  });

  // Validate the user input against the schema
  return schema.validate(user);
}

// Function to validate deposit amount using Joi schema
function validateDeposit(user) {
  // Define a Joi schema for deposit amount validation
  const schema = Joi.object({
    amount: Joi.number().valid(5, 10, 20, 50, 100).required(), // Valid deposit amounts
  });

  // Validate the deposit amount against the schema
  return schema.validate(user);
}

// Create a User model using the userSchema
const User = mongoose.model("User", userSchema);

// Export the User model, and the validation functions
module.exports = {
  User, // Export the User model
  validate: validateUser, // Export the user input validation function
  validateDeposit: validateDeposit, // Export the deposit amount validation function
};
