const jwt = require("jsonwebtoken");
exports.verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized", isAuthenticated: false });
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next(); 
  } catch (error) {
    res
      .status(403)
      .json({ message: "Invalid or expired token", isAuthenticated: false });
  }
};







































































































