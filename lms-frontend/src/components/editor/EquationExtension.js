import { Node, mergeAttributes } from '@tiptap/core'

const EquationExtension = Node.create({
  name: 'equation',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      latex: { default: '' },
      display: { default: false }
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-equation]' }]
  },

  renderHTML({ node, HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, {
      'data-equation': '',
      'latex': node.attrs.latex,
      'data-display': node.attrs.display
    })]
  }
})

export default EquationExtension