const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const authRoleBuyerMiddleware = require("../middlewares/authRoleBuyerMiddleware");

const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  buyProducts,
  getAllBoughtProducts,
  getAllSellerProducts,
} = require("../controllers/productContoller");

const router = express.Router();

// Authenticate seller for the following routes
router.use(authMiddleware);

// Create a new product (no role authentication required)
router.post("/", createProduct);

// Get all products (no role authentication required)
router.get("/", getAllProducts);

// Update product (product.seller be user who send request authentication required)
router.put("/:id", updateProduct);

// Delete product (product.seller be user who send request authentication required)
router.delete("/:id", deleteProduct);

// Buy products with the deposited money (buyer role authentication required)
router.post("/buy", authRoleBuyerMiddleware, buyProducts);

// Get all product the user bought (buyer role authentication required)
router.get("/purchased", authRoleBuyerMiddleware, getAllBoughtProducts);

module.exports = router;
