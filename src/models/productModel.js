const Joi = require("joi");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  amountAvailable: Number,
  cost: Number,
  productName: String,
  sellerId: mongoose.Schema.Types.ObjectId,
});

function validateCreateProduct(product) {
  const schema = Joi.object({
    productName: Joi.string().max(50).required(),
    cost: Joi.number().integer().min(1).required(),
    amountAvailable: Joi.number().integer().min(1).required(),
  });

  return schema.validate(product);
}

const Product = mongoose.model("Product", productSchema);
module.exports = {
  Product,
  validateCreateProduct: validateCreateProduct,
};
