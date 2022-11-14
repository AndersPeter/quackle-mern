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

// @desc    Get user quack
// @route   GET /api/quacks/:id (get the ticket id)
// @acces   Private
const getQuack = asyncHandler(async (req, res) => {
    // get user using id in the JWT
    const user = await User.findById(req.user.id);
  
    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }
  
    const quack = await Quacks.findById(req.params.id); // get id from the url

    if(!quack) {
        res.status(404)
        throw new Error('Quack not found')
    }

    if(quack.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Not Authorized')
    }

    res.status(200).json(quack);
  });
  
  
  // @desc    Delete quack
  // @route   DELETE /api/quacks/:id (get the ticket id)
  // @acces   Private
  const deleteQuack = asyncHandler(async (req, res) => {
      // get user using id in the JWT
      const user = await User.findById(req.user.id);
    
      if (!user) {
        res.status(401);
        throw new Error("User not found");
      }
    
      const quack = await Quacks.findById(req.params.id); // get id from the url
  
      if(!quack) {
          res.status(404)
          throw new Error('Quack not found')
      }
  
      if(quack.user.toString() !== req.user.id) {
          res.status(401)
          throw new Error('Not Authorized')
      }
  
      await quack.remove()
  
      res.status(200).json({success: true });
    });
  
 // @desc   Update user quack
// @route   PUT /api/quacks/:id (get the ticket id)
// @acces   Private
const updateQuack = asyncHandler(async (req, res) => {
    // get user using id in the JWT
    const user = await User.findById(req.user.id);
  
    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }
  
    const quack = await Quacks.findById(req.params.id); // get id from the url

    if(!quack) {
        res.status(404)
        throw new Error('Quack not found')
    }

    if(quack.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Not Authorized')
    }

    const updatedQuack = await Quacks.findByIdAndUpdate(req.params.id, req.body, {new: true})



    res.status(200).json(updatedQuack);
  });
  


// @desc    Create new quack
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
  getQuack,
  createQuack,
  deleteQuack,
  updateQuack,
};
