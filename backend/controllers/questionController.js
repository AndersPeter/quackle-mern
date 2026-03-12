const asyncHandler = require('express-async-handler')
const xss = require('xss')
const Question = require('../models/questionModel')

const FREQUENCY_DAYS = { daily: 1, weekly: 7, monthly: 30 }
const MS_PER_DAY = 24 * 60 * 60 * 1000

// @desc    Get the current question in sequence for the logged-in user
// @route   GET /api/questions/mine
// @access  Private
const getMyQuestion = asyncHandler(async (req, res) => {
  const user = await Question.db.model('User').findById(req.user._id)
  const questions = await Question.find().sort({ scheduledDate: 1 })

  if (questions.length === 0) {
    res.json({ question: null, nextQuestionAt: null, frequencyDays: 1 })
    return
  }

  const now = new Date()
  const freqDays = FREQUENCY_DAYS[user.questionFrequency] || 1

  if (!user.lastQuestionAssignedAt) {
    user.currentQuestionIndex = 0
    user.lastQuestionAssignedAt = now
    await user.save()
  } else {
    const elapsedDays = (now - user.lastQuestionAssignedAt) / (MS_PER_DAY)
    const intervals = Math.floor(elapsedDays / freqDays)
    if (intervals > 0) {
      user.currentQuestionIndex = Math.min(
        user.currentQuestionIndex + intervals,
        questions.length - 1
      )
      user.lastQuestionAssignedAt = new Date(
        user.lastQuestionAssignedAt.getTime() + intervals * freqDays * 24 * 60 * 60 * 1000
      )
      await user.save()
    }
  }

  const idx = Math.min(user.currentQuestionIndex, questions.length - 1)
  const nextQuestionAt = new Date(
    user.lastQuestionAssignedAt.getTime() + freqDays * 24 * 60 * 60 * 1000
  )

  res.json({
    question: questions[idx],
    nextQuestionAt,
    frequencyDays: freqDays,
    questionNumber: idx + 1,
    totalQuestions: questions.length,
  })
})

// @desc    Get today's question (public)
// @route   GET /api/questions/today
// @access  Public
const getTodaysQuestion = asyncHandler(async (req, res) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const question = await Question.findOne({
    scheduledDate: { $gte: today, $lt: tomorrow },
  })

  res.json(question || null)
})

// @desc    Get next available date (first date from today with no question)
// @route   GET /api/questions/next-available-date
// @access  Private/Admin
const getNextAvailableDate = asyncHandler(async (req, res) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Get all scheduled dates from today onwards
  const scheduled = await Question.find(
    { scheduledDate: { $gte: today } },
    { scheduledDate: 1 }
  ).sort({ scheduledDate: 1 })

  const scheduledSet = new Set(
    scheduled.map((q) => q.scheduledDate.toISOString().split('T')[0])
  )

  // Walk forward from today until we find a free date
  let candidate = new Date(today)
  while (true) {
    const key = candidate.toISOString().split('T')[0]
    if (!scheduledSet.has(key)) {
      res.json({ date: key })
      return
    }
    candidate.setDate(candidate.getDate() + 1)
  }
})

// @desc    Get all questions
// @route   GET /api/questions
// @access  Private/Admin
const getQuestions = asyncHandler(async (req, res) => {
  const questions = await Question.find().sort({ scheduledDate: 1 })
  res.json(questions)
})

// @desc    Create a question
// @route   POST /api/questions
// @access  Private/Admin
const createQuestion = asyncHandler(async (req, res) => {
  const { text, scheduledDate, theme, author } = req.body

  if (!text) {
    res.status(400)
    throw new Error('Please add a question')
  }

  let date = scheduledDate

  if (!date) {
    // Find next available date automatically
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const scheduled = await Question.find(
      { scheduledDate: { $gte: today } },
      { scheduledDate: 1 }
    ).sort({ scheduledDate: 1 })

    const scheduledSet = new Set(
      scheduled.map((q) => q.scheduledDate.toISOString().split('T')[0])
    )

    let candidate = new Date(today)
    while (true) {
      const key = candidate.toISOString().split('T')[0]
      if (!scheduledSet.has(key)) {
        date = key
        break
      }
      candidate.setDate(candidate.getDate() + 1)
    }
  }

  const question = await Question.create({
    text: xss(text),
    scheduledDate: new Date(date),
    theme: theme ? xss(theme) : '',
    author: author ? xss(author) : '',
    createdBy: req.user._id,
  })

  res.status(201).json(question)
})

// @desc    Update a question
// @route   PUT /api/questions/:id
// @access  Private/Admin
const updateQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id)

  if (!question) {
    res.status(404)
    throw new Error('Question not found')
  }

  const updated = await Question.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.json(updated)
})

// @desc    Delete a question
// @route   DELETE /api/questions/:id
// @access  Private/Admin
const deleteQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id)

  if (!question) {
    res.status(404)
    throw new Error('Question not found')
  }

  await question.deleteOne()
  res.json({ id: req.params.id })
})

// @desc    Reorder questions by providing ordered array of IDs
// @route   PUT /api/questions/reorder
// @access  Private/Admin
const reorderQuestions = asyncHandler(async (req, res) => {
  const { ids } = req.body
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400)
    throw new Error('ids must be a non-empty array')
  }

  // Reassign scheduledDates sequentially (today, today+1, today+2 …)
  const base = new Date()
  base.setHours(0, 0, 0, 0)

  await Promise.all(
    ids.map((id, i) => {
      const date = new Date(base)
      date.setDate(date.getDate() + i)
      return Question.findByIdAndUpdate(id, { scheduledDate: date })
    })
  )

  const questions = await Question.find().sort({ scheduledDate: 1 })
  res.json(questions)
})

// @desc    Get a question by its sequence index (for browsing history)
// @route   GET /api/questions/byIndex/:index
// @access  Private
const getQuestionByIndex = asyncHandler(async (req, res) => {
  const User = Question.db.model('User')
  const user = await User.findById(req.user._id)
  const idx = parseInt(req.params.index, 10)

  if (isNaN(idx) || idx < 0) {
    res.status(400)
    throw new Error('Invalid index')
  }
  if (idx > user.currentQuestionIndex) {
    res.status(403)
    throw new Error('Cannot view future questions')
  }

  const questions = await Question.find().sort({ scheduledDate: 1 })
  const question = questions[idx] || null
  res.json({ question, questionNumber: idx + 1, totalQuestions: questions.length })
})

module.exports = {
  getMyQuestion,
  getTodaysQuestion,
  getNextAvailableDate,
  getQuestionByIndex,
  reorderQuestions,
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
}
