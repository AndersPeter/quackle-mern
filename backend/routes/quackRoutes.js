const express = require('express')
const router = express.Router()
const {
  getMyQuacks,
  getQuestionQuacks,
  createQuack,
  updateQuack,
  deleteQuack,
  resonateQuack,
} = require('../controllers/quackController')
const { protect } = require('../middleware/authMiddleware')

router.route('/').post(protect, createQuack)
router.get('/mine', protect, getMyQuacks)
router.get('/question/:questionId', protect, getQuestionQuacks)
router.route('/:id').put(protect, updateQuack).delete(protect, deleteQuack)
router.post('/:id/resonate', protect, resonateQuack)

module.exports = router
