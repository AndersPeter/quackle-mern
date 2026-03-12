const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    questionFrequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        default: 'daily',
    },
    currentQuestionIndex: {
        type: Number,
        default: 0,
    },
    lastQuestionAssignedAt: {
        type: Date,
    },
    currentStreak: {
        type: Number,
        default: 0,
    },
    emailReminders: {
        type: Boolean,
        default: false,
    },
    lastReminderSentAt: {
        type: Date,
    },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);
