import { useEffect, useState } from 'react'
import PageLayout from '../components/PageLayout'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const StatCard = ({ label, value, color }) => (
  <div style={{
    backgroundColor: '#fff', padding: 24, borderRadius: 8,
    border: '1px solid #ddd', flex: 1, minWidth: 160
  }}>
    <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>{label}</div>
    <div style={{ fontSize: 32, fontWeight: 700, color: color || '#1a1a1a' }}>{value}</div>
  </div>
)

const TeacherDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    students: 0,
    modules: 0,
    questions: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      const [studentsRes, modulesRes, questionsRes] = await Promise.all([
        api.get('/api/users/students'),
        api.get('/api/modules'),
        api.get('/api/diagnostic/manage')
      ])
      setStats({
        students: studentsRes.data.length,
        modules: modulesRes.data.length,
        questions: questionsRes.data.length
      })
    }
    fetchStats()
  }, [])

  return (
    <PageLayout title="Dashboard">
      <p style={{ marginBottom: 24, color: '#555' }}>
        Welcome back, <strong>{user?.name}</strong>!
      </p>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
        <StatCard label="Total Students" value={stats.students} color="#3b3b5c" />
        <StatCard label="Total Modules" value={stats.modules} color="#2e7d32" />
        <StatCard label="Test Questions" value={stats.questions} color="#e65100" />
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {[
          { label: 'Modules', desc: 'Create and manage learning modules', href: '/teacher/modules', color: '#3b3b5c' },
          { label: 'Students', desc: 'Add and manage student accounts', href: '/teacher/students', color: '#1565c0' },
          { label: 'Tests', desc: 'Manage questions and test settings', href: '/teacher/diagnostic', color: '#e65100' },
          { label: 'Media', desc: 'Edit the shared media page', href: '/teacher/media', color: '#2e7d32' },
        ].map(link => (
          <a
            key={link.href}
            href={link.href}
            style={{ textDecoration: 'none', flex: '1 1 180px' }}
          >
            <div style={{
              backgroundColor: '#fff', padding: 20, borderRadius: 8,
              border: '1px solid #ddd', cursor: 'pointer',
              borderTop: `4px solid ${link.color}`,
              transition: 'box-shadow 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={{ fontWeight: 700, fontSize: 15, color: link.color, marginBottom: 6 }}>
                {link.label}
              </div>
              <div style={{ fontSize: 13, color: '#666' }}>
                {link.desc}
              </div>
            </div>
          </a>
        ))}
      </div>
    </PageLayout>
  )
}

export default TeacherDashboard