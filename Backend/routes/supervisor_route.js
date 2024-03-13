// routes/supervisor_route.js

const express = require("express");
const router = express.Router();
const Supervisor = require("../models/Supervisor_model");
const Product = require("../models/Product_model");
const requireAuth = require("../middleware/requireAuth");
console.log(requireAuth);
// Route to get the count of supervisor accounts for a specific admin email
router.get("/count", requireAuth, async (req, res) => {
  try {
    const adminEmail = req.query.adminEmail;
    // Find all supervisors with the specified admin email
    const count = await Supervisor.countDocuments({ adminEmail });
    res.json({ count });
  } catch (error) {
    console.error("Error fetching supervisor count:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// router.post("/create", async (req, res) => {
//   try {
//     const { adminEmail, supervisorEmail, supervisorPassword } = req.body;

//     // Check if the supervisor account already exists
//     const existingSupervisor = await Supervisor.findOne({ supervisorEmail });
//     if (existingSupervisor) {
//       return res
//         .status(400)
//         .json({ message: "Supervisor account already exists" });
//     }

//     // Create a new supervisor instance
//     const newSupervisor = new Supervisor({
//       adminEmail,
//       supervisorEmail,
//       supervisorPassword,
//     });

//     // Save the new supervisor to the database
//     await newSupervisor.save();

//     res
//       .status(201)
//       .json({ message: "Supervisor account created successfully" });
//   } catch (error) {
//     console.error("Error creating supervisor account:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

router.post("/create", requireAuth, async (req, res) => {
  try {
    const { adminEmail, supervisorEmail, supervisorPassword, category } =
      req.body;

    // Check if the supervisor account already exists
    const existingSupervisor = await Supervisor.findOne({ supervisorEmail });
    if (existingSupervisor) {
      return res
        .status(400)
        .json({ message: "Supervisor account already exists" });
    }

    // Create a new supervisor instance
    const newSupervisor = new Supervisor({
      adminEmail,
      supervisorEmail,
      supervisorPassword,
      category, // Include category field
    });

    // Save the new supervisor to the database
    await newSupervisor.save();

    res
      .status(201)
      .json({ message: "Supervisor account created successfully" });
  } catch (error) {
    console.error("Error creating supervisor account:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/view", requireAuth, async (req, res) => {
  try {
    const { adminEmail } = req.query;

    // Find supervisor accounts associated with admin's email
    const supervisorAccounts = await Supervisor.find({ adminEmail });

    res.status(200).json(supervisorAccounts);
  } catch (error) {
    console.error("Error fetching supervisor accounts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to fetch supervisor emails for product form
router.get("/emails", requireAuth, async (req, res) => {
  try {
    // Query the database to find all supervisors and project only their emails
    const supervisors = await Supervisor.find(
      {},
      { supervisorEmail: 1, _id: 0 }
    );
    const emails = supervisors.map((supervisor) => supervisor.supervisorEmail);
    res.json({ emails });
  } catch (error) {
    console.error("Error fetching supervisor emails:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to fetch supervisor category by email for a admin product form
router.get("/category", requireAuth, async (req, res) => {
  try {
    const { email } = req.query;

    // Find the supervisor by email
    const supervisor = await Supervisor.findOne({ supervisorEmail: email });

    if (!supervisor) {
      return res.status(404).json({ error: "Supervisor not found" });
    }

    // Return the supervisor category
    res.json({ category: supervisor.category });
  } catch (error) {
    console.error("Error fetching supervisor category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to handle supervisor login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find supervisor by email
    const supervisor = await Supervisor.findOne({ supervisorEmail: email });
    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found" });
    }
    // Check password
    if (supervisor.supervisorPassword !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }
    // Supervisor authenticated successfully
    res.status(200).json({ message: "Supervisor authenticated successfully" });
  } catch (error) {
    console.error("Error logging in supervisor:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to handle DELETE request for deleting supervisor account
router.delete("/delete", requireAuth, async (req, res) => {
  const { adminEmail, supervisorEmail } = req.body;

  try {
    // Check if the admin email is valid
    // You might want to add additional validation here if needed
    if (!adminEmail) {
      return res.status(400).json({ error: "Admin email is required" });
    }

    // Find the supervisor account based on admin and supervisor emails
    const supervisor = await Supervisor.findOneAndDelete({
      adminEmail,
      supervisorEmail,
    });

    // Check if supervisor account exists
    if (!supervisor) {
      return res.status(404).json({ error: "Supervisor account not found" });
    }

    // Return success message
    return res.json({ message: "Supervisor account deleted successfully" });
  } catch (error) {
    console.error("Error deleting supervisor account:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});



module.exports = router;
