module.exports = isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.admin !== 1) {
    return res.status(403).json({ message: "Not admin" });
  }

  next();
};
