import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import api from '../api/axios'

const ModuleListPage = () => {
  const [modules, setModules] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/api/modules').then(res => setModules(res.data))
  }, [])

  return (
    <PageLayout title="Modules">
      {modules.length === 0 && (
        <p style={{ color: '#aaa' }}>No modules available yet.</p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {modules.map((m, index) => (
          <div key={m.id} style={{
            backgroundColor: '#fff', padding: 24, borderRadius: 8,
            border: '1px solid #ddd', display: 'flex',
            justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: 12, color: '#aaa', marginBottom: 4 }}>
                Module {index + 1}
              </div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
                {m.title}
              </div>
              {m.description && (
                <div style={{ fontSize: 13, color: '#666', marginBottom: 6 }}>
                  {m.description}
                </div>
              )}
              <div style={{ fontSize: 12, color: '#aaa' }}>
                {m.topics?.length || 0} topic{m.topics?.length !== 1 ? 's' : ''}
              </div>
            </div>
            <button
              onClick={() => navigate(`/student/modules/${m.id}`)}
              style={{
                padding: '10px 24px', backgroundColor: '#3b3b5c',
                color: '#fff', border: 'none', borderRadius: 6,
                cursor: 'pointer', fontSize: 14
              }}
            >
              Open →
            </button>
          </div>
        ))}
      </div>
    </PageLayout>
  )
}

export default ModuleListPage