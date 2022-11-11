const mongoose = require('mongoose')

const quackSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    quack: {
        type: String,
        required: [true, 'Please write your quack'],
    },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Quacks', quackSchema);