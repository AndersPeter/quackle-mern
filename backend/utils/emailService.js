const { Resend } = require('resend')

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'
const FROM = process.env.RESEND_FROM || 'Quackel <onboarding@resend.dev>'

const sendNewQuestionReminder = async ({ name, email }) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — skipping email reminder')
    return
  }
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: FROM,
    to: email,
    subject: '🦆 Your new question is ready on Quackel',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #1a1a2e;">
        <h1 style="font-size: 1.4rem; font-weight: 800; color: #f5a623; margin: 0 0 4px;">
          🦆 Quackel
        </h1>
        <p style="font-size: .7rem; text-transform: uppercase; letter-spacing: .06em; color: #999; margin: 0 0 32px;">
          one question. one answer. every day.
        </p>

        <p style="font-size: 1rem; margin: 0 0 12px;">Hi ${name},</p>
        <p style="font-size: 1rem; line-height: 1.6; margin: 0 0 28px;">
          Your next question is waiting for you. Take a moment to reflect and share your answer with the community.
        </p>

        <a href="${FRONTEND_URL}"
           style="display: inline-block; background: #f5a623; color: #13111e; text-decoration: none;
                  font-weight: 700; padding: 12px 28px; border-radius: 8px; font-size: .95rem;">
          See your question →
        </a>

        <p style="font-size: .78rem; color: #999; margin-top: 40px; border-top: 1px solid #eee; padding-top: 16px;">
          You're receiving this because you enabled email reminders on Quackel.
          You can turn them off anytime in your <a href="${FRONTEND_URL}/profile" style="color: #f5a623;">profile settings</a>.
        </p>
      </div>
    `,
  })

  if (error) throw new Error(`Resend error: ${error.message}`)
}

module.exports = { sendNewQuestionReminder }
