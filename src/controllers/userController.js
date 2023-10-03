const { User, validate, validateDeposit } = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

// Create a new user (registration)
const createUser = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { username, password, role } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      deposit: 0,
      role: role.toLowerCase(),
    });

    await newUser.save();

    const token = newUser.generateAuthToken();

    const user = _.pick(newUser, ["username", "role", "_id", "deposit"]);

    res.status(201).header("x-auth-token", token).json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Authenticate and login a user
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const existUser = await User.findOne({ username });
    if (!existUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare the provided password with the stored hash
    const passwordMatch = await bcrypt.compare(password, existUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token for authentication
    // console.log("SECRET_KEY:", process.env.SECRET_KEY);

    const token = existUser.generateAuthToken();

    const user = _.pick(existUser, ["username", "role", "_id", "deposit"]);

    console.log("user", user);

    res.header("x-auth-token", token).json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a user by ID
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a user
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { deposit, role } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // You may add authorization checks here to ensure only certain users can update profiles

    user.deposit = deposit;
    user.role = role;

    await user.save();

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // You may add authorization checks here to ensure only certain users can delete profiles

    await user.remove();

    res.json({ message: "User deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Deposit coins into the user's account
const depositCoins = async (req, res) => {
  try {
    const { error } = validateDeposit(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { amount } = req.body;
    const user = req.user; // Assuming user information is attached via middleware

    // Check if the user has a "buyer" role
    if (user.role !== "buyer") {
      return res.status(403).json({ message: "Permission denied" });
    }

    // Validate the deposited coin amount (5, 10, 20, 50, or 100 cents)
    if (![5, 10, 20, 50, 100].includes(amount)) {
      return res.status(400).json({ message: "Invalid coin denomination" });
    }

    // Update the user's deposit balance
    user.deposit += amount;
    await user.save();

    res.json({ message: "Deposit successful", deposit: user.deposit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset the user's deposit balance to 0
const resetDeposit = async (req, res) => {
  try {
    const user = req.user; // Assuming user information is attached via middleware

    // Check if the user has a "buyer" role
    if (user.role !== "buyer") {
      return res.status(403).json({ message: "Permission denied" });
    }

    // Reset the user's deposit balance to 0
    user.deposit = 0;
    await user.save();

    res.json({ message: "Deposit reset to 0", deposit: user.deposit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createUser,
  loginUser,
  getUserById,
  updateUser,
  deleteUser,
  depositCoins,
  resetDeposit,
};
