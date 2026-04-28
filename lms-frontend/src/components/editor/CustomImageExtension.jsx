import { Node, mergeAttributes } from '@tiptap/core'

const CustomImageExtension = Node.create({
  name: 'customImage',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      width: { default: '100%' },
      align: { default: 'left' }
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-custom-image]' }]
  },

  renderHTML({ node, HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, {
      'data-custom-image': '',
      style: `text-align: ${node.attrs.align}`
    }),
      ['img', {
        src: node.attrs.src,
        style: `width: ${node.attrs.width}; border-radius: 6px;`
      }]
    ]
  }
})

export default CustomImageExtension