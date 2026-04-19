import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import api from '../api/axios'

const TeacherModuleEditPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [topics, setTopics] = useState([])
  const [newTopicTitle, setNewTopicTitle] = useState('')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const fetchData = async () => {
    const [moduleRes, topicsRes] = await Promise.all([
      api.get('/api/modules'),
      api.get(`/api/modules/${id}/topics`)
    ])
    const module = moduleRes.data.find(m => m.id === id)
    if (module) {
      setTitle(module.title)
      setDescription(module.description || '')
    }
    setTopics(topicsRes.data)
  }

  useEffect(() => { fetchData() }, [id])

  const handleSaveModule = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.put(`/api/modules/${id}`, { title, description })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      setError('Failed to save module')
    }
  }

  const handleAddTopic = async (e) => {
    e.preventDefault()
    if (!newTopicTitle.trim()) return
    try {
      await api.post(`/api/modules/${id}/topics`, { title: newTopicTitle })
      setNewTopicTitle('')
      fetchData()
    } catch {
      alert('Failed to create topic')
    }
  }

  const handleDeleteTopic = async (topicId) => {
    if (!confirm('Delete this topic?')) return
    try {
      await api.delete(`/api/modules/${id}/topics/${topicId}`)
      fetchData()
    } catch {
      alert('Failed to delete topic')
    }
  }

  return (
    <PageLayout title="Edit Module">

      {/* Module details form */}
      <div style={{
        backgroundColor: '#fff', padding: 24, borderRadius: 8,
        border: '1px solid #ddd', marginBottom: 32, maxWidth: 500
      }}>
        <h2 style={{ fontSize: 16, marginBottom: 16 }}>Module Details</h2>
        <form onSubmit={handleSaveModule}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 13 }}>Title</label><br />
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #ccc', borderRadius: 4, marginTop: 4 }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13 }}>Description (optional)</label><br />
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #ccc', borderRadius: 4, marginTop: 4, resize: 'vertical' }}
            />
          </div>
          {error && <p style={{ color: 'red', marginBottom: 8 }}>{error}</p>}
          {saved && <p style={{ color: 'green', marginBottom: 8 }}>Saved!</p>}
          <button type="submit" style={{
            padding: '8px 20px', backgroundColor: '#3b3b5c',
            color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer'
          }}>
            Save Module
          </button>
        </form>
      </div>

      {/* Topics section */}
      <div style={{ backgroundColor: '#fff', padding: 24, borderRadius: 8, border: '1px solid #ddd' }}>
        <h2 style={{ fontSize: 16, marginBottom: 16 }}>Topics</h2>

        {/* Add topic form */}
        <form onSubmit={handleAddTopic} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <input
            value={newTopicTitle}
            onChange={e => setNewTopicTitle(e.target.value)}
            placeholder="New topic title..."
            required
            style={{ flex: 1, padding: '8px 10px', border: '1px solid #ccc', borderRadius: 4 }}
          />
          <button type="submit" style={{
            padding: '8px 16px', backgroundColor: '#3b3b5c',
            color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer'
          }}>
            + Add Topic
          </button>
        </form>

        {/* Topics list */}
        {topics.length === 0 && (
          <p style={{ color: '#aaa' }}>No topics yet. Add one above.</p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {topics.map(t => (
            <div key={t.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 16px', border: '1px solid #eee', borderRadius: 6,
              backgroundColor: '#fafafa'
            }}>
              <div>
                <span style={{ fontWeight: 600, color: '#aaa', marginRight: 10, fontSize: 13 }}>
                  #{t.topicNumber}
                </span>
                {t.title}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => navigate(`/teacher/modules/${id}/topics/${t.id}/edit`)}
                  style={{
                    padding: '6px 14px', backgroundColor: '#3b3b5c',
                    color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTopic(t.id)}
                  style={{
                    padding: '6px 14px', backgroundColor: '#c62828',
                    color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate('/teacher/modules')}
        style={{
          marginTop: 24, padding: '8px 16px', backgroundColor: 'transparent',
          border: '1px solid #ccc', borderRadius: 6, cursor: 'pointer', fontSize: 13
        }}
      >
        ← Back to Modules
      </button>
    </PageLayout>
  )
}

export default TeacherModuleEditPage