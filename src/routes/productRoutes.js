const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productContoller");

const router = express.Router();

// Create a new product (seller authentication required)
router.post("/", authMiddleware, createProduct);

// Get all products (no authentication required)
router.get("/", getAllProducts);

// Authenticate seller for the following routes
router.use(authMiddleware);

// Update product (seller authentication required)
router.put("/:id", updateProduct);

// Delete product (seller authentication required)
router.delete("/:id", deleteProduct);

module.exports = router;
