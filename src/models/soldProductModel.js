// Import the required mongoose module
const mongoose = require("mongoose");

// Define the schema for the "SoldProduct" collection
const soldProductSchema = new mongoose.Schema({
  // Reference to the product being sold, using its MongoDB document ID
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Refers to the "Product" model
    required: true, // This field is required
  },
  // Reference to the buyer, using their MongoDB document ID
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Refers to the "User" model
    required: true, // This field is required
  },
  // Quantity of the product being sold
  quantity: {
    type: Number,
    required: true, // This field is required
  },
  // Price at which the product was sold
  price: {
    type: Number,
    required: true, // This field is required
  },
  // Timestamp indicating when the sale occurred, defaults to the current date and time
  timestamp: {
    type: Date,
    default: Date.now, // Default value is the current date and time
  },
});

// Create a model named "SoldProduct" using the defined schema
const SoldProduct = mongoose.model("SoldProduct", soldProductSchema);

// Export the "SoldProduct" model to make it available for use in other parts of the application
module.exports = SoldProduct;
