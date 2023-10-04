// Middleware function to check if the user's role is "buyer"
module.exports = function (req, res, next) {
  // Check if the user's role is not equal to "buyer"
  if (!(req.user.role === "buyer")) {
    return res.status(403).json({ message: "Permission denied" });
  }

  // If the user's role is "buyer," continue to the next middleware or route
  next();
};
