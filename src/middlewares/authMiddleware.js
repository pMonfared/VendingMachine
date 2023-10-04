const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");

// Authentication middleware function
const authMiddleware = async (req, res, next) => {
  // Get the token from the request headers (may be in 'x-access-token' or 'authorization' header)
  let token = req.headers["x-access-token"] || req.header("authorization");

  // Remove 'Bearer' from the token string if present
  token = token?.replace(/^Bearer\s+/, "");

  // If no token is provided, return an unauthorized response
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Find the user by their user ID in the token payload and exclude the password
    const user = await User.findById(decoded.userId).select("-password");

    // If the user does not exist, return an unauthorized response
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Attach the user object to the request for use in subsequent middleware or routes
    req.user = user;
    next(); // Continue to the next middleware or route
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Export the authentication middleware function for use in routes
module.exports = authMiddleware;
