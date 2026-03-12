const mongoose = require('mongoose')

const commentSchema = mongoose.Schema(
  {
    quack: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Quacks',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    text: {
      type: String,
      required: [true, 'Please write a comment'],
      maxlength: 200,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Comment', commentSchema)
