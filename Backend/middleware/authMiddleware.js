const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    
    return res.json({ message: "Missing token" });
  }

  jwt.verify(token,"gowshick" , (err, user) => {
    if (err) {
      return res.json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  });
};

module.exports = authMiddleware;