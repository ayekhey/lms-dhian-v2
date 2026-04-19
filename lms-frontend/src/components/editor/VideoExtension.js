import { Node, mergeAttributes } from '@tiptap/core'

const VideoExtension = Node.create({
  name: 'video',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: { default: null }
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-video]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-video': '' })]
  }
})

export default VideoExtension