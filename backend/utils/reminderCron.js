const cron = require('node-cron')
const User = require('../models/userModel')
const { sendNewQuestionReminder } = require('./emailService')

const FREQUENCY_DAYS = { daily: 1, weekly: 7, monthly: 30 }
const MS_PER_DAY = 24 * 60 * 60 * 1000

const runReminders = async () => {
  if (!process.env.RESEND_API_KEY) return

  const users = await User.find({ emailReminders: true, lastQuestionAssignedAt: { $exists: true } })

  const now = new Date()

  for (const user of users) {
    try {
      const freqDays = FREQUENCY_DAYS[user.questionFrequency] || 1
      const nextQuestionAt = new Date(user.lastQuestionAssignedAt.getTime() + freqDays * MS_PER_DAY)

      // Skip if next question hasn't arrived yet
      if (now < nextQuestionAt) continue

      // Skip if we already sent a reminder since the last question was assigned
      if (user.lastReminderSentAt && user.lastReminderSentAt > user.lastQuestionAssignedAt) continue

      await sendNewQuestionReminder({ name: user.name, email: user.email })

      user.lastReminderSentAt = now
      await user.save()
    } catch (err) {
      console.error(`Reminder failed for ${user.email}:`, err.message)
    }
  }
}

// Run every hour
const startReminderCron = () => {
  cron.schedule('0 * * * *', runReminders)
  console.log('Reminder cron started (runs every hour)')
}

module.exports = { startReminderCron }
