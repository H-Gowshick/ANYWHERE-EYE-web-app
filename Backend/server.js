// yZjRPppkyMKwATAP

// server.js

const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./connection");
const signupRoutes = require("./routes/signup_route");
const loginRoutes = require("./routes/login_route");
const supervisorRoute = require("./routes/supervisor_route");
const productRoute = require("./routes/product_route");
const cookieParser = require("cookie-parser")

var cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// Parse application/json
app.use(bodyParser.json());
app.use(cors({
  origin: "http://localhost:3000", // Allow requests from this origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow these HTTP methods
  credentials: true, // Allow cookies to be sent and received
  exposedHeaders: ["Content-Length", "Authorization"], // Expose certain headers
}));

// Use admin routes
app.use("/api", signupRoutes);
// Use login routes
app.use("/api/admin", loginRoutes);
// use supervisor routes
app.use("/api/supervisor", supervisorRoute);
// use product routes
app.use("/api/product", productRoute);


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
