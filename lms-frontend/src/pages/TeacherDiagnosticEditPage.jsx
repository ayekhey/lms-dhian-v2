import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import EquationExtension from '../components/editor/EquationExtension'
import PageLayout from '../components/PageLayout'
import api from '../api/axios'

// ─── Mini editor with load support ─────────────────────────────────────────
const MiniEditor = ({ initialContent, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      EquationExtension,
      TextAlign.configure({ types: ['heading', 'paragraph'] })
    ],
    content: initialContent || { type: 'doc', content: [{ type: 'paragraph' }] },
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
        editor.chain().focus().setImage({ src: ev.target.result }).run()
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
      <EditorContent editor={editor} style={{ padding: 8, minHeight: 80 }} />
    </div>
  )
}

// ─── Main page ──────────────────────────────────────────────────────────────
const TeacherDiagnosticEditPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [question, setQuestion] = useState(null)
  const [questionText, setQuestionText] = useState({})
  const [options, setOptions] = useState([{}, {}, {}, {}, {}])
  const [correctOption, setCorrectOption] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get('/api/diagnostic/manage')
      const q = res.data.find(q => q.id === id)
      if (q) {
        setQuestion(q)
        setQuestionText(q.questionText)
        setOptions(q.options)
        setCorrectOption(q.correctOption)
      }
      setLoaded(true)
    }
    fetch()
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put(`/api/diagnostic/questions/${id}`, {
        questionText,
        options,
        correctOption
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      alert('Failed to save question')
    } finally {
      setSaving(false)
    }
  }

  const updateOption = (index, content) => {
    const updated = [...options]
    updated[index] = content
    setOptions(updated)
  }

  if (!loaded) return <PageLayout title="Edit Question"><p>Loading...</p></PageLayout>
  if (!question) return <PageLayout title="Edit Question"><p>Question not found.</p></PageLayout>

  return (
    <PageLayout title="Edit Question">
      <div style={{
        backgroundColor: '#fff', padding: 24, borderRadius: 8,
        border: '1px solid #ddd', maxWidth: 800
      }}>

        {/* Question */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontWeight: 600, fontSize: 14, display: 'block', marginBottom: 8 }}>
            Question
          </label>
          <MiniEditor
            key={`q-${id}`}
            initialContent={question.questionText}
            onChange={setQuestionText}
          />
        </div>

        {/* Options */}
        <label style={{ fontWeight: 600, fontSize: 14, display: 'block', marginBottom: 12 }}>
          Options (select correct answer)
        </label>
        {['A', 'B', 'C', 'D', 'E'].map((letter, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16 }}>
            <input
              type="radio"
              name="correct"
              checked={correctOption === i}
              onChange={() => setCorrectOption(i)}
              style={{ marginTop: 12 }}
            />
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>
                Option {letter} {correctOption === i && <span style={{ color: '#2e7d32', fontWeight: 600 }}>✓ Correct</span>}
              </label>
              <MiniEditor
                key={`opt-${id}-${i}`}
                initialContent={question.options[i]}
                onChange={(content) => updateOption(i, content)}
              />
            </div>
          </div>
        ))}

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '10px 28px', backgroundColor: '#3b3b5c',
              color: '#fff', border: 'none', borderRadius: 6,
              cursor: saving ? 'default' : 'pointer', fontSize: 15
            }}
          >
            {saving ? 'Saving...' : 'Save Question'}
          </button>
          {saved && <span style={{ color: 'green', fontWeight: 600 }}>✓ Saved!</span>}
          <button
            onClick={() => navigate('/teacher/diagnostic')}
            style={{
              padding: '10px 16px', backgroundColor: 'transparent',
              border: '1px solid #ccc', borderRadius: 6, cursor: 'pointer', fontSize: 13
            }}
          >
            ← Back
          </button>
        </div>
      </div>
    </PageLayout>
  )
}

export default TeacherDiagnosticEditPage