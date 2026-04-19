import { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import EquationExtension from '../components/editor/EquationExtension'
import { ResizableImageExtension } from 'tiptap-extension-resize-image'
import 'tiptap-extension-resize-image/styles.css'
import PageLayout from '../components/PageLayout'
import api from '../api/axios'
import TextAlign from '@tiptap/extension-text-align'

// Extracts plain text from TipTap JSON
const extractText = (json) => {
  if (!json) return ''
  if (typeof json === 'string') return json
  if (json.text) return json.text
  if (json.content) {
    return json.content.map(extractText).join(' ')
  }
  return ''
}

// ─── Mini TipTap editor used inside question form ───────────────────────────
const MiniEditor = ({ onChange, placeholder }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      EquationExtension,
      ResizableImageExtension,
      TextAlign.configure({ types: ['heading', 'paragraph'] })
    ],
    content: '',
    onUpdate: ({ editor }) => onChange(editor.getJSON())
  })

  const btn = (label, action, active) => (
    <button type="button" onClick={action} style={{
      padding: '3px 7px', marginRight: 3,
      backgroundColor: active ? '#3b3b5c' : '#eee',
      color: active ? '#fff' : '#333',
      border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12
    }}>{label}</button>
  )

  const addEquation = () => {
    const latex = prompt('Enter LaTeX:')
    if (latex) editor.chain().focus().insertContent({ type: 'equation', attrs: { latex, display: false } }).run()
  }

  const addImage = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        editor.chain().focus().setResizableImage({ src: ev.target.result }).run()
      }
      reader.readAsDataURL(file)
    }
    input.click()
  }

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 6, overflow: 'hidden' }}>
      <div style={{ padding: 6, backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd', display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {btn('B', () => editor?.chain().focus().toggleBold().run(), editor?.isActive('bold'))}
        {btn('I', () => editor?.chain().focus().toggleItalic().run(), editor?.isActive('italic'))}
        {btn('U', () => editor?.chain().focus().toggleUnderline().run(), editor?.isActive('underline'))}
        {btn('∑', addEquation, false)}
        {btn('Image', addImage, false)}
        <span style={{ marginLeft: 6, marginRight: 2, color: '#ccc' }}>|</span>
        {btn('⬅', () => editor?.chain().focus().setTextAlign('left').run(), editor?.isActive({ textAlign: 'left' }))}
        {btn('↔', () => editor?.chain().focus().setTextAlign('center').run(), editor?.isActive({ textAlign: 'center' }))}
        {btn('➡', () => editor?.chain().focus().setTextAlign('right').run(), editor?.isActive({ textAlign: 'right' }))}
        {btn('≡', () => editor?.chain().focus().setTextAlign('justify').run(), editor?.isActive({ textAlign: 'justify' }))}
      </div>
      <EditorContent editor={editor} style={{ padding: 8, minHeight: 60 }} />
    </div>
  )
}

