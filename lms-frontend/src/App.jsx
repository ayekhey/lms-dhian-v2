import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import TeacherRoute from './guards/TeacherRoute'
import StudentRoute from './guards/StudentRoute'

import LoginPage from './pages/LoginPage'
import DiagnosticPage from './pages/DiagnosticPage'
import PostTestPage from './pages/PostTestPage'
import StudentDashboard from './pages/StudentDashboard'
import ModuleListPage from './pages/ModuleListPage'
import ModuleViewerPage from './pages/ModuleViewerPage'
import MediaPage from './pages/MediaPage'
import TeacherDashboard from './pages/TeacherDashboard'
import TeacherModulePage from './pages/TeacherModulePage'
import TeacherModuleEditPage from './pages/TeacherModuleEditPage'
import TeacherTopicEditPage from './pages/TeacherTopicEditPage'
import TeacherMediaPage from './pages/TeacherMediaPage'
import TeacherDiagnosticPage from './pages/TeacherDiagnosticPage'
import TeacherDiagnosticEditPage from './pages/TeacherDiagnosticEditPage'
import TeacherStudentPage from './pages/TeacherStudentPage'

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Student routes */}
          <Route path="/diagnostic" element={<DiagnosticPage />} />
          <Route path="/student/dashboard" element={
            <StudentRoute><StudentDashboard /></StudentRoute>
          } />
          <Route path="/student/modules" element={
            <StudentRoute><ModuleListPage /></StudentRoute>
          } />
          <Route path="/student/modules/:id" element={
            <StudentRoute><ModuleViewerPage /></StudentRoute>
          } />
          <Route path="/student/media" element={
            <StudentRoute><MediaPage /></StudentRoute>
          } />
          <Route path="/student/posttest" element={
            <StudentRoute><PostTestPage /></StudentRoute>
          } />

          {/* Teacher routes */}
          <Route path="/teacher/dashboard" element={
            <TeacherRoute><TeacherDashboard /></TeacherRoute>
          } />
          <Route path="/teacher/modules" element={
            <TeacherRoute><TeacherModulePage /></TeacherRoute>
          } />
          <Route path="/teacher/modules/:id/edit" element={
            <TeacherRoute><TeacherModuleEditPage /></TeacherRoute>
          } />
          <Route path="/teacher/modules/:moduleId/topics/:topicId/edit" element={
            <TeacherRoute><TeacherTopicEditPage /></TeacherRoute>
          } />
          <Route path="/teacher/media" element={
            <TeacherRoute><TeacherMediaPage /></TeacherRoute>
          } />
          <Route path="/teacher/diagnostic" element={
            <TeacherRoute><TeacherDiagnosticPage /></TeacherRoute>
          } />
          <Route path="/teacher/diagnostic/:id/edit" element={
            <TeacherRoute><TeacherDiagnosticEditPage /></TeacherRoute>
          } />
          <Route path="/teacher/students" element={
            <TeacherRoute><TeacherStudentPage /></TeacherRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App