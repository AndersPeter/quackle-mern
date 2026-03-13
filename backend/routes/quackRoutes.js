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
const validateObjectId = require('../middleware/validateObjectId')

router.route('/').post(protect, createQuack)
router.get('/mine', protect, getMyQuacks)
router.get('/question/:questionId', protect, getQuestionQuacks)
router.route('/:id').put(protect, validateObjectId, updateQuack).delete(protect, validateObjectId, deleteQuack)
router.post('/:id/resonate', protect, validateObjectId, resonateQuack)

module.exports = router
