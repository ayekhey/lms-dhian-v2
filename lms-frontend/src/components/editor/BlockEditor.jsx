import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Heading from '@tiptap/extension-heading'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import EquationExtension from './EquationExtension'
import VideoExtension from './VideoExtension'
import TextAlign from '@tiptap/extension-text-align'

// ─── Toolbar ───────────────────────────────────────────────────────────────
const Toolbar = ({ editor, allowVideo = false }) => {
  if (!editor) return null

  const btn = (label, action, active) => (
    <button
      type="button"
      onClick={action}
      style={{
        padding: '4px 8px',
        marginRight: 4,
        backgroundColor: active ? '#3b3b5c' : '#eee',
        color: active ? '#fff' : '#333',
        border: 'none',
        borderRadius: 4,
        cursor: 'pointer',
        fontSize: 13
      }}
    >
      {label}
    </button>
  )

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

  const addEquation = () => {
    const latex = prompt('Enter LaTeX equation:')
    if (latex) {
      editor.chain().focus().insertContent({
        type: 'equation',
        attrs: { latex, display: true }
      }).run()
    }
  }

  const addVideo = () => {
    const url = prompt('Enter YouTube or Vimeo URL:')
    if (url) {
      editor.chain().focus().insertContent({
        type: 'video',
        attrs: { src: url }
      }).run()
    }
  }

  const addLink = () => {
    const url = prompt('Enter URL:')
    if (url) {
      editor.chain().focus().setLink({ href: url, target: '_blank' }).run()
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 2,
      padding: '8px',
      backgroundColor: '#f0f0f0',
      borderBottom: '1px solid #ddd'
    }}>
      {btn('B', () => editor.chain().focus().toggleBold().run(), editor.isActive('bold'))}
      {btn('I', () => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'))}
      {btn('U', () => editor.chain().focus().toggleUnderline().run(), editor.isActive('underline'))}
      {btn('H1', () => editor.chain().focus().toggleHeading({ level: 1 }).run(), editor.isActive('heading', { level: 1 }))}
      {btn('H2', () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive('heading', { level: 2 }))}
      {btn('H3', () => editor.chain().focus().toggleHeading({ level: 3 }).run(), editor.isActive('heading', { level: 3 }))}
      {btn('• List', () => editor.chain().focus().toggleBulletList().run(), editor.isActive('bulletList'))}
      {btn('1. List', () => editor.chain().focus().toggleOrderedList().run(), editor.isActive('orderedList'))}
      {btn('Link', addLink, editor.isActive('link'))}
      {btn('Image', addImage, false)}
      {btn('∑ Equation', addEquation, false)}
      {allowVideo && btn('▶ Video', addVideo, false)}
      <span style={{ marginLeft: 8, marginRight: 4, color: '#ccc' }}>|</span>
      {btn('⬅', () => editor.chain().focus().setTextAlign('left').run(), editor.isActive({ textAlign: 'left' }))}
      {btn('↔', () => editor.chain().focus().setTextAlign('center').run(), editor.isActive({ textAlign: 'center' }))}
      {btn('➡', () => editor.chain().focus().setTextAlign('right').run(), editor.isActive({ textAlign: 'right' }))}
      {btn('≡', () => editor.chain().focus().setTextAlign('justify').run(), editor.isActive({ textAlign: 'justify' }))}
      <span style={{ marginLeft: 8, marginRight: 4, color: '#ccc' }}>|</span>
      {btn('→|', () => editor.chain().focus().sinkListItem('listItem').run(), false)}
      {btn('|←', () => editor.chain().focus().liftListItem('listItem').run(), false)}
    </div>
  )
}

// ─── Single TipTap editor instance ─────────────────────────────────────────
const BlockEditorInstance = ({ content, onChange, allowVideo = false }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Heading.configure({ levels: [1, 2, 3] }),
      Link.configure({ openOnClick: false }),
      EquationExtension,
      Image,
      VideoExtension,
      TextAlign.configure({ types: ['heading', 'paragraph'] })
    ],
    content: content || { type: 'doc', content: [] },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON())
    }
  })

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 6, overflow: 'hidden' }}>
      <Toolbar editor={editor} allowVideo={allowVideo} />
      <EditorContent
        editor={editor}
        style={{ padding: 12, minHeight: 120 }}
      />
    </div>
  )
}

// ─── Main Block Block ───────────────────────────────────────────────────────
const MainBlock = ({ block, onChange, onRemove }) => (
  <div style={{ border: '1px solid #ccc', borderRadius: 8, marginBottom: 16 }}>
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '8px 12px', backgroundColor: '#f8f8f8', borderBottom: '1px solid #ccc'
    }}>
      <span style={{ fontWeight: 600, fontSize: 13 }}>Main Content</span>
      <button type="button" onClick={onRemove} style={{
        background: 'none', border: 'none', cursor: 'pointer', color: '#e00', fontSize: 16
      }}>✕</button>
    </div>
    <div style={{ padding: 12 }}>
      <BlockEditorInstance
        content={block.content}
        onChange={(content) => onChange({ ...block, content })}
        allowVideo={true}
      />
    </div>
  </div>
)

