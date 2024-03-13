// routes/product_route.js

const express = require("express");
const router = express.Router();

const Product = require("../models/Product_model");
const mongoose = require("mongoose");
// Configure Multer for file upload
const multer = require("multer");
const upload = multer();
const requireAuth = require("../middleware/requireAuth");
console.log(requireAuth);

// Route to handle counting products by admin email to show in admin page
router.get("/adminPage/count", requireAuth, async (req, res) => {
  try {
    const { adminEmail } = req.query;
    // Count the number of products associated with the admin's email
    const count = await Product.countDocuments({ adminEmail });
    console.log("product route reached");
    res.json({ count });
  } catch (error) {
    console.error("Error counting products:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new product
router.post(
  "/create",
  requireAuth,
  upload.single("productImage"),
  async (req, res) => {
    try {
      const {
        adminEmail,
        supervisorEmail,
        productId,
        productName,
        productCategory,
        productDescription,
        color,
        size,
        quantity, // Add quantity field
        price,
      } = req.body;

      const productImage = req.file.buffer;
      const base64Image = productImage.toString("base64");

      const newProduct = new Product({
        adminEmail,
        supervisorEmail,
        productId,
        productName,
        productImage: base64Image,
        productCategory,
        productDescription,
        color,
        size,
        quantity, // Set quantity field
        price,
      });

      await newProduct.save(); // Save the new product to the database

      res.status(201).json({ message: "Product created successfully" });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Failed to create product" });
    }
  }
);

// Route to fetch product quantity based on status (in stock or out of stock) admin page
router.get("/quantity", requireAuth, async (req, res) => {
  const { adminEmail, quantity } = req.query;
  try {
    // Fetch product quantity based on status (in stock or out of stock)
    const products = await Product.find({ adminEmail, quantity });
    const count = products.length;
    res.json({ count });
  } catch (error) {
    console.error("Error fetching product quantity:", error);
    res.status(500).json({ error: "Failed to fetch product quantity" });
  }
});

// Route to fetch product quantities based on supervisor email
router.get("/supervisorEmail/quantity", requireAuth, async (req, res) => {
  try {
    const supervisorEmail = req.query.supervisorEmail;
    // Find products based on supervisor email
    const products = await Product.find({ supervisorEmail: supervisorEmail });
    // Extract quantities from products
    const quantities = products.map((product) => product.quantity);
    res.json({ quantity: quantities });
  } catch (error) {
    console.error("Error fetching product quantities:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to fetch count of products associated with a supervisor's email to show in supervisor page
router.get("/supervisorPage/count", requireAuth, async (req, res) => {
  const { supervisorEmail } = req.query;

  try {
    // Find all products that match the supervisor's email
    const productCount = await Product.countDocuments({ supervisorEmail });
    res.json({ count: productCount });
  } catch (error) {
    console.error("Error fetching product count:", error);
    res.status(500).json({
      message: "Failed to fetch product count. Please try again later.",
    });
  }
});

// Route to fetch products supervisor page
router.get("/supervisorPage", requireAuth, async (req, res) => {
  const supervisorEmail = req.query.supervisorEmail;
  const category = req.query.category; // Retrieve category from query parameters

  try {
    let products;
    if (category) {
      // If category is provided, fetch products filtered by category
      products = await Product.find({
        supervisorEmail,
        productCategory: category,
      });
    } else {
      // If category is not provided, fetch all products for the supervisor
      products = await Product.find({ supervisorEmail });
    }

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Update an existing product
router.put("/:productId", requireAuth, async (req, res) => {
  const { productId } = req.params;
  const {
    productName,
    productDescription,
    price,
    color,
    size,
    quantity, // Include quantity field
  } = req.body;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.productName = productName;

    product.productDescription = productDescription;
    product.price = price;
    product.color = color;
    product.size = size;
    product.quantity = quantity; // Set quantity field

    await product.save();

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route for fetching products with the same admin email
router.get("/", requireAuth, async (req, res) => {
  const adminEmail = req.query.adminEmail;
  try {
    const products = await Product.find({ adminEmail });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.delete("/delete", requireAuth, async (req, res) => {
  const { productId, adminEmail } = req.body;

  try {
    // Check if productId is provided
    if (!productId) {
      return res.status(400).json({ error: "ProductId is required" });
    }

    // Delete the product
    const deletedProduct = await Product.findOneAndDelete({
      productId: productId, // Find product by productId as a string
      adminEmail: adminEmail,
    });

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




module.exports = router;
