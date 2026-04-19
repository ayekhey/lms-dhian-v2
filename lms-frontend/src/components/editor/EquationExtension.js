import { Node, mergeAttributes } from '@tiptap/core'

const EquationExtension = Node.create({
  name: 'equation',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      latex: { default: '' },
      display: { default: true }
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-equation]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-equation': '' })]
  }
})

export default EquationExtension