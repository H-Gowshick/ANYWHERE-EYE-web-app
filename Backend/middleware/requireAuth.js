// authMiddleware.js
require("dotenv").config();

const requireAuth = (req, res, next) => {
  const apiKey = req.headers.authorization; // Extract API key from Authorization header
  console.log(apiKey);
  console.log(process.env.SECRET_API_KEY);
  if (!apiKey || apiKey !== process.env.SECRET_API_KEY) {
    return res.status(404).json({ error: "API key not found or invalid" });
  }
  console.log("custopm api authentication cheking is successfull");
  next(); // Move to the next middleware or route handler
};

module.exports = requireAuth;
