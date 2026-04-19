import { useEffect, useRef } from 'react'
import { generateHTML } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { ResizableImageExtension } from 'tiptap-extension-resize-image'
import 'tiptap-extension-resize-image/styles.css'
import EquationExtension from './EquationExtension'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import TextAlign from '@tiptap/extension-text-align'

const extensions = [
  StarterKit,
  Underline,
  ResizableImageExtension,
  EquationExtension,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
]

const isValidContent = (content) => {
  if (!content) return false
  if (!content.type) return false
  if (content.type === 'doc' && (!content.content || content.content.length === 0)) return false
  return true
}

const RichTextRenderer = ({ content, inline = false }) => {
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
        katex.render(latex, el, { displayMode: !inline, throwOnError: false })
      } catch {
        el.textContent = latex
      }
    })

    ref.current.querySelectorAll('img').forEach(img => {
      img.style.maxWidth = '100%'
      img.style.borderRadius = '6px'
      img.style.marginTop = '8px'
    })
  }, [content])

  return (
    <div
      ref={ref}
      style={{ lineHeight: 1.6 }}
      className="rich-text"
    />
  )
}

export default RichTextRenderer