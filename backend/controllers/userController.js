const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// @desc    Register a new user
// @route   /api/users
// @acces   Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please include all fields");
  }
  if (!EMAIL_REGEX.test(email)) {
    res.status(400);
    throw new Error("Please enter a valid email address");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  // Find if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      questionFrequency: user.questionFrequency,
      currentStreak: user.currentStreak,
      emailReminders: user.emailReminders,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});
// @desc    Login a new user
// @route   /api/users/login
// @acces   Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // Check user and password match
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      questionFrequency: user.questionFrequency,
      currentStreak: user.currentStreak,
      emailReminders: user.emailReminders,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
});


// @desc    Get current user
// @route   /api/users/me
// @acces   Private
const getMe = asyncHandler(async (req, res) => {
  const user = {
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
  }
  
  res.status(200).json(user)
})


// @desc    Update question frequency
// @route   PUT /api/users/frequency
// @access  Private
const updateFrequency = asyncHandler(async (req, res) => {
  const { frequency } = req.body
  if (!['daily', 'weekly', 'monthly'].includes(frequency)) {
    res.status(400)
    throw new Error('Invalid frequency')
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { questionFrequency: frequency },
    { new: true }
  ).select('-password')

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    questionFrequency: user.questionFrequency,
    currentStreak: user.currentStreak,
    emailReminders: user.emailReminders,
    token: req.headers.authorization.split(' ')[1],
  })
})

// @desc    Toggle email reminder preference
// @route   PUT /api/users/notifications
// @access  Private
const updateNotifications = asyncHandler(async (req, res) => {
  const { emailReminders } = req.body
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { emailReminders: !!emailReminders },
    { new: true }
  ).select('-password')

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    questionFrequency: user.questionFrequency,
    currentStreak: user.currentStreak,
    emailReminders: user.emailReminders,
    token: req.headers.authorization.split(' ')[1],
  })
})

// Generate token (could move to seperate file)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateFrequency,
  updateNotifications,
};
