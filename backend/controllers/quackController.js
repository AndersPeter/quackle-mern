const asyncHandler = require("express-async-handler");
const xss = require("xss");
const User = require("../models/userModel");
const Quack = require("../models/quackModel");
const Question = require("../models/questionModel");
const Comment = require("../models/commentModel");

const sortByResonates = (quacks) =>
  [...quacks].sort((a, b) => b.resonates.length - a.resonates.length);

// Strip name from anonymous quacks (except for the requesting user)
const applyAnonymous = (quacks, requestingUserId) =>
  quacks.map((q) => {
    const obj = q.toObject ? q.toObject() : { ...q }
    if (obj.isAnonymous && obj.user?._id?.toString() !== requestingUserId?.toString()) {
      obj.user = { name: 'Anonymous' }
    }
    return obj
  })

// @desc    Get all quacks submitted by the current user
// @route   GET /api/quacks/mine
// @access  Private
const getMyQuacks = asyncHandler(async (req, res) => {
  const quacks = await Quack.find({ user: req.user._id })
    .populate('question', 'text theme author scheduledDate')
    .sort({ createdAt: -1 })
  res.json(quacks)
})

// @desc    Get all quacks for a question (only if user has submitted their own)
// @route   GET /api/quacks/question/:questionId
// @access  Private
const getQuestionQuacks = asyncHandler(async (req, res) => {
  const myQuack = await Quack.findOne({
    user: req.user._id,
    question: req.params.questionId,
  });

  if (!myQuack) {
    res.json({ myQuack: null, allQuacks: null });
    return;
  }

  const raw = await Quack.find({ question: req.params.questionId }).populate("user", "name");
  const allQuacks = applyAnonymous(sortByResonates(raw), req.user._id);

  res.json({ myQuack, allQuacks });
});

// @desc    Create new quack
// @route   POST /api/quacks
// @access  Private
const createQuack = asyncHandler(async (req, res) => {
  const { quack, questionId, privateNote, isAnonymous } = req.body;

  if (!quack) {
    res.status(400);
    throw new Error("Please write your quack");
  }
  if (!questionId) {
    res.status(400);
    throw new Error("Question ID is required");
  }

  const existing = await Quack.findOne({ user: req.user._id, question: questionId });
  if (existing) {
    res.status(400);
    throw new Error("You have already quacked on this question");
  }

  const created = await Quack.create({
    quack: xss(quack),
    user: req.user._id,
    question: questionId,
    privateNote: privateNote ? xss(privateNote) : '',
    isAnonymous: isAnonymous || false,
  });

  // Update streak
  const user = await User.findById(req.user._id)
  const allQuestions = await Question.find().sort({ scheduledDate: 1 })
  const idx = user.currentQuestionIndex
  if (idx === 0) {
    user.currentStreak = 1
  } else {
    const prevQuestion = allQuestions[idx - 1]
    const prevQuack = prevQuestion
      ? await Quack.findOne({ user: req.user._id, question: prevQuestion._id })
      : null
    user.currentStreak = prevQuack ? (user.currentStreak || 0) + 1 : 1
  }
  await user.save()

  res.status(201).json(created);
});

// @desc    Update quack (only allowed before first resonate)
// @route   PUT /api/quacks/:id
// @access  Private
const updateQuack = asyncHandler(async (req, res) => {
  const quack = await Quack.findById(req.params.id);

  if (!quack) {
    res.status(404);
    throw new Error("Quack not found");
  }
  if (quack.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }
  if (quack.resonates.length > 0) {
    res.status(400);
    throw new Error("Cannot edit a quack after it has received resonates");
  }

  if (req.body.quack !== undefined) quack.quack = xss(req.body.quack)
  if (req.body.privateNote !== undefined) quack.privateNote = xss(req.body.privateNote)

  await quack.save();
  res.json(quack);
});

// @desc    Delete quack
// @route   DELETE /api/quacks/:id
// @access  Private
const deleteQuack = asyncHandler(async (req, res) => {
  const quack = await Quack.findById(req.params.id);

  if (!quack) {
    res.status(404);
    throw new Error("Quack not found");
  }
  if (quack.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  await Comment.deleteMany({ quack: quack._id })
  await quack.deleteOne();
  res.json({ id: req.params.id });
});

// @desc    Toggle resonate on a quack (one per question)
// @route   POST /api/quacks/:id/resonate
// @access  Private
const resonateQuack = asyncHandler(async (req, res) => {
  const quack = await Quack.findById(req.params.id);

  if (!quack) {
    res.status(404);
    throw new Error("Quack not found");
  }
  if (quack.user.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot resonate with your own quack");
  }

  const myQuack = await Quack.findOne({ user: req.user._id, question: quack.question });
  if (!myQuack) {
    res.status(403);
    throw new Error("Submit your own quack before resonating");
  }

  const userId = req.user._id;

  // Remove this user's resonate from every other quack on the same question
  await Quack.updateMany(
    { question: quack.question, _id: { $ne: quack._id } },
    { $pull: { resonates: userId } }
  );

  // Toggle on the target quack
  const idx = quack.resonates.findIndex((id) => id.toString() === userId.toString());
  if (idx > -1) {
    quack.resonates.splice(idx, 1);
  } else {
    quack.resonates.push(userId);
  }

  await quack.save();

  const raw = await Quack.find({ question: quack.question }).populate("user", "name");
  const allQuacks = applyAnonymous(sortByResonates(raw), req.user._id);
  res.json(allQuacks);
});

module.exports = {
  getMyQuacks,
  getQuestionQuacks,
  createQuack,
  updateQuack,
  deleteQuack,
  resonateQuack,
};
