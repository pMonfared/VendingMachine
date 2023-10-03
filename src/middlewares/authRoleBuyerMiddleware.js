module.exports = function (req, res, next) {
  if (!req.user.role == "buyer")
    return res.status(403).json({ message: "Permission denied" });

  next();
};