// ─── Tab 1: Questions ───────────────────────────────────────────────────────
const QuestionsTab = () => {
  const [questions, setQuestions] = useState([])
  const [questionText, setQuestionText] = useState({})
  const [options, setOptions] = useState([{}, {}, {}, {}, {}])
  const [correctOption, setCorrectOption] = useState(0)
  const [saving, setSaving] = useState(false)

  const fetchQuestions = async () => {
    const res = await api.get('/api/diagnostic/manage')
    setQuestions(res.data)
  }

  useEffect(() => { fetchQuestions() }, [])

  const handleOptionChange = (index, content) => {
    const updated = [...options]
    updated[index] = content
    setOptions(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/api/diagnostic/questions', {
        questionText,
        options,
        correctOption
      })
      setQuestionText({})
      setOptions([{}, {}, {}, {}, {}])
      setCorrectOption(0)
      fetchQuestions()
    } catch {
      alert('Failed to save question')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this question?')) return
    await api.delete(`/api/diagnostic/questions/${id}`)
    fetchQuestions()
  }

  return (
    <div>
      {/* Add question form */}
      <div style={{
        backgroundColor: '#fff', padding: 24, borderRadius: 8,
        border: '1px solid #ddd', marginBottom: 32
      }}>
        <h3 style={{ marginBottom: 16, fontSize: 15 }}>Add Question</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600 }}>Question</label>
            <div style={{ marginTop: 6 }}>
              <MiniEditor onChange={setQuestionText} />
            </div>
          </div>

          <label style={{ fontSize: 13, fontWeight: 600 }}>Options (select correct answer)</label>
          {['A', 'B', 'C', 'D', 'E'].map((letter, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 10 }}>
              <input
                type="radio"
                name="correct"
                checked={correctOption === i}
                onChange={() => setCorrectOption(i)}
                style={{ marginTop: 10 }}
              />
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, color: '#666' }}>Option {letter}</label>
                <MiniEditor onChange={(content) => handleOptionChange(i, content)} />
              </div>
            </div>
          ))}

          <button type="submit" disabled={saving} style={{
            marginTop: 20, padding: '8px 20px', backgroundColor: '#3b3b5c',
            color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer'
          }}>
            {saving ? 'Saving...' : 'Add Question'}
          </button>
        </form>
      </div>

      {/* Questions list */}
      <h3 style={{ marginBottom: 12, fontSize: 15 }}>
        All Questions ({questions.length})
      </h3>
      {questions.length === 0 && <p style={{ color: '#aaa' }}>No questions yet.</p>}
      {questions.map((q, index) => (
        <div key={q.id} style={{
          backgroundColor: '#fff', padding: 16, borderRadius: 8,
          border: '1px solid #ddd', marginBottom: 12
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>
                Q{index + 1}
              </div>
              {/* Render question text as plain string */}
              <div style={{ fontSize: 14, marginBottom: 8 }}>
                {extractText(q.questionText)}
              </div>
              <div style={{ fontSize: 12, color: '#666' }}>
                Correct answer: <strong>Option {['A', 'B', 'C', 'D', 'E'][q.correctOption]}</strong>
                {' — '}{extractText(q.options?.[q.correctOption])}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginLeft: 12, flexShrink: 0 }}>
              <button
                onClick={() => window.location.href = `/teacher/diagnostic/${q.id}/edit`}
                style={{
                  padding: '4px 12px', backgroundColor: '#3b3b5c',
                  color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12
                }}
              >
                Edit
              </button>
              <button onClick={() => handleDelete(q.id)} style={{
                padding: '4px 12px', backgroundColor: '#c62828',
                color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12
              }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Reusable settings + results tab ───────────────────────────────────────
const TestSettingsTab = ({ configUrl, resultsUrl, exportUrl, columns }) => {
  const [config, setConfig] = useState({ timerMinutes: '', randomize: false, maxScore: '' })
  const [results, setResults] = useState([])
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const [configRes, resultsRes] = await Promise.all([
        api.get(configUrl),
        api.get(resultsUrl)
      ])
      setConfig({
        timerMinutes: configRes.data.timerMinutes ?? '',
        randomize: configRes.data.randomize ?? false,
        maxScore: configRes.data.maxScore ?? ''
      })
      setResults(resultsRes.data)
    }
    fetch()
  }, [])

  const handleSave = async () => {
    await api.put(configUrl, {
      timerMinutes: config.timerMinutes === '' ? null : Number(config.timerMinutes),
      randomize: config.randomize,
      maxScore: config.maxScore === '' ? null : Number(config.maxScore)
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleExport = async () => {
    try {
      const res = await api.get(exportUrl, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = 'results.csv'
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch {
      alert('Failed to download CSV')
    }
  }

  return (
    <div>
      {/* Config */}
      <div style={{
        backgroundColor: '#fff', padding: 24, borderRadius: 8,
        border: '1px solid #ddd', marginBottom: 32, maxWidth: 400
      }}>
        <h3 style={{ fontSize: 15, marginBottom: 16 }}>Settings</h3>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 13 }}>Timer (minutes, leave empty for no limit)</label><br />
          <input
            type="number"
            value={config.timerMinutes}
            onChange={e => setConfig({ ...config, timerMinutes: e.target.value })}
            style={{ padding: '8px 10px', border: '1px solid #ccc', borderRadius: 4, marginTop: 4, width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 13 }}>Max Score (leave empty to use question count)</label><br />
          <input
            type="number"
            value={config.maxScore}
            onChange={e => setConfig({ ...config, maxScore: e.target.value })}
            style={{ padding: '8px 10px', border: '1px solid #ccc', borderRadius: 4, marginTop: 4, width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            checked={config.randomize}
            onChange={e => setConfig({ ...config, randomize: e.target.checked })}
            id="randomize"
          />
          <label htmlFor="randomize" style={{ fontSize: 13 }}>Randomize questions and answers</label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={handleSave} style={{
            padding: '8px 20px', backgroundColor: '#3b3b5c',
            color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer'
          }}>Save Settings</button>
          {saved && <span style={{ color: 'green', fontWeight: 600 }}>✓ Saved!</span>}
        </div>
      </div>

      {/* Results */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ fontSize: 15 }}>Results ({results.length})</h3>
        <button onClick={handleExport} style={{
          padding: '6px 14px', backgroundColor: '#2e7d32',
          color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13
        }}>
          Download CSV
        </button>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: 8, border: '1px solid #ddd', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
              {columns.map(c => (
                <th key={c} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 13 }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.length === 0 && (
              <tr>
                <td colSpan={columns.length} style={{ padding: 20, textAlign: 'center', color: '#aaa' }}>
                  No results yet
                </td>
              </tr>
            )}
            {results.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px 14px', fontSize: 13 }}>{r.student.name}</td>
                <td style={{ padding: '10px 14px', fontSize: 13 }}>{r.student.email}</td>
                <td style={{ padding: '10px 14px', fontSize: 13 }}>{r.student.tier ?? '—'}</td>
                <td style={{ padding: '10px 14px', fontSize: 13 }}>{r.score}</td>
                {r.total !== undefined && (
                  <td style={{ padding: '10px 14px', fontSize: 13 }}>{r.total}</td>
                )}
                {r.maxScore !== undefined && (
                  <td style={{ padding: '10px 14px', fontSize: 13 }}>{r.maxScore}</td>
                )}
                <td style={{ padding: '10px 14px', fontSize: 13 }}>
                  {new Date(r.submittedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Main page ──────────────────────────────────────────────────────────────
const TeacherDiagnosticPage = () => {
  const [tab, setTab] = useState('questions')

  const tabBtn = (key, label) => (
    <button
      onClick={() => setTab(key)}
      style={{
        padding: '10px 20px',
        backgroundColor: tab === key ? '#3b3b5c' : 'transparent',
        color: tab === key ? '#fff' : '#555',
        border: 'none', borderBottom: tab === key ? 'none' : '2px solid #ddd',
        cursor: 'pointer', fontWeight: tab === key ? 600 : 400, fontSize: 14
      }}
    >
      {label}
    </button>
  )

  return (
    <PageLayout title="Tests">
      <div style={{ marginBottom: 24, borderBottom: '2px solid #ddd', display: 'flex' }}>
        {tabBtn('questions', 'Questions')}
        {tabBtn('pretest', 'Pre Test')}
        {tabBtn('posttest', 'Post Test')}
      </div>

      {tab === 'questions' && <QuestionsTab />}
      {tab === 'pretest' && (
        <TestSettingsTab
          configUrl="/api/diagnostic/config"
          resultsUrl="/api/diagnostic/results"
          exportUrl="/api/diagnostic/results/export"
          columns={['Name', 'Email', 'Tier', 'Score', 'Total', 'Date']}
        />
      )}
      {tab === 'posttest' && (
        <TestSettingsTab
          configUrl="/api/posttest/config"
          resultsUrl="/api/posttest/results"
          exportUrl="/api/posttest/results/export"
          columns={['Name', 'Email', 'Tier', 'Score', 'Max Score', 'Date']}
        />
      )}
    </PageLayout>
  )
}

export default TeacherDiagnosticPage