import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    // setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      if (user.role === 'TEACHER') {
        navigate('/teacher/dashboard')
      } else {
        navigate(user.diagnosticDone ? '/student/dashboard' : '/diagnostic')
      }
    } catch {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f0f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo / App name */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ marginBottom: 0 }}>
            <img
              src="/favicon.png"
              alt="GYROSCOPE 361"
              style={{ width: 200, height: 200, borderRadius: 16, objectFit: 'cover' }}
            />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>
            GYROSCOPE 361
          </h1>
          <p style={{ color: '#888', fontSize: 14, marginTop: 6 }}>
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: 16,
          padding: 36,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          border: '1px solid #e8e8e8'
        }}>
          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block', fontSize: 13,
                fontWeight: 600, color: '#444', marginBottom: 8
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                required
                placeholder="you@example.com"
                style={{
                  width: '100%', padding: '12px 14px',
                  border: '1.5px solid #e0e0e0', borderRadius: 8,
                  fontSize: 14, outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                  backgroundColor: '#fafafa'
                }}
                onFocus={e => e.target.style.borderColor = '#3b3b5c'}
                onBlur={e => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: 'block', fontSize: 13,
                fontWeight: 600, color: '#444', marginBottom: 8
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                required
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '12px 14px',
                  border: '1.5px solid #e0e0e0', borderRadius: 8,
                  fontSize: 14, outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                  backgroundColor: '#fafafa'
                }}
                onFocus={e => e.target.style.borderColor = '#3b3b5c'}
                onBlur={e => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{
                backgroundColor: '#fff0f0', border: '1px solid #ffcccc',
                borderRadius: 8, padding: '10px 14px',
                color: '#c62828', fontSize: 13, marginBottom: 20
              }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px',
                backgroundColor: loading ? '#888' : '#3b3b5c',
                color: '#fff', border: 'none', borderRadius: 8,
                fontSize: 15, fontWeight: 600, cursor: loading ? 'default' : 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={e => { if (!loading) e.target.style.backgroundColor = '#2d2d47' }}
              onMouseLeave={e => { if (!loading) e.target.style.backgroundColor = '#3b3b5c' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

          </form>
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', color: '#aaa', fontSize: 12, marginTop: 24 }}>
            GYROSCOPE 361 © {new Date().getFullYear()}
          </p>
      </div>
    </div>
  )
}

export default LoginPage