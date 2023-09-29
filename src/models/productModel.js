const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  amountAvailable: Number,
  cost: Number,
  productName: String,
  sellerId: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model("Product", productSchema);
