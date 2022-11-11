const asyncHandler = require('express-async-handler')

const User = require('../models/userModel')
const Quacks = require('../models/quackModel')


// @desc    Get user quacks
// @route   GET /api/quacks
// @acces   Private
const getQuacks = asyncHandler(async (req, res) => {
    res.status(200).json({message: 'getQuacks'})
  })
  
// @desc    Create new quacks
// @route   POST /api/quacks
// @acces   Private
const createQuack = asyncHandler(async (req, res) => {
    res.status(200).json({message: 'createQuack'})
  })
  
  module.exports = {
      getQuacks,
      createQuack,
  }