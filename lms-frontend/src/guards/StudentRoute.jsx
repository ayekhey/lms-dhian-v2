import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const StudentRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user || user.role !== 'STUDENT') return <Navigate to="/login" />
  if (!user.diagnosticDone) return <Navigate to="/diagnostic" />

  return children
}

export default StudentRoute