const jwt = require("jsonwebtoken");
const { error } = require("../utils/apiResponse");

const protect = (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return error(res, "Not authorized. No token provided", 401);
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secretkey"
    );

    req.user = decoded;

    next();

  } catch (err) {
    return error(res, "Invalid or expired token", 401);
  }
};


const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return error(res, "Admin access required", 403);
  }

  next();
};


module.exports = {
  protect,
  adminOnly,
};