const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const authRoleBuyerMiddleware = require("../middlewares/authRoleBuyerMiddleware");

const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  buyProduct,
  getAllPurchasedProducts,
} = require("../controllers/productContoller");

const router = express.Router();

// Authenticate seller for the following routes
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API for managing products
 */

// Create a new product (no role authentication required)
/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */
router.post("/", createProduct);

// Get all products (no role authentication required)
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllProducts);

// Update product (product.seller be user who send request authentication required)
/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", updateProduct);

// Delete product (product.seller be user who send request authentication required)
/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", deleteProduct);

// Buy products with the deposited money (buyer role authentication required)
/**
 * @swagger
 * /products/buy:
 *   post:
 *     summary: Buy products with deposited money (Buyer role required)
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Products bought successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PurchaseResponse'
 *       401:
 *         description: Unauthorized - Buyer role required
 *       500:
 *         description: Internal server error
 */
router.post("/buy", authRoleBuyerMiddleware, buyProduct);

// Get all product the user bought (buyer role authentication required)
/**
 * @swagger
 * /products/purchased:
 *   get:
 *     summary: Get all products the user bought (Buyer role required)
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of purchased products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductSold'
 *       401:
 *         description: Unauthorized - Buyer role required
 *       500:
 *         description: Internal server error
 */
router.get("/purchased", authRoleBuyerMiddleware, getAllPurchasedProducts);

module.exports = router;
