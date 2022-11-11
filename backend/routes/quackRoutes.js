const express = require('express')
const router = express.Router()
const {getQuacks, createQuack} = require('../controllers/quackController')

const {protect} = require('../middleware/authMiddleware')

router.route('/').get(protect, getQuacks).post(protect, createQuack)

module.exports = router