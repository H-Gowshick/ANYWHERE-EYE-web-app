// routes/admin_route.js

const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin_model");
// const Supervisor = require("../models/Supervisor_model");
// const Product = require("../models/Product_model");
const requireAuth = require("../middleware/requireAuth");
console.log(requireAuth);
// Route to handle sign-up
router.post("/signup", requireAuth, async (req, res) => {
  console.log("requireAuth", requireAuth);
  try {
    const { adminId, email, password } = req.body;
    // Check if adminId or email already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ adminId }, { email }],
    });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin ID or email already exists" });
    }
    // Create a new Admin instance
    const newAdmin = new Admin({ adminId, email, password });

    // Save to database
    await newAdmin.save();

    // // Create a new Supervisor instance with default data
    // const newSupervisor = new Supervisor({
    //   adminEmail: "",
    //   supervisorEmail: "", // Set supervisor email to empty by default
    //   supervisorPassword: "", // Set supervisor password to empty by default
    //   category: "",
    // });
    // // Save supervisor to database
    // await newSupervisor.save();

    // // Create a new Product instance with default data
    // const newProduct = new Product({
    //   adminEmail: "", // Set admin email for product
    //   supervisorEmail: "", // Set supervisor email to empty by default
    //   productId: "",
    //   productName: "", // Set product name to empty by default
    //   productImage: "", // Set product image to empty by default
    //   productCategory: "", // Set product category to empty by default
    //   productDescription: "", // Set product description to empty by default
    //   color: "",
    //   size: "",
    //   quantity: "",
    //   price: "", // Set price to empty by default
    // });
    // // Save product to database
    // await newProduct.save();

    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
