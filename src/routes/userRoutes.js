const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const authRoleBuyerMiddleware = require("../middlewares/authRoleBuyerMiddleware");

const {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  depositCoins,
  resetDeposit,
} = require("../controllers/userController");

const router = express.Router();

// Register a new user (no authentication required)
router.post("/", createUser);

// Authenticate user for the following routes
router.use(authMiddleware);

// User Logout (Single Session)
// router.post('/logout', logoutUser);
/*
 No action is required here because JWT tokens are stateless.
 Clients handle their own tokens.
*/

// User Logout All Sessions
// router.post('/logout/all', logoutAllUserSessions);
/*
 Implement your logic to handle revocation of tokens if needed.
 For example, you can maintain a list of revoked tokens on the server.
 Clients will need to check if their token is revoked during each request.
*/

// Get user by ID (authentication required)
router.get("/:id", getUserById);

// Update user (authentication required)
router.put("/:id", updateUser);

// Delete user (authentication required)
router.delete("/:id", deleteUser);

// Deposit coins into the user's account (buyer role authentication required)
router.post("/deposit", authRoleBuyerMiddleware, depositCoins);

// Reset the user's deposit balance to 0 (buyer role authentication required)
router.post("/deposit/reset", authRoleBuyerMiddleware, resetDeposit);

module.exports = router;
