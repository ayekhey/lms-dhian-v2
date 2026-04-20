import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      if (user.role === 'TEACHER') {
        navigate('/teacher/dashboard')
      } else {
        navigate(user.diagnosticDone ? '/student/dashboard' : '/diagnostic')
      }
    } catch {
      setError('invalid')
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

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ marginBottom: 16 }}>
            <img
              src="/favicon.png"
              alt="GYROSCOPE 361"
              style={{ width: 56, height: 56, borderRadius: 16, objectFit: 'cover' }}
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
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={{
                  width: '100%', padding: '12px 14px',
                  border: '1.5px solid #e0e0e0', borderRadius: 8,
                  fontSize: 14, outline: 'none',
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
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '12px 44px 12px 14px',
                    border: '1.5px solid #e0e0e0', borderRadius: 8,
                    fontSize: 14, outline: 'none',
                    boxSizing: 'border-box',
                    backgroundColor: '#fafafa'
                  }}
                  onFocus={e => e.target.style.borderColor = '#3b3b5c'}
                  onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  style={{
                    position: 'absolute', right: 12, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    cursor: 'pointer', fontSize: 16,
                    color: '#888', padding: 4
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Error */}
            {error === 'invalid' && (
              <div style={{
                backgroundColor: '#fff8e1',
                border: '1px solid #ffe082',
                borderRadius: 8, padding: '12px 14px',
                marginBottom: 20
              }}>
                <div style={{ color: '#c62828', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>
                  ⚠️ Invalid email or password
                </div>
                <div style={{ color: '#555', fontSize: 12 }}>
                  Having trouble logging in? Please contact your teacher to reset your password or check your account.
                </div>
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
                fontSize: 15, fontWeight: 600,
                cursor: loading ? 'default' : 'pointer'
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