const asyncHandler = require('express-async-handler')
const xss = require('xss')
const Comment = require('../models/commentModel')
const Quack = require('../models/quackModel')

// @desc    Get comments for a quack
// @route   GET /api/comments/quack/:quackId
// @access  Private
const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ quack: req.params.quackId })
    .populate('user', 'name')
    .sort({ createdAt: 1 })
  res.json(comments)
})

// @desc    Create a comment on a quack
// @route   POST /api/comments
// @access  Private
const createComment = asyncHandler(async (req, res) => {
  const { quackId, text } = req.body

  if (!text?.trim()) {
    res.status(400)
    throw new Error('Please write a comment')
  }
  if (!quackId) {
    res.status(400)
    throw new Error('Quack ID is required')
  }

  const quack = await Quack.findById(quackId)
  if (!quack) {
    res.status(404)
    throw new Error('Quack not found')
  }

  // Must have submitted a quack for this question to comment
  const myQuack = await Quack.findOne({ user: req.user._id, question: quack.question })
  if (!myQuack) {
    res.status(403)
    throw new Error('Submit your own quack before commenting')
  }

  const comment = await Comment.create({ quack: quackId, user: req.user._id, text: xss(text) })
  await comment.populate('user', 'name')
  res.status(201).json(comment)
})

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id)

  if (!comment) {
    res.status(404)
    throw new Error('Comment not found')
  }
  if (comment.user.toString() !== req.user._id.toString()) {
    res.status(401)
    throw new Error('Not authorized')
  }

  await comment.deleteOne()
  res.json({ id: req.params.id })
})

module.exports = { getComments, createComment, deleteComment }
