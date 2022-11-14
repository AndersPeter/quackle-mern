const express = require('express')
const router = express.Router()
const {getQuacks, getQuack, createQuack, deleteQuack, updateQuack} = require('../controllers/quackController')

const {protect} = require('../middleware/authMiddleware')

router.route('/').get(protect, getQuacks).post(protect, createQuack)

router.route('/:id').get(protect, getQuack).delete(protect, deleteQuack).put(protect, updateQuack)  // seperate from above because getting id

module.exports = router