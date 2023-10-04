// Import required modules
const Joi = require("joi"); // Joi for input validation
const mongoose = require("mongoose"); // Mongoose for MongoDB integration

// Define the product schema for the MongoDB collection
const productSchema = new mongoose.Schema({
  amountAvailable: Number, // Amount of the product available
  cost: Number, // Cost of the product
  productName: String, // Name of the product
  sellerId: mongoose.Schema.Types.ObjectId, // Seller's MongoDB document ID
});

// Function to validate product creation input using Joi schema
function validateCreateProduct(product) {
  // Define a Joi schema for product creation validation
  const schema = Joi.object({
    productName: Joi.string().max(50).required(), // Product name validation
    cost: Joi.number().integer().min(1).required(), // Cost validation
    amountAvailable: Joi.number().integer().min(1).required(), // Amount available validation
  });

  // Validate the product input against the schema
  return schema.validate(product);
}

// Create a Product model using the productSchema
const Product = mongoose.model("Product", productSchema);

// Export the Product model and the validation function
module.exports = {
  Product, // Export the Product model
  validateCreateProduct: validateCreateProduct, // Export the product creation validation function
};
