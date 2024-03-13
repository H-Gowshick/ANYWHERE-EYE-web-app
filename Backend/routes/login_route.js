// routes/login_route.js

const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin_model");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware.js");
const requireAuth = require("../middleware/requireAuth");
require("dotenv").config();

const generateToken = (id) => {
  return jwt.sign({ id }, "gowshick", { expiresIn: "1hr" });
};

router.post("/login", requireAuth, async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find admin by email
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    // Check password
    if (admin.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }
    // Admin authenticated successfully

    const token = generateToken(email);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Temporarily set to false for testing locally
      sameSite: "strict",
      maxAge: 3600000, // 1 hour expiration
    });

    res
      .status(200)
      .json({ message: "Admin authenticated successfully", token });

    console.log(token);
  } catch (error) {
    console.error("Error logging in admin:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/loginauth", authMiddleware, (req, res) => {
  res.json("Success");
});

module.exports = router;
