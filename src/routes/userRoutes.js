const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createUser,
  loginUser,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

// Register a new user (no authentication required)
router.post("/", createUser);

// Authenticate user for the following routes
router.use(authMiddleware);

// Get user by ID
router.get("/:id", getUserById);

// Update user
router.put("/:id", updateUser);

// Delete user
router.delete("/:id", deleteUser);

module.exports = router;
