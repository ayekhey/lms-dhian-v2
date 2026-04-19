import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const StudentDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [modules, setModules] = useState([])

  useEffect(() => {
    api.get('/api/modules').then(res => setModules(res.data))
  }, [])

  const tierLabel = (tier) => {
    if (tier === 1) return 'Tier 1 — Advanced'
    if (tier === 2) return 'Tier 2 — Intermediate'
    if (tier === 3) return 'Tier 3 — Foundation'
    return '—'
  }

  const tierColor = (tier) => {
    if (tier === 1) return '#1565c0'
    if (tier === 2) return '#2e7d32'
    if (tier === 3) return '#e65100'
    return '#888'
  }

  return (
    <PageLayout title="Dashboard">

      {/* Welcome + tier */}
      <div style={{
        backgroundColor: '#fff', padding: 24, borderRadius: 8,
        border: '1px solid #ddd', marginBottom: 24,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
            Welcome, {user?.name}!
          </div>
          <div style={{ fontSize: 13, color: '#666' }}>
            {user?.postTestDone
              ? 'You have completed all activities.'
              : 'Complete the modules and take the post-test.'}
          </div>
        </div>
        <div style={{
          padding: '8px 20px', borderRadius: 20, fontWeight: 700,
          backgroundColor: tierColor(user?.tier),
          color: '#fff', fontSize: 14
        }}>
          {tierLabel(user?.tier)}
        </div>
      </div>

      {/* Status cards */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
        <div style={{
          flex: 1, minWidth: 160, backgroundColor: '#fff', padding: 20,
          borderRadius: 8, border: '1px solid #ddd',
          borderTop: '4px solid #2e7d32'
        }}>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>Pre-Test</div>
          <div style={{ fontWeight: 700, color: '#2e7d32' }}>✓ Completed</div>
        </div>
        <div style={{
          flex: 1, minWidth: 160, backgroundColor: '#fff', padding: 20,
          borderRadius: 8, border: '1px solid #ddd',
          borderTop: `4px solid ${modules.length > 0 ? '#1565c0' : '#ccc'}`
        }}>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>Modules</div>
          <div style={{ fontWeight: 700 }}>{modules.length} available</div>
        </div>
        <div style={{
          flex: 1, minWidth: 160, backgroundColor: '#fff', padding: 20,
          borderRadius: 8, border: '1px solid #ddd',
          borderTop: `4px solid ${user?.postTestDone ? '#2e7d32' : '#ccc'}`
        }}>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>Post-Test</div>
          <div style={{ fontWeight: 700, color: user?.postTestDone ? '#2e7d32' : '#888' }}>
            {user?.postTestDone ? '✓ Completed' : 'Not yet taken'}
          </div>
        </div>
      </div>

      {/* Modules list */}
      <h2 style={{ fontSize: 16, marginBottom: 16 }}>Available Modules</h2>
      {modules.length === 0 && (
        <p style={{ color: '#aaa' }}>No modules available yet.</p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {modules.map(m => (
          <div key={m.id} style={{
            backgroundColor: '#fff', padding: 20, borderRadius: 8,
            border: '1px solid #ddd', display: 'flex',
            justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{m.title}</div>
              {m.description && (
                <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>{m.description}</div>
              )}
              <div style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>
                {m.topics?.length || 0} topic{m.topics?.length !== 1 ? 's' : ''}
              </div>
            </div>
            <button
              onClick={() => navigate(`/student/modules/${m.id}`)}
              style={{
                padding: '8px 20px', backgroundColor: '#3b3b5c',
                color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer'
              }}
            >
              Start →
            </button>
          </div>
        ))}
      </div>
    </PageLayout>
  )
}

export default StudentDashboard