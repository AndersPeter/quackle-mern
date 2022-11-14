const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const Quacks = require("../models/quackModel");

// @desc    Get user quacks
// @route   GET /api/quacks
// @acces   Private
const getQuacks = asyncHandler(async (req, res) => {
  // get user using id in the JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const quacks = await Quacks.find({ user: req.user.id });

  res.status(200).json(quacks);
});

// @desc    Create new quacks
// @route   POST /api/quacks
// @acces   Private
const createQuack = asyncHandler(async (req, res) => {
  const {quack} = req.body;

  if (!quack) {
    res.status(400);
    throw new Error("Please add a quack");
  }

  // get user using id in the JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const quackCreate = await Quacks.create({
      quack,
      user: req.user,})
res.status(201).json(quackCreate);
});

module.exports = {
  getQuacks,
  createQuack,
};
