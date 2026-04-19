import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import ModuleRenderer from '../components/editor/ModuleRenderer'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const ModuleViewerPage = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [topics, setTopics] = useState([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTopics = async () => {
      const res = await api.get(`/api/modules/${id}/topics`)
      setTopics(res.data)
      setLoading(false)
    }
    fetchTopics()
  }, [id])

  if (loading) return <PageLayout title="Module"><p>Loading...</p></PageLayout>

  if (topics.length === 0) return (
    <PageLayout title="Module">
      <p style={{ color: '#aaa' }}>No topics in this module yet.</p>
    </PageLayout>
  )

  const topic = topics[current]
  const isFirst = current === 0
  const isLast = current === topics.length - 1

  const handleFinish = () => {
    navigate('/student/posttest')
  }

  return (
    <PageLayout title="">
      {/* Top bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 16
      }}>
        <div style={{ fontWeight: 700, fontSize: 16 }}>
          Topic {current + 1} of {topics.length}
        </div>

        {/* Jump to topic dropdown */}
        <select
          value={current}
          onChange={e => setCurrent(Number(e.target.value))}
          style={{
            padding: '6px 12px', border: '1px solid #ccc',
            borderRadius: 6, fontSize: 13, cursor: 'pointer'
          }}
        >
          {topics.map((t, i) => (
            <option key={t.id} value={i}>
              {i + 1}. {t.title}
            </option>
          ))}
        </select>
      </div>

      {/* Progress bar */}
      <div style={{
        backgroundColor: '#eee', borderRadius: 4,
        height: 6, marginBottom: 24
      }}>
        <div style={{
          width: `${((current + 1) / topics.length) * 100}%`,
          backgroundColor: '#3b3b5c', height: '100%',
          borderRadius: 4, transition: 'width 0.3s'
        }} />
      </div>

      {/* Topic content */}
      <div style={{
        backgroundColor: '#fff', padding: 32,
        borderRadius: 8, border: '1px solid #ddd',
        marginBottom: 24, minHeight: 400
      }}>
        <h2 style={{ marginBottom: 24, fontSize: 20 }}>{topic.title}</h2>
        <ModuleRenderer
          blocks={topic.blocks || []}
          studentTier={user?.tier || 3}
        />
      </div>

      {/* Dot indicators */}
      <div style={{
        display: 'flex', justifyContent: 'center',
        gap: 8, marginBottom: 24
      }}>
        {topics.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? 24 : 10,
              height: 10, borderRadius: 5,
              backgroundColor: i === current ? '#3b3b5c' : '#ddd',
              border: 'none', cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          />
        ))}
      </div>

      {/* Navigation buttons */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button
          onClick={() => setCurrent(c => c - 1)}
          disabled={isFirst}
          style={{
            padding: '10px 24px',
            border: '1px solid #ccc', borderRadius: 6,
            cursor: isFirst ? 'default' : 'pointer',
            backgroundColor: isFirst ? '#f5f5f5' : '#fff',
            color: isFirst ? '#aaa' : '#333'
          }}
        >
          ← Previous
        </button>

        {isLast ? (
          <button
            onClick={handleFinish}
            style={{
              padding: '10px 28px', backgroundColor: '#2e7d32',
              color: '#fff', border: 'none', borderRadius: 6,
              cursor: 'pointer', fontWeight: 700, fontSize: 15
            }}
          >
            Finish Module ✓
          </button>
        ) : (
          <button
            onClick={() => setCurrent(c => c + 1)}
            style={{
              padding: '10px 24px', backgroundColor: '#3b3b5c',
              color: '#fff', border: 'none', borderRadius: 6,
              cursor: 'pointer'
            }}
          >
            Next →
          </button>
        )}
      </div>
    </PageLayout>
  )
}

export default ModuleViewerPage