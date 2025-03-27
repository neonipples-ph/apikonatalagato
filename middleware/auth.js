const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Ensure token exists and follows 'Bearer <token>' format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided or invalid format." });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired. Please log in again." });
      } else {
        return res.status(403).json({ message: "Invalid token." });
      }
    }

    req.user = decoded; // Attach decoded user info to request
    next();
  });
};

module.exports = authenticateToken;
