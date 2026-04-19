import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import BlockEditor from '../components/editor/BlockEditor'
import api from '../api/axios'

const TeacherTopicEditPage = () => {
  const { moduleId, topicId } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [blocks, setBlocks] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTopic = async () => {
      const res = await api.get(`/api/modules/${moduleId}/topics`)
      const topic = res.data.find(t => t.id === topicId)
      if (topic) {
        setTitle(topic.title)
        setBlocks(topic.blocks || [])
      }
      setLoaded(true)
    }
    fetchTopic()
  }, [moduleId, topicId])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      await api.put(`/api/modules/${moduleId}/topics/${topicId}`, { title, blocks })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      setError('Failed to save topic')
    } finally {
      setSaving(false)
    }
  }

  if (!loaded) return <PageLayout title="Edit Topic"><p>Loading...</p></PageLayout>

  return (
    <PageLayout title="Edit Topic">

      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 13, fontWeight: 600 }}>Topic Title</label><br />
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Topic title..."
          style={{
            width: '100%', maxWidth: 500,
            padding: '10px 12px', fontSize: 16,
            border: '1px solid #ccc', borderRadius: 6, marginTop: 6
          }}
        />
      </div>

      <div style={{
        backgroundColor: '#fff', padding: 24,
        borderRadius: 8, border: '1px solid #ddd', marginBottom: 24
      }}>
        <BlockEditor
          key={topicId}
          blocks={blocks}
          onChange={setBlocks}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: '10px 28px', backgroundColor: '#3b3b5c',
            color: '#fff', border: 'none', borderRadius: 6,
            cursor: saving ? 'default' : 'pointer', fontSize: 15
          }}
        >
          {saving ? 'Saving...' : 'Save Topic'}
        </button>
        {saved && <span style={{ color: 'green', fontWeight: 600 }}>✓ Saved!</span>}
        {error && <span style={{ color: 'red' }}>{error}</span>}
        <button
          onClick={() => navigate(`/teacher/modules/${moduleId}/edit`)}
          style={{
            padding: '10px 16px', backgroundColor: 'transparent',
            border: '1px solid #ccc', borderRadius: 6, cursor: 'pointer', fontSize: 13
          }}
        >
          ← Back
        </button>
      </div>
    </PageLayout>
  )
}

export default TeacherTopicEditPage