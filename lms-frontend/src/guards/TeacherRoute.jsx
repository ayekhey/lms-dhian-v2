import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const TeacherRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user || user.role !== 'TEACHER') return <Navigate to="/login" />

  return children
}

export default TeacherRoute