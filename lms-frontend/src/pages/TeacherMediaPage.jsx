import { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Heading from '@tiptap/extension-heading'
import Link from '@tiptap/extension-link'
// import Image from '@tiptap/extension-image'
import EquationExtension from '../components/editor/EquationExtension'
import VideoExtension from '../components/editor/VideoExtension'
import TextAlign from '@tiptap/extension-text-align'
import PageLayout from '../components/PageLayout'
import api from '../api/axios'
import ImageUploadModal from '../components/editor/ImageUploadModal'
import CustomImageExtension from '../components/editor/CustomImageExtension'

const TeacherMediaPage = () => {
  const [showImageModal, setShowImageModal] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Heading.configure({ levels: [1, 2, 3] }),
      Link.configure({ openOnClick: false }),
      CustomImageExtension,
      EquationExtension,
      VideoExtension,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: ''
  })

  useEffect(() => {
    const fetchMedia = async () => {
      const res = await api.get('/api/media')
      if (res.data.content && editor) {
        editor.commands.setContent(res.data.content)
      }
      setLoaded(true)
    }
    if (editor) fetchMedia()
  }, [editor])

  const handleSave = async () => {
    if (!editor) return
    await api.put('/api/media', { content: editor.getJSON() })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const btn = (label, action, active) => (
    <button
      type="button"
      onClick={action}
      style={{
        padding: '4px 8px', marginRight: 4,
        backgroundColor: active ? '#3b3b5c' : '#eee',
        color: active ? '#fff' : '#333',
        border: 'none', borderRadius: 4,
        cursor: 'pointer', fontSize: 13
      }}
    >
      {label}
    </button>
  )

  // const addImage = () => {
  //   const input = document.createElement('input')
  //   input.type = 'file'
  //   input.accept = 'image/*'
  //   input.onchange = (e) => {
  //     const file = e.target.files[0]
  //     if (!file) return
  //     const reader = new FileReader()
  //     reader.onload = (ev) => {
  //       editor.chain().focus().setImage({ src: ev.target.result }).run()
  //     }
  //     reader.readAsDataURL(file)
  //   }
  //   input.click()
  // }

  const handleImageInsert = ({ src, width, align }) => {
    editor.chain().focus().insertContent({
      type: 'customImage',
      attrs: { src, width, align }
    }).run()
    setShowImageModal(false)
  }

  const addEquation = () => {
    const latex = prompt('Enter LaTeX equation:')
    if (!latex) return
    const mode = confirm('Display as block? (OK = block, Cancel = inline)')
    editor.chain().focus().insertContent({
      type: 'equation',
      attrs: { latex, display: mode }
    }).run()
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
    <PageLayout title="Media Page">
      <div style={{
        backgroundColor: '#fff', borderRadius: 8,
        border: '1px solid #ddd', overflow: 'hidden', maxWidth: 800
      }}>

        {/* Toolbar */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 2,
          padding: 8, backgroundColor: '#f0f0f0',
          borderBottom: '1px solid #ddd'
        }}>
          {btn('B', () => editor?.chain().focus().toggleBold().run(), editor?.isActive('bold'))}
          {btn('I', () => editor?.chain().focus().toggleItalic().run(), editor?.isActive('italic'))}
          {btn('U', () => editor?.chain().focus().toggleUnderline().run(), editor?.isActive('underline'))}
          {btn('H1', () => editor?.chain().focus().toggleHeading({ level: 1 }).run(), editor?.isActive('heading', { level: 1 }))}
          {btn('H2', () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), editor?.isActive('heading', { level: 2 }))}
          {btn('H3', () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), editor?.isActive('heading', { level: 3 }))}
          {btn('• List', () => editor?.chain().focus().toggleBulletList().run(), editor?.isActive('bulletList'))}
          {btn('1. List', () => editor?.chain().focus().toggleOrderedList().run(), editor?.isActive('orderedList'))}
          {btn('Link', addLink, editor?.isActive('link'))}
          {/* {btn('Image', addImage, false)} */}
          {btn('Image', () => setShowImageModal(true), false)}
          {showImageModal && <ImageUploadModal onInsert={handleImageInsert} onClose={() => setShowImageModal(false)} />}
          {btn('∑ Equation', addEquation, false)}
          {btn('▶ Video', addVideo, false)}
          <span style={{ marginLeft: 8, marginRight: 4, color: '#ccc' }}>|</span>
          {btn('⬅', () => editor?.chain().focus().setTextAlign('left').run(), editor?.isActive({ textAlign: 'left' }))}
          {btn('↔', () => editor?.chain().focus().setTextAlign('center').run(), editor?.isActive({ textAlign: 'center' }))}
          {btn('➡', () => editor?.chain().focus().setTextAlign('right').run(), editor?.isActive({ textAlign: 'right' }))}
          {btn('≡', () => editor?.chain().focus().setTextAlign('justify').run(), editor?.isActive({ textAlign: 'justify' }))}
          <span style={{ marginLeft: 8, marginRight: 4, color: '#ccc' }}>|</span>
          {btn('→|', () => editor?.chain().focus().sinkListItem('listItem').run(), false)}
          {btn('|←', () => editor?.chain().focus().liftListItem('listItem').run(), false)}
        </div>

        {/* Editor */}
        <EditorContent
          editor={editor}
          style={{ padding: 24, minHeight: 400 }}
        />
      </div>

      {/* Save button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16 }}>
        <button
          onClick={handleSave}
          style={{
            padding: '10px 28px', backgroundColor: '#3b3b5c',
            color: '#fff', border: 'none', borderRadius: 6,
            cursor: 'pointer', fontSize: 15
          }}
        >
          Save
        </button>
        {saved && <span style={{ color: 'green', fontWeight: 600 }}>✓ Saved!</span>}
      </div>
    </PageLayout>
  )
}

export default TeacherMediaPage