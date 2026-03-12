const express = require('express')
const router = express.Router()
const {
  getMyQuestion,
  getTodaysQuestion,
  getNextAvailableDate,
  getQuestionByIndex,
  reorderQuestions,
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/questionController')
const { protect, admin } = require('../middleware/authMiddleware')

router.get('/mine', protect, getMyQuestion)
router.get('/byIndex/:index', protect, getQuestionByIndex)
router.get('/today', getTodaysQuestion)
router.get('/next-available-date', protect, admin, getNextAvailableDate)
router.put('/reorder', protect, admin, reorderQuestions)
router.route('/').get(protect, admin, getQuestions).post(protect, admin, createQuestion)
router.route('/:id').put(protect, admin, updateQuestion).delete(protect, admin, deleteQuestion)

module.exports = router
