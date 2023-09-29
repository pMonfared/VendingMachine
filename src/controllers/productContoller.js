const Product = require("../models/productModel");
const User = require("../models/userModel");

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { amountAvailable, cost, productName } = req.body;
    const sellerId = req.user._id; // Assuming we have middleware to attach user info

    const newProduct = new Product({
      amountAvailable,
      cost,
      productName,
      sellerId,
    });

    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a list of all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { amountAvailable, cost, productName } = req.body;
    const sellerId = req.user._id; // Assuming we have middleware to attach user info

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.sellerId.toString() !== sellerId.toString()) {
      return res.status(403).json({ message: "Permission denied" });
    }

    product.amountAvailable = amountAvailable;
    product.cost = cost;
    product.productName = productName;

    await product.save();

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const sellerId = req.user._id; // Assuming we have middleware to attach user info

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.sellerId.toString() !== sellerId.toString()) {
      return res.status(403).json({ message: "Permission denied" });
    }

    await product.deleteOne();

    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