// ─── Show/Hide Block ────────────────────────────────────────────────────────
const ShowHideBlock = ({ block, onChange, onRemove }) => (
  <div style={{ border: '1px solid #ccc', borderRadius: 8, marginBottom: 16 }}>
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '8px 12px', backgroundColor: '#fff8e1', borderBottom: '1px solid #ccc'
    }}>
      <span style={{ fontWeight: 600, fontSize: 13 }}>Show/Hide Block</span>
      <button type="button" onClick={onRemove} style={{
        background: 'none', border: 'none', cursor: 'pointer', color: '#e00', fontSize: 16
      }}>✕</button>
    </div>
    <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div>
          <label style={{ fontSize: 13 }}>Label</label><br />
          <input
            value={block.label || ''}
            onChange={e => onChange({ ...block, label: e.target.value })}
            placeholder="e.g. Show hint"
            style={{ padding: '6px 10px', border: '1px solid #ccc', borderRadius: 4, marginTop: 4 }}
          />
        </div>
        <div>
          <label style={{ fontSize: 13 }}>Tier</label><br />
          <select
            value={block.tier || 'all'}
            onChange={e => onChange({ ...block, tier: e.target.value })}
            style={{ padding: '6px 10px', border: '1px solid #ccc', borderRadius: 4, marginTop: 4 }}
          >
            <option value="all">All students</option>
            <option value="extend">Tier 2 + 3 (extend)</option>
            <option value="help">Tier 3 only (help)</option>
          </select>
        </div>
      </div>
      <BlockEditorInstance
        content={block.content}
        onChange={(content) => onChange({ ...block, content })}
        allowVideo={true}
      />
    </div>
  </div>
)

// ─── Quiz Block ─────────────────────────────────────────────────────────────
const QuizBlock = ({ block, onChange, onRemove }) => {
  const updateOption = (index, content) => {
    const options = [...(block.options || [])]
    options[index] = content
    onChange({ ...block, options })
  }

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, marginBottom: 16 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '8px 12px', backgroundColor: '#e8f5e9', borderBottom: '1px solid #ccc'
      }}>
        <span style={{ fontWeight: 600, fontSize: 13 }}>Quiz Block</span>
        <button type="button" onClick={onRemove} style={{
          background: 'none', border: 'none', cursor: 'pointer', color: '#e00', fontSize: 16
        }}>✕</button>
      </div>
      <div style={{ padding: 12 }}>
        <label style={{ fontSize: 13, fontWeight: 600 }}>Question</label>
        <div style={{ marginTop: 6, marginBottom: 16 }}>
          <BlockEditorInstance
            content={block.question}
            onChange={(question) => onChange({ ...block, question })}
          />
        </div>
        {['A', 'B', 'C', 'D', 'E'].map((letter, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
            <input
              type="radio"
              name={`correct-${block.id}`}
              checked={block.correctOption === i}
              onChange={() => onChange({ ...block, correctOption: i })}
              style={{ marginTop: 14 }}
            />
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: '#666' }}>Option {letter}</label>
              <BlockEditorInstance
                content={block.options?.[i]}
                onChange={(content) => updateOption(i, content)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Add Block Button ───────────────────────────────────────────────────────
const AddBlockButton = ({ onAdd }) => {
  const addBlock = (type) => {
    const id = crypto.randomUUID()
    if (type === 'main') {
      onAdd({ id, type: 'main', content: {} })
    } else if (type === 'show_hide') {
      onAdd({ id, type: 'show_hide', label: 'Show more', tier: 'all', content: {} })
    } else if (type === 'quiz') {
      onAdd({
        id, type: 'quiz',
        question: {},
        options: [{}, {}, {}, {}, {}],
        correctOption: 0
      })
    }
  }

  return (
    <div style={{
      display: 'flex', gap: 8, justifyContent: 'center',
      padding: '12px 0', marginBottom: 8
    }}>
      <button type="button" onClick={() => addBlock('main')} style={{
        padding: '6px 14px', backgroundColor: '#3b3b5c', color: '#fff',
        border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13
      }}>+ Main Content</button>
      <button type="button" onClick={() => addBlock('show_hide')} style={{
        padding: '6px 14px', backgroundColor: '#f0a500', color: '#fff',
        border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13
      }}>+ Show/Hide</button>
      <button type="button" onClick={() => addBlock('quiz')} style={{
        padding: '6px 14px', backgroundColor: '#2e7d32', color: '#fff',
        border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13
      }}>+ Quiz</button>
    </div>
  )
}

// ─── Main BlockEditor export ────────────────────────────────────────────────
const BlockEditor = ({ blocks, onChange }) => {
  const updateBlock = (index, updated) => {
    const newBlocks = [...blocks]
    newBlocks[index] = updated
    onChange(newBlocks)
  }

  const removeBlock = (index) => {
    onChange(blocks.filter((_, i) => i !== index))
  }

  const addBlock = (index, block) => {
    const newBlocks = [...blocks]
    newBlocks.splice(index + 1, 0, block)
    onChange(newBlocks)
  }

  return (
    <div>
      <AddBlockButton onAdd={(block) => addBlock(-1, block)} />
      {blocks.map((block, index) => (
        <div key={block.id}>
          {block.type === 'main' && (
            <MainBlock
              block={block}
              onChange={(updated) => updateBlock(index, updated)}
              onRemove={() => removeBlock(index)}
            />
          )}
          {block.type === 'show_hide' && (
            <ShowHideBlock
              block={block}
              onChange={(updated) => updateBlock(index, updated)}
              onRemove={() => removeBlock(index)}
            />
          )}
          {block.type === 'quiz' && (
            <QuizBlock
              block={block}
              onChange={(updated) => updateBlock(index, updated)}
              onRemove={() => removeBlock(index)}
            />
          )}
          <AddBlockButton onAdd={(block) => addBlock(index, block)} />
        </div>
      ))}
    </div>
  )
}

export default BlockEditor