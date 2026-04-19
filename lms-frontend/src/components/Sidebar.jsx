import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const teacherLinks = [
  { to: '/teacher/dashboard', label: 'Dashboard' },
  { to: '/teacher/modules', label: 'Modules' },
  { to: '/teacher/diagnostic', label: 'Tests' },
  { to: '/teacher/students', label: 'Students' },
  { to: '/teacher/media', label: 'Media' },
]

const studentLinks = [
  { to: '/student/dashboard', label: 'Dashboard' },
  { to: '/student/modules', label: 'Modules' },
  { to: '/student/media', label: 'Media' },
  { to: '/student/posttest', label: 'Post Test' },
]

const Sidebar = () => {
  const { user, logout } = useAuth()
  const links = user?.role === 'TEACHER' ? teacherLinks : studentLinks

  return (
    <div style={{
      width: 220,
      minHeight: '100vh',
      backgroundColor: '#1e1e2e',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 0',
      flexShrink: 0
    }}>
      {/* App name */}
      <div style={{ padding: '0 24px 24px', fontWeight: 700, fontSize: 18 }}>
        GYROSCOPE 361
      </div>

      {/* User info */}
      <div style={{
        padding: '12px 24px',
        marginBottom: 16,
        borderTop: '1px solid #333',
        borderBottom: '1px solid #333',
        fontSize: 13,
        color: '#aaa'
      }}>
        <div style={{ color: '#fff', fontWeight: 600 }}>{user?.name}</div>
        <div>{user?.role}</div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, padding: '0 12px' }}>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              display: 'block',
              padding: '10px 12px',
              borderRadius: 6,
              color: isActive ? '#fff' : '#aaa',
              backgroundColor: isActive ? '#3b3b5c' : 'transparent',
              textDecoration: 'none',
              fontWeight: isActive ? 600 : 400,
              fontSize: 14
            })}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '0 12px' }}>
        <button
          onClick={logout}
          style={{
            width: '100%',
            padding: '10px 12px',
            backgroundColor: 'transparent',
            color: '#aaa',
            border: '1px solid #333',
            borderRadius: 6,
            cursor: 'pointer',
            textAlign: 'left',
            fontSize: 14
          }}
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar