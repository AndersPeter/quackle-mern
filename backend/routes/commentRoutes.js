const express = require('express')
const router = express.Router()
const { getComments, createComment, deleteComment } = require('../controllers/commentController')
const { protect } = require('../middleware/authMiddleware')

router.get('/quack/:quackId', protect, getComments)
router.post('/', protect, createComment)
router.delete('/:id', protect, deleteComment)

module.exports = router
