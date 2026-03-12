const express = require('express')
const router = express.Router()
const {registerUser, loginUser, getMe, updateFrequency, updateNotifications} = require('../controllers/userController')

const {protect} = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)
router.put('/frequency', protect, updateFrequency)
router.put('/notifications', protect, updateNotifications)

module.exports = router