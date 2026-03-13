import { useEffect, useMemo } from 'react'
import { FaUser } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { updateFrequency, updateNotifications } from '../features/auth/authSlice'
import { getMyQuacks } from '../features/quacks/quackSlice'
import Spinner from '../components/Spinner'

const FREQUENCIES = [
  { value: 'daily', label: 'Every day' },
  { value: 'weekly', label: 'Every week' },
  { value: 'monthly', label: 'Every month' },
]

function Profile() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { myQuacks, isLoading } = useSelector((state) => state.quacks)
  const { questionNumber, totalQuestions } = useSelector((state) => state.questions)

  useEffect(() => {
    dispatch(getMyQuacks())
  }, [dispatch])

  const onFrequencyChange = (e) => {
    dispatch(updateFrequency(e.target.value))
      .unwrap()
      .then(() => toast.success('Frequency updated'))
      .catch((err) => toast.error(err))
  }

  const onNotificationsChange = (e) => {
    dispatch(updateNotifications(e.target.checked))
      .unwrap()
      .catch((err) => toast.error(err))
  }

  // Look back — quacks from ~1 year ago (±2 weeks window)
  const lookBackQuacks = useMemo(() => {
    const now = new Date()
    const oneYearAgo = new Date(now)
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
    const windowMs = 14 * 24 * 60 * 60 * 1000
    return myQuacks.filter((q) => {
      const diff = Math.abs(new Date(q.createdAt) - oneYearAgo)
      return diff < windowMs
    })
  }, [myQuacks])

  const progressPct = questionNumber && totalQuestions
    ? Math.round((questionNumber / totalQuestions) * 100)
    : 0

  return (
    <>
      <section className="heading">
        <h1><FaUser /> Profile</h1>
        {user && <p>{user.name} · {user.email}</p>}
      </section>

      {/* ── Stats ── */}
      {user && (
        <div className="card stats-row">
          <div className="stat">
            <span className="stat__value">{user.currentStreak || 0}</span>
            <span className="stat__label">🔥 streak</span>
          </div>
          <div className="stat">
            <span className="stat__value">{myQuacks.length}</span>
            <span className="stat__label">quacks</span>
          </div>
          <div className="stat">
            <span className="stat__value">{questionNumber || 0}</span>
            <span className="stat__label">of {totalQuestions || '…'} questions</span>
          </div>
        </div>
      )}

      {/* ── Progress bar ── */}
      {questionNumber && totalQuestions && (
        <div className="card">
          <p className="card-title">Journey Progress</p>
          <div className="progress-bar">
            <div className="progress-bar__fill" style={{ width: `${progressPct}%` }} />
          </div>
          <p style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            {questionNumber} of {totalQuestions} questions answered ({progressPct}%)
          </p>
        </div>
      )}

      {/* ── Frequency ── */}
      {user && (
        <div className="card">
          <p className="card-title">Question Frequency</p>
          <p>How often do you want to receive a new question?</p>
          <div className="form-group">
            {FREQUENCIES.map(({ value, label }) => (
              <label key={value} className="radio-label">
                <input
                  type="radio"
                  name="frequency"
                  value={value}
                  checked={user.questionFrequency === value}
                  onChange={onFrequencyChange}
                />
                {' '}{label}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ── Notifications ── */}
      {user && (
        <div className="card">
          <p className="card-title">Reminders</p>
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={user.emailReminders || false}
              onChange={onNotificationsChange}
            />
            <span>Email me when a new question is ready</span>
          </label>
        </div>
      )}

      {/* ── Look back ── */}
      {lookBackQuacks.length > 0 && (
        <div className="card">
          <p className="card-title">🕰 This time last year</p>
          {lookBackQuacks.map((q) => {
            const score = q.resonates?.length || 0
            return (
              <div key={q._id} className="lookback-item">
                {q.question?.theme && (
                  <span className="theme-tag" style={{ marginBottom: '4px', display: 'inline-block' }}>{q.question.theme}</span>
                )}
                <p style={{ fontSize: '.8rem', color: 'var(--text-muted)', margin: '4px 0 6px' }}>
                  {q.question?.text}
                </p>
                <p style={{ fontSize: '.95rem' }}>{q.quack}</p>
                {score > 0 && (
                  <p style={{ fontSize: '.8rem', color: 'var(--accent)', marginTop: '4px' }}>✦ {score} resonates</p>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── My Quacks ── */}
      <div className="card quacks-list">
        <p className="card-title">My Quacks · {myQuacks.length}</p>
        {isLoading ? (
          <Spinner />
        ) : myQuacks.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>
            No quacks yet — answer today's question to get started.
          </p>
        ) : (
          <ul>
            {myQuacks.map((q) => {
              const score = q.resonates?.length || 0
              return (
                <li key={q._id} className="quack-item">
                  <div className="quack-item__body">
                    {q.question?.theme && (
                      <div className="question-item__tags" style={{ marginBottom: '4px' }}>
                        <span className="theme-tag">{q.question.theme}</span>
                        {q.question.author && <span className="author-tag">by {q.question.author}</span>}
                      </div>
                    )}
                    <p style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      {q.question?.text}
                    </p>
                    <p className="quack-item__text">{q.quack}</p>
                    {q.privateNote && (
                      <div className="private-note" style={{ marginTop: '8px' }}>
                        <span className="private-note__label">🔒 Private note</span>
                        <p>{q.privateNote}</p>
                      </div>
                    )}
                  </div>
                  <div className="quack-item__score">
                    <span className={`quack-item__score-value ${score > 0 ? 'quack-item__score-value--positive' : ''}`}>{score}</span>
                    <span className="quack-item__score-label">resonates</span>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {user?.isAdmin && (
        <div className="card">
          <p className="card-title">Admin</p>
          <a href="/admin" className="btn btn-primary btn-block">Go to Admin Panel</a>
        </div>
      )}
    </>
  )
}

export default Profile
