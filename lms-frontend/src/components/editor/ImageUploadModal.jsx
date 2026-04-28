import { useState } from 'react'

const ImageUploadModal = ({ onInsert, onClose }) => {
  const [src, setSrc] = useState('')
  const [width, setWidth] = useState('100')
  const [align, setAlign] = useState('left')

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setSrc(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleInsert = () => {
    if (!src) return
    onInsert({ src, width: `${width}%`, align })
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#fff', borderRadius: 12,
        padding: 28, width: 420, boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
      }}>
        <h3 style={{ margin: '0 0 20px', fontSize: 16 }}>Insert Image</h3>

        {/* File upload */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
            Select Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            style={{ fontSize: 13 }}
          />
        </div>

        {/* Preview */}
        {src && (
          <div style={{
            marginBottom: 16, padding: 8,
            border: '1px solid #eee', borderRadius: 6,
            textAlign: align
          }}>
            <img
              src={src}
              style={{ width: `${width}%`, borderRadius: 4 }}
              alt="preview"
            />
          </div>
        )}

        {/* Width slider */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
            Width: {width}%
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={width}
            onChange={e => setWidth(e.target.value)}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#aaa' }}>
            <span>10%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Alignment */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>
            Alignment
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['left', 'center', 'right'].map(a => (
              <button
                key={a}
                type="button"
                onClick={() => setAlign(a)}
                style={{
                  flex: 1, padding: '8px',
                  backgroundColor: align === a ? '#3b3b5c' : '#f0f0f0',
                  color: align === a ? '#fff' : '#333',
                  border: 'none', borderRadius: 6,
                  cursor: 'pointer', fontSize: 13,
                  fontWeight: align === a ? 600 : 400
                }}
              >
                {a === 'left' ? '⬅ Left' : a === 'center' ? '↔ Center' : '➡ Right'}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 20px', backgroundColor: '#f0f0f0',
              border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleInsert}
            disabled={!src}
            style={{
              padding: '8px 20px',
              backgroundColor: src ? '#3b3b5c' : '#ccc',
              color: '#fff', border: 'none', borderRadius: 6,
              cursor: src ? 'pointer' : 'default', fontSize: 13
            }}
          >
            Insert Image
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImageUploadModal