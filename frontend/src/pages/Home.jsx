import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { getMyQuestion, getQuestionByIndex } from '../features/questions/questionSlice'
import { updateFrequency } from '../features/auth/authSlice'
import {
  getQuestionQuacks,
  createQuack,
  updateQuack,
  deleteQuack,
  resonateQuack,
  reset,
} from '../features/quacks/quackSlice'
import {
  getComments,
  createComment,
  deleteComment,
} from '../features/comments/commentSlice'
import Spinner from '../components/Spinner'

function Home() {
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { myQuestion, nextQuestionAt, questionNumber, totalQuestions } = useSelector(
    (state) => state.questions
  )
  const { myQuack, allQuacks, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.quacks
  )
  const { commentsByQuack } = useSelector((state) => state.comments)

  const [quackText, setQuackText] = useState('')
  const [privateNote, setPrivateNote] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [editText, setEditText] = useState('')
  const [editPrivateNote, setEditPrivateNote] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [themeFilter, setThemeFilter] = useState('All')
  const [expandedComments, setExpandedComments] = useState({})
  const [commentTexts, setCommentTexts] = useState({})
  const [viewIndex, setViewIndex] = useState(null)

  // Fetch user's current question on mount
  useEffect(() => {
    if (user) dispatch(getMyQuestion())
  }, [user, dispatch])

  // Set initial viewIndex once we know currentQuestionIndex
  useEffect(() => {
    if (user && myQuestion && viewIndex === null) {
      setViewIndex(questionNumber - 1)
    }
  }, [user, myQuestion, questionNumber, viewIndex])

  // Fetch quacks when question changes
  useEffect(() => {
    if (user && myQuestion) dispatch(getQuestionQuacks(myQuestion._id))
  }, [user, myQuestion, dispatch])

  // Handle errors and success
  useEffect(() => {
    if (isError) toast.error(message)
    if (isSuccess) {
      setQuackText('')
      setPrivateNote('')
      setIsAnonymous(false)
      if (myQuestion) dispatch(getQuestionQuacks(myQuestion._id))
      dispatch(reset())
    }
  }, [isError, isSuccess, message, dispatch, myQuestion])

  const onSubmit = (e) => {
    e.preventDefault()
    if (!quackText.trim()) return
    dispatch(createQuack({ quack: quackText, questionId: myQuestion._id, privateNote, isAnonymous }))
  }

  const onEditSubmit = (e) => {
    e.preventDefault()
    if (!editText.trim()) return
    dispatch(updateQuack({ id: myQuack._id, quack: editText, privateNote: editPrivateNote }))
      .unwrap()
      .then(() => setIsEditing(false))
      .catch((err) => toast.error(err))
  }

  const onDelete = () => {
    if (window.confirm('Delete your quack? You can submit a new one afterwards.')) {
      dispatch(deleteQuack(myQuack._id))
    }
  }

  const onResonate = (id) => {
    dispatch(resonateQuack(id)).unwrap().catch((err) => toast.error(err))
  }

  // Browse prev/next
  const onBrowse = (dir) => {
    const maxIdx = questionNumber - 1
    const newIdx = viewIndex + dir
    if (newIdx < 0 || newIdx > maxIdx) return
    setViewIndex(newIdx)
    dispatch(getQuestionByIndex(newIdx))
    dispatch(reset()) // clear quacks for old question
  }

  // Comments
  const toggleComments = (quackId) => {
    const nowOpen = !expandedComments[quackId]
    if (nowOpen && !commentsByQuack[quackId]) dispatch(getComments(quackId))
    setExpandedComments((prev) => ({ ...prev, [quackId]: nowOpen }))
  }

  const onCommentSubmit = (e, quackId) => {
    e.preventDefault()
    const text = commentTexts[quackId]?.trim()
    if (!text) return
    dispatch(createComment({ quackId, text }))
      .unwrap()
      .then(() => setCommentTexts((prev) => ({ ...prev, [quackId]: '' })))
      .catch((err) => toast.error(err))
  }

  const onDeleteComment = (id, quackId) => {
    dispatch(deleteComment({ id, quackId }))
  }

  const hasResonates = myQuack && myQuack.resonates?.length > 0

  const formatTimeUntil = (dateStr) => {
    if (!dateStr) return ''
    const diff = new Date(dateStr) - new Date()
    if (diff <= 0) return 'now'
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    if (days > 0) return `${days}d ${hours}h`
    return `${hours}h`
  }

  // Theme filter options derived from community quacks
  const themes = allQuacks
    ? ['All', ...Array.from(new Set(allQuacks.map((q) => q.question?.theme).filter(Boolean)))]
    : ['All']

  const visibleQuacks = allQuacks
    ? themeFilter === 'All'
      ? allQuacks
      : allQuacks.filter((q) => q.question?.theme === themeFilter)
    : null

  const isBrowsingPast = viewIndex !== null && questionNumber !== null && viewIndex < questionNumber - 1

  if (isLoading) return <Spinner />

  return (
    <>
      {/* ── Question card ── */}
      <div className="question-card">
        <div className="question-card__top">
          <div className="question-badge-group">
            <div className="question-badge">
              🦆 {
                !user ? 'Question of the day'
                : user.questionFrequency === 'weekly' ? 'Question of the week'
                : user.questionFrequency === 'monthly' ? 'Question of the month'
                : 'Question of the day'
              }
            </div>
            {user && questionNumber && (
              <div className="question-counter">
                {isBrowsingPast ? `#${viewIndex + 1}` : questionNumber}/{totalQuestions}
                {!isBrowsingPast && nextQuestionAt && (
                  <span className="next-question"> · next in {formatTimeUntil(nextQuestionAt)}</span>
                )}
              </div>
            )}
          </div>
          {user && (
            <div className="freq-group">
              <span className="freq-label">Frequency</span>
              <div className="freq-btns">
                {[
                  { value: 'daily', label: 'Day' },
                  { value: 'weekly', label: 'Week' },
                  { value: 'monthly', label: 'Month' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    className={`freq-btn ${user.questionFrequency === value ? 'freq-btn--active' : ''}`}
                    onClick={() => dispatch(updateFrequency(value))}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {user && myQuestion && (
          <div className="question-meta-row">
            <p className="question-theme">{myQuestion.theme || 'Uncategorised'}</p>
            {myQuestion.author && <p className="question-author">by {myQuestion.author}</p>}
          </div>
        )}

        <p className="question-text">
          {!user
            ? 'Log in to see your personalised question'
            : myQuestion === null
            ? 'Oops, sorry! We forgot what we wanted to ask you about!'
            : myQuestion
            ? myQuestion.text
            : '…'}
        </p>

        {!user && (
          <div className="btn-row" style={{ marginTop: 0 }}>
            <Link to="/login" className="btn btn-primary btn-sm">Log in</Link>
            <Link to="/register" className="btn btn-sm" style={{ background: 'rgba(255,255,255,.12)', color: '#fff' }}>Sign up</Link>
          </div>
        )}

        {/* Browse prev/next */}
        {user && questionNumber > 1 && (
          <div className="browse-nav">
            <button
              className="btn-browse"
              onClick={() => onBrowse(-1)}
              disabled={viewIndex === 0}
            >
              ← Previous
            </button>
            {isBrowsingPast && (
              <button className="btn-browse btn-browse--current" onClick={() => {
                setViewIndex(questionNumber - 1)
                dispatch(getMyQuestion())
              }}>
                Back to current
              </button>
            )}
            <button
              className="btn-browse"
              onClick={() => onBrowse(1)}
              disabled={!isBrowsingPast}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {user && myQuestion && (
        <>
          {/* ── Your Quack ── */}
          <div className="card">
            <p className="card-title">
              Your quack
              {isBrowsingPast && <span className="past-badge">past question</span>}
            </p>

            {!myQuack ? (
              <>
                <p className="quack-gate-hint">Submit your quack to unlock everyone else's answers</p>
                <form onSubmit={onSubmit}>
                  <div className="form-group">
                    <textarea
                      rows="4"
                      name="quack"
                      value={quackText}
                      onChange={(e) => setQuackText(e.target.value)}
                      placeholder="Write your quack here…"
                      maxLength={500}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="privateNote" style={{ fontSize: '.85rem', color: 'var(--text-muted)' }}>
                      🔒 Private note (only you see this)
                    </label>
                    <textarea
                      id="privateNote"
                      rows="2"
                      value={privateNote}
                      onChange={(e) => setPrivateNote(e.target.value)}
                      placeholder="Anything you want to remember but not share…"
                      maxLength={1000}
                    />
                  </div>
                  <div className="form-group anon-toggle">
                    <label className="toggle-label">
                      <span>Post anonymously</span>
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                      />
                    </label>
                  </div>
                  <button className="btn btn-primary btn-block" type="submit">
                    Quack it!
                  </button>
                </form>
              </>
            ) : isEditing ? (
              <form onSubmit={onEditSubmit}>
                <div className="form-group">
                  <textarea
                    rows="4"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    maxLength={500}
                    required
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '.85rem', color: 'var(--text-muted)' }}>
                    🔒 Private note
                  </label>
                  <textarea
                    rows="2"
                    value={editPrivateNote}
                    onChange={(e) => setEditPrivateNote(e.target.value)}
                    maxLength={1000}
                  />
                </div>
                <div className="btn-row">
                  <button className="btn btn-primary" type="submit">Save</button>
                  <button className="btn btn-reverse" type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <p className="my-quack__text">{myQuack.quack}</p>
                {myQuack.privateNote && (
                  <div className="private-note">
                    <span className="private-note__label">🔒 Private note</span>
                    <p>{myQuack.privateNote}</p>
                  </div>
                )}
                {myQuack.isAnonymous && (
                  <p style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Posted anonymously</p>
                )}
                <div className="btn-row" style={{ marginTop: '12px' }}>
                  {!hasResonates ? (
                    <>
                      <button className="btn btn-sm" onClick={() => { setEditText(myQuack.quack); setEditPrivateNote(myQuack.privateNote || ''); setIsEditing(true) }}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={onDelete}>Delete</button>
                      <small className="lock-hint">Editing locks once someone resonates</small>
                    </>
                  ) : (
                    <>
                      <span className="lock-badge">🔒 Locked — received resonates</span>
                      <button className="btn btn-danger btn-sm" onClick={onDelete}>Delete &amp; resubmit</button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {/* ── Community Quacks ── */}
          <div className="card quacks-list">
            {allQuacks === null ? (
              <>
                <p className="card-title">Community quacks</p>
                <p className="quack-gate-hint">Submit your quack above to reveal everyone's answers</p>
              </>
            ) : (
              <>
                <div className="quacks-list__header">
                  <p className="card-title" style={{ marginBottom: 0 }}>
                    Community quacks · {allQuacks.length}
                  </p>
                  {themes.length > 2 && (
                    <select
                      className="theme-filter"
                      value={themeFilter}
                      onChange={(e) => setThemeFilter(e.target.value)}
                    >
                      {themes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  )}
                </div>
                <p className="resonate-hint">One resonance per question — choose the answer that lands most with you. You can always come back and change your mind.</p>

                {visibleQuacks.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '.9rem', marginTop: '12px' }}>No other quacks yet — you're first! 🎉</p>
                ) : (
                  <ul>
                    {visibleQuacks.map((q) => {
                      const isOwn = myQuack && q._id === myQuack._id
                      const userResonated = q.resonates?.includes(user._id)
                      const commentsOpen = expandedComments[q._id]
                      const comments = commentsByQuack[q._id] || []
                      return (
                        <li key={q._id} className={`quack-item ${isOwn ? 'quack-item--own' : ''}`}>
                          <div className="quack-item__body">
                            <p className="quack-item__author">
                              {q.user?.name || 'Quacker'}
                              {isOwn && <span className="own-badge">you</span>}
                              {q.isAnonymous && !isOwn && <span className="anon-badge">anonymous</span>}
                            </p>
                            <p className="quack-item__text">{q.quack}</p>
                            <div className="quack-item__actions">
                              {!isOwn && (
                                <button
                                  className={`resonate-btn ${userResonated ? 'resonate-btn--active' : ''}`}
                                  onClick={() => onResonate(q._id)}
                                >
                                  {userResonated ? '✦ This resonated with me' : '✦ This resonated with me'}
                                </button>
                              )}
                              <button
                                className="comments-btn"
                                onClick={() => toggleComments(q._id)}
                              >
                                💬 {comments.length > 0 ? comments.length : ''} {commentsOpen ? 'Hide' : 'Comments'}
                              </button>
                            </div>

                            {commentsOpen && (
                              <div className="comments-section">
                                {comments.map((c) => (
                                  <div key={c._id} className="comment">
                                    <span className="comment__author">{c.user?.name}</span>
                                    <span className="comment__text">{c.text}</span>
                                    {c.user?._id === user._id && (
                                      <button className="comment__delete" onClick={() => onDeleteComment(c._id, q._id)}>✕</button>
                                    )}
                                  </div>
                                ))}
                                <form className="comment-form" onSubmit={(e) => onCommentSubmit(e, q._id)}>
                                  <input
                                    type="text"
                                    placeholder="Add a comment…"
                                    maxLength={200}
                                    value={commentTexts[q._id] || ''}
                                    onChange={(e) => setCommentTexts((prev) => ({ ...prev, [q._id]: e.target.value }))}
                                  />
                                  <button type="submit" className="btn btn-sm btn-primary">Post</button>
                                </form>
                              </div>
                            )}
                          </div>

                          <div className="quack-item__score">
                            <span className={`quack-item__score-value ${q.resonates?.length > 0 ? 'quack-item__score-value--positive' : ''}`}>
                              {q.resonates?.length || 0}
                            </span>
                            <span className="quack-item__score-label">resonates</span>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </>
            )}
          </div>
        </>
      )}
    </>
  )
}

export default Home
