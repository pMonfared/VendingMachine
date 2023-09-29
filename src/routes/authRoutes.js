const express = require("express");
const { createUser, loginUser } = require("../controllers/userController");

const router = express.Router();

// Register a new user
router.post("/register", createUser);

// Login and authenticate a user
router.post("/login", loginUser);

module.exports = router;
