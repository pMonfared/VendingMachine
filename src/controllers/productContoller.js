// Import required models
const { Product, validateCreateProduct } = require("../models/productModel");
const SoldProduct = require("../models/soldProductModel");

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { error } = validateCreateProduct(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    // Extract product details from the request body
    const { amountAvailable, cost, productName } = req.body;
    const sellerId = req.user._id; // Assuming we have middleware to attach user info

    // Create a new product instance
    const newProduct = new Product({
      amountAvailable,
      cost,
      productName,
      sellerId,
    });

    // Save the new product to the database
    await newProduct.save();

    // Respond with the created product
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a list of all products
const getAllProducts = async (req, res) => {
  try {
    // Retrieve user information from the request (assuming attached via middleware)
    const user = req.user;

    // Query products based on user role (seller or buyer)
    const products =
      user.role === "seller"
        ? await Product.find({ sellerId: user._id })
        : await Product.find();

    // Respond with the list of products
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a list of all products purchased by a user
const getAllPurchasedProducts = async (req, res) => {
  try {
    // Retrieve user information from the request (assuming attached via middleware)
    const user = req.user;

    // Find all sold products for the current user and populate product details
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

    // Respond with the list of bought products and their details
    res.json(productsWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  try {
    // Extract product ID and updated details from the request
    const productId = req.params.id;
    const { amountAvailable, cost, productName } = req.body;
    const sellerId = req.user._id; // Assuming we have middleware to attach user info

    // Find the product by ID
    const product = await Product.findById(productId);

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user has permission to update the product
    if (product.sellerId.toString() !== sellerId.toString()) {
      return res.status(403).json({ message: "Permission denied" });
    }

    // Update product details
    product.amountAvailable = amountAvailable;
    product.cost = cost;
    product.productName = productName;

    // Save the updated product
    await product.save();

    // Respond with the updated product
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    // Extract product ID and user ID from the request
    const productId = req.params.id;
    const sellerId = req.user._id; // Assuming we have middleware to attach user info

    // Find the product by ID
    const product = await Product.findById(productId);

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user has permission to delete the product
    if (product.sellerId.toString() !== sellerId.toString()) {
      return res.status(403).json({ message: "Permission denied" });
    }

    // Delete the product
    await product.deleteOne();

    // Respond with a success message
    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Buy product with the deposited money
const buyProduct = async (req, res) => {
  try {
    // Extract product ID and quantity from the request
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

    if (product.amountAvailable == 0)
      return res.status(400).json({ message: "Product is out of stock" });

    // Calculate the total cost based on the product's price and quantity
    const totalCost = product.cost * quantity;

    // Check if the user has enough deposit to make the purchase
    if (user.deposit < totalCost) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    // Deduct the purchase amount from the user's deposit
    user.deposit -= totalCost;

    // Update the product's quantity
    product.amountAvailable -= quantity;

    // Calculate and return any change to the user
    const change = calculateChange(totalCost, user.deposit);

    // Create a new sold product record
    const soldProduct = new SoldProduct({
      productId: product._id,
      buyerId: user._id,
      quantity,
      price: product.cost,
    });

    // Save the user, product, and sold product records
    await user.save();
    await product.save();
    await soldProduct.save();

    // Respond with purchase details
    res.json({
      message: "Purchase successful",
      userDeposit: user.deposit,
      totalSpent: totalCost,
      productPurchased: {
        productId: product._id,
        productName: product.productName,
        amountAvailable: product.amountAvailable,
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
  let change = userDeposit - totalCost;
  const coinDenominations = [100, 50, 20, 10, 5];
  let changeCoins = {};

  // Calculate the change using coin denominations
  for (const denomination of coinDenominations) {
    if (change >= denomination) {
      const count = Math.floor(change / denomination);
      changeCoins[denomination] = count;
      change -= count * denomination;
    }
  }

  return changeCoins;
}

// Export all the controller functions
module.exports = {
  createProduct,
  getAllProducts,
  getAllPurchasedProducts,
  updateProduct,
  deleteProduct,
  buyProduct,
};
