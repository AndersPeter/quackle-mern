const mongoose = require('mongoose')

const questionSchema = mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Please add a question'],
    },
    scheduledDate: {
      type: Date,
      required: [true, 'Please add a scheduled date'],
      unique: true,
    },
    theme: {
      type: String,
      default: '',
    },
    author: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Question', questionSchema)
