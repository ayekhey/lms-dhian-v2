import { useEffect, useRef } from 'react'
import { useState } from 'react'
import { generateHTML } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Heading from '@tiptap/extension-heading'
import Link from '@tiptap/extension-link'
import { ResizableImageExtension } from 'tiptap-extension-resize-image'
import 'tiptap-extension-resize-image/styles.css'
import EquationExtension from './EquationExtension'
import VideoExtension from './VideoExtension'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import TextAlign from '@tiptap/extension-text-align'

const extensions = [
  StarterKit,
  Underline,
  Heading.configure({ levels: [1, 2, 3] }),
  Link.configure({ openOnClick: true }),
  ResizableImageExtension,
  EquationExtension,
  VideoExtension,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
]

const isValidContent = (content) => {
  if (!content) return false
  if (!content.type) return false
  if (content.type === 'doc' && (!content.content || content.content.length === 0)) return false
  return true
}

const getEmbedUrl = (url) => {
  if (!url) return null
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  return url
}

// ─── Rich text renderer ─────────────────────────────────────────────────────
const RichTextRenderer = ({ content }) => {
  const ref = useRef()

  useEffect(() => {
    if (!ref.current) return
    if (!isValidContent(content)) {
      ref.current.innerHTML = ''
      return
    }

    let html = ''
    try {
      html = generateHTML(content, extensions)
    } catch {
      ref.current.innerHTML = ''
      return
    }

    ref.current.innerHTML = html

    ref.current.querySelectorAll('[data-equation]').forEach(el => {
      const latex = el.getAttribute('latex') || ''
      try {
        katex.render(latex, el, { displayMode: true, throwOnError: false })
      } catch {
        el.textContent = latex
      }
    })

    ref.current.querySelectorAll('[data-video]').forEach(el => {
      const src = el.getAttribute('src') || ''
      const embedUrl = getEmbedUrl(src)
      if (!embedUrl) return
      const iframe = document.createElement('iframe')
      iframe.src = embedUrl
      iframe.style = 'width:100%;aspect-ratio:16/9;border:none;border-radius:8px;'
      iframe.allowFullscreen = true
      el.replaceWith(iframe)
    })
  }, [content])

  return <div ref={ref} style={{ lineHeight: 1.7 }} className="rich-text" />
}

// ─── Show/Hide block ────────────────────────────────────────────────────────
const ShowHideRenderer = ({ block, studentTier }) => {
  const [open, setOpen] = useState(false)
  const { tier, label, content } = block

  // Tier filtering
  if (tier === 'extend' && studentTier === 1) return null
  if (tier === 'help' && studentTier !== 3) return null

  return (
    <div style={{ margin: '12px 0', border: '1px solid #ddd', borderRadius: 8 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left', padding: '10px 14px',
          backgroundColor: '#f5f5f5', border: 'none', cursor: 'pointer',
          fontWeight: 600, fontSize: 14,
          borderRadius: open ? '8px 8px 0 0' : 8
        }}
      >
        {open ? '▾' : '▸'} {label || 'Show more'}
      </button>
      {open && (
        <div style={{ padding: 14 }}>
          {isValidContent(content)
            ? <RichTextRenderer content={content} />
            : <p style={{ color: '#aaa', fontSize: 13 }}>No content.</p>
          }
        </div>
      )}
    </div>
  )
}

// ─── Quiz block ─────────────────────────────────────────────────────────────
const QuizRenderer = ({ block }) => {
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const options = block.options || []

  if (!isValidContent(block.question) && options.length === 0) {
    return (
      <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8, color: '#aaa' }}>
        Empty quiz block
      </div>
    )
  }

  return (
    <div style={{
      margin: '16px 0', padding: 16,
      border: '1px solid #ddd', borderRadius: 8,
      backgroundColor: '#fafafa'
    }}>
      <div style={{ marginBottom: 12 }}>
        {isValidContent(block.question)
          ? <RichTextRenderer content={block.question} />
          : <p style={{ color: '#aaa', fontSize: 13 }}>No question text.</p>
        }
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {options.map((option, i) => {
          let bg = '#fff'
          if (submitted) {
            if (i === block.correctOption) bg = '#e8f5e9'
            else if (i === selected) bg = '#ffebee'
          } else if (i === selected) {
            bg = '#e3f2fd'
          }

          return (
            <button
              key={i}
              onClick={() => !submitted && setSelected(i)}
              style={{
                textAlign: 'left', padding: '10px 14px',
                border: `1px solid ${submitted && i === block.correctOption ? '#4caf50' : '#ddd'}`,
                borderRadius: 6,
                cursor: submitted ? 'default' : 'pointer',
                backgroundColor: bg,
                fontWeight: i === selected ? 600 : 400
              }}
            >
              <span style={{ marginRight: 8, color: '#888', fontSize: 13 }}>
                {['A', 'B', 'C', 'D', 'E'][i]}.
              </span>
              {isValidContent(option)
                ? <RichTextRenderer content={option} />
                : <span style={{ color: '#aaa', fontSize: 13 }}>Empty option</span>
              }
            </button>
          )
        })}
      </div>

      {!submitted && (
        <button
          onClick={() => selected !== null && setSubmitted(true)}
          disabled={selected === null}
          style={{
            marginTop: 12, padding: '8px 20px',
            backgroundColor: selected === null ? '#ccc' : '#3b3b5c',
            color: '#fff', border: 'none', borderRadius: 6,
            cursor: selected === null ? 'default' : 'pointer'
          }}
        >
          Submit Answer
        </button>
      )}

      {submitted && (
        <p style={{
          marginTop: 10, fontWeight: 600,
          color: selected === block.correctOption ? '#2e7d32' : '#c62828'
        }}>
          {selected === block.correctOption ? '✓ Correct!' : '✗ Incorrect. See the highlighted answer.'}
        </p>
      )}
    </div>
  )
}

// ─── Main export ────────────────────────────────────────────────────────────
const ModuleRenderer = ({ blocks = [], studentTier = 3 }) => {
  return (
    <div>
      {blocks.map((block) => {
        if (!block || !block.type) return null

        if (block.type === 'main') {
          return (
            <div key={block.id} style={{ marginBottom: 20 }}>
              {isValidContent(block.content)
                ? <RichTextRenderer content={block.content} />
                : <p style={{ color: '#aaa', fontSize: 13 }}>Empty content block.</p>
              }
            </div>
          )
        }

        if (block.type === 'show_hide') {
          return (
            <ShowHideRenderer
              key={block.id}
              block={block}
              studentTier={studentTier}
            />
          )
        }

        if (block.type === 'quiz') {
          return <QuizRenderer key={block.id} block={block} />
        }

        return null
      })}
    </div>
  )
}

export default ModuleRenderer