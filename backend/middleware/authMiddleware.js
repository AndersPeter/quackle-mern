const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')
  ) {
    res.status(401)
    throw new Error('Not authorized')
  }

  const token = req.headers.authorization.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')
    next()
  } catch (error) {
    res.status(401)
    throw new Error('Not authorized')
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(403)
    throw new Error('Not authorized as admin')
  }
}

module.exports = { protect, admin };
