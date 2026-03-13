import { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  reorderQuestions,
  reset,
} from '../features/questions/questionSlice'

const SUGGESTED_THEMES = [
  'Identity & Self-knowledge',
  'Purpose & Direction',
  'Relationships & Connection',
  'Courage & Fear',
  'Habits, Time & Energy',
  'Gratitude & Enough',
  'Growth & Change',
  'Work & Contribution',
  'Body, Health & Presence',
  'Money & Security',
  'Meaning & The Big Questions',
  'Decisions & Regret',
  'Community & The World',
  'Playfulness & Joy',
  'Perspective & Wildcard',
]

function Admin() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.auth)
  const { questions, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.questions
  )

  const [text, setText] = useState('')
  const [theme, setTheme] = useState('')
  const [author, setAuthor] = useState('')
  const [filterTheme, setFilterTheme] = useState('All')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [editTheme, setEditTheme] = useState('')
  const [editAuthor, setEditAuthor] = useState('')

  const dragIdx = useRef(null)
  const [dragOverIdx, setDragOverIdx] = useState(null)

  useEffect(() => {
    if (!user || !user.isAdmin) { navigate('/'); return }
    dispatch(getQuestions())
  }, [user, navigate, dispatch])

  useEffect(() => {
    if (isError) toast.error(message)
    if (isSuccess) { setText(''); setTheme(''); setAuthor(''); dispatch(reset()) }
  }, [isError, isSuccess, message, dispatch])

  const onSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return toast.error('Please enter a question')
    dispatch(createQuestion({ text, theme, author }))
  }

  const onEditSave = (id) => {
    if (!editText.trim()) return toast.error('Question cannot be empty')
    dispatch(updateQuestion({ id, questionData: { text: editText, theme: editTheme, author: editAuthor } }))
      .unwrap()
      .then(() => setEditingId(null))
      .catch((err) => toast.error(err))
  }

  const onDelete = (id) => {
    if (window.confirm('Delete this question?')) dispatch(deleteQuestion(id))
  }

  // ── Drag handlers ──
  const onDragStart = (e, idx) => {
    dragIdx.current = idx
    e.dataTransfer.effectAllowed = 'move'
  }
  const onDragOver = (e, idx) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIdx(idx)
  }
  const onDrop = (e, idx) => {
    e.preventDefault()
    const from = dragIdx.current
    if (from === null || from === idx) { setDragOverIdx(null); return }
    const reordered = [...questions]
    const [moved] = reordered.splice(from, 1)
    reordered.splice(idx, 0, moved)
    dispatch(reorderQuestions(reordered.map((q) => q._id)))
    dragIdx.current = null
    setDragOverIdx(null)
  }
  const onDragEnd = () => { dragIdx.current = null; setDragOverIdx(null) }

  // Derive unique themes from all questions
  const allThemes = ['All', ...Array.from(new Set(questions.map((q) => q.theme).filter(Boolean)))]

  const visible = filterTheme === 'All'
    ? questions
    : questions.filter((q) => q.theme === filterTheme)

  if (!user || !user.isAdmin) return null

  return (
    <>
      <section className="heading">
        <h1>Quackel Admin</h1>
        <p>Manage the question sequence</p>
      </section>

      {/* ── Add question ── */}
      <div className="card">
        <p className="card-title">Add a Question</p>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="theme">Theme</label>
            <input
              id="theme"
              list="theme-suggestions"
              placeholder="e.g. Identity & Self-knowledge"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            />
            <datalist id="theme-suggestions">
              {SUGGESTED_THEMES.map((t) => <option key={t} value={t} />)}
            </datalist>
          </div>
          <div className="form-group">
            <label htmlFor="author">Author</label>
            <input
              id="author"
              placeholder="e.g. Claude (Anthropic)"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="text">Question</label>
            <textarea
              id="text"
              placeholder="Write your question here…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
            />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={isLoading}>
            {isLoading ? 'Adding…' : 'Add to end of sequence'}
          </button>
        </form>
      </div>

      {/* ── Question list ── */}
      <div className="card questions-list">
        <div className="questions-list__header">
          <p className="card-title" style={{ marginBottom: 0 }}>
            Question Sequence — {questions.length} total
          </p>
          <select
            className="theme-filter"
            value={filterTheme}
            onChange={(e) => setFilterTheme(e.target.value)}
          >
            {allThemes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <p className="drag-hint">Drag to reorder · controls when each question appears for users</p>

        {visible.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '.9rem', marginTop: '12px' }}>No questions yet.</p>
        ) : (
          <ul style={{ marginTop: '12px' }}>
            {visible.map((q, idx) => {
              const globalIdx = questions.findIndex((gq) => gq._id === q._id)
              return (
                <li
                  key={q._id}
                  className={`question-item ${dragOverIdx === idx ? 'question-item--drag-over' : ''}`}
                  draggable
                  onDragStart={(e) => onDragStart(e, globalIdx)}
                  onDragOver={(e) => onDragOver(e, idx)}
                  onDrop={(e) => onDrop(e, globalIdx)}
                  onDragEnd={onDragEnd}
                >
                  <div className="question-item__drag" title="Drag to reorder">⠿</div>
                  <div className="question-item__seq">#{globalIdx + 1}</div>

                  <div className="question-item__body">
                    {editingId === q._id ? (
                      <>
                        <input
                          placeholder="Author"
                          value={editAuthor}
                          onChange={(e) => setEditAuthor(e.target.value)}
                          style={{ marginBottom: '8px' }}
                        />
                        <input
                          list="theme-suggestions-edit"
                          placeholder="Theme"
                          value={editTheme}
                          onChange={(e) => setEditTheme(e.target.value)}
                          style={{ marginBottom: '8px' }}
                        />
                        <datalist id="theme-suggestions-edit">
                          {SUGGESTED_THEMES.map((t) => <option key={t} value={t} />)}
                        </datalist>
                        <textarea
                          rows={2}
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                        />
                        <div className="btn-row" style={{ marginTop: '8px' }}>
                          <button className="btn btn-primary btn-sm" onClick={() => onEditSave(q._id)}>Save</button>
                          <button className="btn btn-reverse btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="question-item__tags">
                          <span className={`theme-tag ${!q.theme ? 'theme-tag--empty' : ''}`}>
                            {q.theme || 'Uncategorised'}
                          </span>
                          {q.author && <span className="author-tag">by {q.author}</span>}
                        </div>
                        <p className="question-item__text">{q.text}</p>
                      </>
                    )}
                  </div>

                  {editingId !== q._id && (
                    <div className="question-item__actions">
                      <button className="btn btn-sm btn-reverse" onClick={() => { setEditingId(q._id); setEditText(q.text); setEditTheme(q.theme || ''); setEditAuthor(q.author || '') }}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => onDelete(q._id)}>Delete</button>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )
}

export default Admin
