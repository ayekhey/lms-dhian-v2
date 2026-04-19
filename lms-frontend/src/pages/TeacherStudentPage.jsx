import { useEffect, useState } from 'react'
import PageLayout from '../components/PageLayout'
import api from '../api/axios'

const TeacherStudentPage = () => {
  const [students, setStudents] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchStudents = async () => {
    const res = await api.get('/api/users/students')
    setStudents(res.data)
  }

  useEffect(() => { fetchStudents() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      await api.post('/api/users/students', { name, email, password })
      setSuccess('Student created successfully')
      setName('')
      setEmail('')
      setPassword('')
      fetchStudents()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create student')
    }
  }

  const handleResetPassword = async (id) => {
    const newPassword = prompt('Enter new password:')
    if (!newPassword) return
    try {
      await api.put(`/api/users/students/${id}/reset-password`, { password: newPassword })
      alert('Password reset successfully')
    } catch {
      alert('Failed to reset password')
    }
  }

  const handleResetDiagnostic = async (id) => {
    if (!confirm('Reset pre-test for this student? Their tier will be cleared.')) return
    try {
      await api.put(`/api/users/students/${id}/reset-diagnostic`)
      alert('Pre-test reset successfully')
      fetchStudents()
    } catch {
      alert('Failed to reset pre-test')
    }
  }

  const handleResetPostTest = async (id) => {
    if (!confirm('Reset post-test for this student?')) return
    try {
      await api.put(`/api/users/students/${id}/reset-posttest`)
      alert('Post-test reset successfully')
      fetchStudents()
    } catch {
      alert('Failed to reset post-test')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this student? This cannot be undone.')) return
    try {
      await api.delete(`/api/users/students/${id}`)
      fetchStudents()
    } catch {
      alert('Failed to delete student')
    }
  }

  const tierLabel = (tier) => {
    if (tier === 1) return 'Tier 1 — Advanced'
    if (tier === 2) return 'Tier 2 — Intermediate'
    if (tier === 3) return 'Tier 3 — Foundation'
    return '—'
  }

  return (
    <PageLayout title="Manage Students">

      {/* Create student form */}
      <div style={{
        backgroundColor: '#fff', padding: 24, borderRadius: 8,
        border: '1px solid #ddd', marginBottom: 32, maxWidth: 500
      }}>
        <h2 style={{ marginBottom: 16, fontSize: 16 }}>Add New Student</h2>
        <form onSubmit={handleCreate}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 13 }}>Name</label><br />
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #ccc', borderRadius: 4, marginTop: 4 }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 13 }}>Email</label><br />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #ccc', borderRadius: 4, marginTop: 4 }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13 }}>Password</label><br />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #ccc', borderRadius: 4, marginTop: 4 }}
            />
          </div>
          {error && <p style={{ color: 'red', marginBottom: 8 }}>{error}</p>}
          {success && <p style={{ color: 'green', marginBottom: 8 }}>{success}</p>}
          <button type="submit" style={{
            padding: '8px 20px', backgroundColor: '#3b3b5c',
            color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer'
          }}>
            Create Student
          </button>
        </form>
      </div>

      {/* Students table */}
      <div style={{ backgroundColor: '#fff', borderRadius: 8, border: '1px solid #ddd', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
              <th style={th}>Name</th>
              <th style={th}>Email</th>
              <th style={th}>Tier</th>
              <th style={th}>Pre-Test</th>
              <th style={th}>Post-Test</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#aaa' }}>
                  No students yet
                </td>
              </tr>
            )}
            {students.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={td}>{s.name}</td>
                <td style={td}>{s.email}</td>
                <td style={td}>{tierLabel(s.tier)}</td>
                <td style={td}>{s.diagnosticDone ? '✓ Done' : '—'}</td>
                <td style={td}>{s.postTestDone ? '✓ Done' : '—'}</td>
                <td style={td}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button onClick={() => handleResetPassword(s.id)} style={actionBtn('#1565c0')}>
                      Reset PW
                    </button>
                    <button onClick={() => handleResetDiagnostic(s.id)} style={actionBtn('#e65100')}>
                      Reset Pre
                    </button>
                    <button onClick={() => handleResetPostTest(s.id)} style={actionBtn('#6a1b9a')}>
                      Reset Post
                    </button>
                    <button onClick={() => handleDelete(s.id)} style={actionBtn('#c62828')}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageLayout>
  )
}

const th = {
  padding: '12px 16px', textAlign: 'left',
  fontSize: 13, fontWeight: 600
}

const td = {
  padding: '12px 16px', fontSize: 14
}

const actionBtn = (bg) => ({
  padding: '4px 10px', backgroundColor: bg,
  color: '#fff', border: 'none', borderRadius: 4,
  cursor: 'pointer', fontSize: 12
})

export default TeacherStudentPage