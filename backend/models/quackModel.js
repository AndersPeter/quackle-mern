const mongoose = require("mongoose");

const quackSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Question",
    },
    quack: {
      type: String,
      required: [true, "Please write your quack"],
      maxlength: 500,
    },
    privateNote: {
      type: String,
      default: "",
      maxlength: 1000,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    resonates: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

// One quack per user per question
quackSchema.index({ user: 1, question: 1 }, { unique: true });

module.exports = mongoose.model("Quacks", quackSchema);
