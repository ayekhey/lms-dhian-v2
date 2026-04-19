import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import api from '../api/axios'

const TeacherModulePage = () => {
  const [modules, setModules] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const fetchModules = async () => {
    const res = await api.get('/api/modules')
    setModules(res.data)
  }

  useEffect(() => { fetchModules() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/api/modules', { title, description })
      setTitle('')
      setDescription('')
      fetchModules()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create module')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this module and all its topics?')) return
    try {
      await api.delete(`/api/modules/${id}`)
      fetchModules()
    } catch {
      alert('Failed to delete module')
    }
  }

  return (
    <PageLayout title="Modules">

      {/* Create module form */}
      <div style={{
        backgroundColor: '#fff', padding: 24, borderRadius: 8,
        border: '1px solid #ddd', marginBottom: 32, maxWidth: 500
      }}>
        <h2 style={{ marginBottom: 16, fontSize: 16 }}>Create New Module</h2>
        <form onSubmit={handleCreate}>
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
          <button type="submit" style={{
            padding: '8px 20px', backgroundColor: '#3b3b5c',
            color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer'
          }}>
            Create Module
          </button>
        </form>
      </div>

      {/* Modules list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {modules.length === 0 && (
          <p style={{ color: '#aaa' }}>No modules yet. Create one above.</p>
        )}
        {modules.map(m => (
          <div key={m.id} style={{
            backgroundColor: '#fff', padding: 20, borderRadius: 8,
            border: '1px solid #ddd', display: 'flex',
            justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{m.title}</div>
              {m.description && (
                <div style={{ color: '#666', fontSize: 13, marginTop: 4 }}>{m.description}</div>
              )}
              <div style={{ color: '#aaa', fontSize: 12, marginTop: 4 }}>
                {m.topics?.length || 0} topic{m.topics?.length !== 1 ? 's' : ''}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => navigate(`/teacher/modules/${m.id}/edit`)}
                style={{
                  padding: '8px 16px', backgroundColor: '#3b3b5c',
                  color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer'
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(m.id)}
                style={{
                  padding: '8px 16px', backgroundColor: '#c62828',
                  color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  )
}

export default TeacherModulePage