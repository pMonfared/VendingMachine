const Product = require("../models/productModel");
const SoldProduct = require("../models/soldProductModel");
const { User } = require("../models/userModel");

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

// Get a list of all products
const getAllBoughtProducts = async (req, res) => {
  try {
    const user = req.user; // Assuming user information is attached via middleware

    // Find all sold products for the current user
    const boughtProducts = await SoldProduct.find({
      buyerId: user._id,
    }).populate({
      path: "productId",
      select: "productName cost", // Select the fields you want to retrieve
    });

    // Map the boughtProducts to include product details and calculate total cost
    const productsWithDetails = boughtProducts.map((soldProduct) => {
      const { productId, quantity, price } = soldProduct;
      const { productName, cost } = productId;

      return {
        productId: productId._id,
        productName,
        quantity,
        price,
        totalCost: price * quantity, // Calculate the total cost
      };
    });

    res.json(productsWithDetails);
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

// Buy products with the deposited money
const buyProducts = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = req.user; // Assuming user information is attached via middleware

    // Check if the user has a "buyer" role
    if (user.role !== "buyer") {
      return res.status(403).json({ message: "Permission denied" });
    }

    // Validate the product ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Calculate the total cost based on the product's price and quantity
    const totalCost = product.cost * quantity;

    // Check if the user has enough deposit to make the purchase
    if (user.deposit < totalCost) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    // Deduct the purchase amount from the user's deposit
    user.deposit -= totalCost;
    await user.save();

    // Update the product's quantity
    product.amountAvailable -= quantity;
    await product.save();

    // Calculate and return any change to the user
    const change = calculateChange(totalCost, user.deposit);

    // Create a new sold product record
    const soldProduct = new SoldProduct({
      productId: product._id,
      buyerId: user._id,
      quantity,
      price: product.cost,
    });
    await soldProduct.save();

    res.json({
      message: "Purchase successful",
      totalSpent: totalCost,
      productsPurchased: {
        productId: product._id,
        productName: product.productName,
        quantity,
      },
      change,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Helper function to calculate change in coins
function calculateChange(totalCost, userDeposit) {
  const change = userDeposit - totalCost;
  const coinDenominations = [100, 50, 20, 10, 5];
  const changeCoins = {};

  for (const denomination of coinDenominations) {
    if (change >= denomination) {
      const count = Math.floor(change / denomination);
      changeCoins[denomination] = count;
      change -= count * denomination;
    }
  }

  return changeCoins;
}

module.exports = {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  buyProducts,
  getAllBoughtProducts,
};
