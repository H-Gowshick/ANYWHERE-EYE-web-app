// models/Product_model.js

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  adminEmail: {
    type: String,
    default: "",
  },
  supervisorEmail: {
    type: String,
    default: "",
  },
  productId: {
    type: String,
    default: "",
  },
  productName: {
    type: String,
    default: "",
  },
  productImage: {
    type: String,
    default: "",
  },
  productCategory: {
    type: String,
    default: "",
  },
  productDescription: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "",
  },
  quantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    default: 0,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
