import { useEffect, useState } from 'react'
import PageLayout from '../components/PageLayout'
import ModuleRenderer from '../components/editor/ModuleRenderer'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const MediaPage = () => {
  const { user } = useAuth()
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/media').then(res => {
      setContent(res.data.content)
      setLoading(false)
    })
  }, [])

  if (loading) return <PageLayout title="Media"><p>Loading...</p></PageLayout>

  if (!content) return (
    <PageLayout title="Media">
      <p style={{ color: '#aaa' }}>No media content yet.</p>
    </PageLayout>
  )

  return (
    <PageLayout title="Media">
      <div style={{
        backgroundColor: '#fff', padding: 32,
        borderRadius: 8, border: '1px solid #ddd', maxWidth: 800
      }}>
        <ModuleRenderer
          blocks={[{ id: 'media', type: 'main', content }]}
          studentTier={user?.tier || 3}
        />
      </div>
    </PageLayout>
  )
}

export default MediaPage