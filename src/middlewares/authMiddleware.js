const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  let token = req.headers["x-access-token"] || req.header("authorization");

  // Remove Bearer from string
  token = token?.replace(/^Bearer\s+/, "");
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    console.log("Token:", token);
    console.log("secretKey:", process.env.SECRET_KEY);
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = authMiddleware;
