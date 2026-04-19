import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import RichTextRenderer from '../components/editor/RichTextRenderer'

const PostTestPage = () => {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  const [questions, setQuestions] = useState([])
  const [config, setConfig] = useState({})
  const [answers, setAnswers] = useState({})
  const [current, setCurrent] = useState(0)
  const [timeLeft, setTimeLeft] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)
  const [previousResult, setPreviousResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const timerRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      // Check if already done
      if (user?.postTestDone) {
        try {
          const res = await api.get('/api/posttest/my-result')
          setPreviousResult(res.data)
        } catch {}
        setLoading(false)
        return
      }

      const res = await api.get('/api/posttest/questions')
      setQuestions(res.data.questions)
      setConfig(res.data.config)
      if (res.data.config.timerMinutes) {
        setTimeLeft(res.data.config.timerMinutes * 60)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  // Timer
  useEffect(() => {
    if (timeLeft === null) return
    if (timeLeft <= 0) {
      handleSubmit()
      return
    }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(timerRef.current)
  }, [timeLeft])

  const handleSubmit = async () => {
    if (submitted) return
    setSubmitted(true)
    clearTimeout(timerRef.current)

    const answersArray = questions.map(q => ({
      questionId: q.id,
      selectedOption: answers[q.id] ?? -1
    }))

    try {
      const res = await api.post('/api/posttest/submit', { answers: answersArray })
      setResult(res.data)
      setUser(prev => ({ ...prev, postTestDone: true }))
    } catch {
      alert('Failed to submit. Please try again.')
      setSubmitted(false)
    }
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const extractText = (json) => {
    if (!json) return ''
    if (json.text) return json.text
    if (json.content) return json.content.map(extractText).join(' ')
    return ''
  }

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>

  // Already done — show previous result
  if (previousResult) {
    return (
      <div style={{ maxWidth: 480, margin: '80px auto', padding: 32, textAlign: 'center' }}>
        <h2 style={{ marginBottom: 8 }}>Post-Test Result</h2>
        <p style={{ color: '#555', marginBottom: 24 }}>You have already completed the post-test.</p>
        <div style={{
          backgroundColor: '#fff', padding: 32, borderRadius: 12,
          border: '1px solid #ddd', marginBottom: 24
        }}>
          <div style={{ fontSize: 48, fontWeight: 700, color: '#3b3b5c', marginBottom: 8 }}>
            {previousResult.score}/{previousResult.maxScore}
          </div>
          <div style={{ fontSize: 16, color: '#555' }}>
            {Math.round((previousResult.score / previousResult.maxScore) * 100)}%
          </div>
        </div>
        <button
          onClick={() => navigate('/student/dashboard')}
          style={{
            padding: '12px 32px', backgroundColor: '#3b3b5c',
            color: '#fff', border: 'none', borderRadius: 8,
            cursor: 'pointer', fontSize: 15
          }}
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  // Result screen after submitting
  if (result) {
    return (
      <div style={{ maxWidth: 480, margin: '80px auto', padding: 32, textAlign: 'center' }}>
        <h2 style={{ marginBottom: 8 }}>Post-Test Complete!</h2>
        <p style={{ color: '#555', marginBottom: 24 }}>Here are your results</p>
        <div style={{
          backgroundColor: '#fff', padding: 32, borderRadius: 12,
          border: '1px solid #ddd', marginBottom: 24
        }}>
          <div style={{ fontSize: 48, fontWeight: 700, color: '#3b3b5c', marginBottom: 8 }}>
            {result.score}/{result.maxScore}
          </div>
          <div style={{ fontSize: 16, color: '#555' }}>
            {Math.round((result.score / result.maxScore) * 100)}%
          </div>
        </div>
        <button
          onClick={() => navigate('/student/dashboard')}
          style={{
            padding: '12px 32px', backgroundColor: '#3b3b5c',
            color: '#fff', border: 'none', borderRadius: 8,
            cursor: 'pointer', fontSize: 15
          }}
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  const question = questions[current]

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: 32 }}>

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 24
      }}>
        <h2 style={{ margin: 0 }}>Post-Test</h2>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {timeLeft !== null && (
            <div style={{
              fontWeight: 700, fontSize: 18,
              color: timeLeft < 60 ? '#c62828' : '#3b3b5c'
            }}>
              ⏱ {formatTime(timeLeft)}
            </div>
          )}
          <div style={{ fontSize: 13, color: '#888' }}>
            {Object.keys(answers).length}/{questions.length} answered
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ backgroundColor: '#eee', borderRadius: 4, height: 6, marginBottom: 24 }}>
        <div style={{
          width: `${((current + 1) / questions.length) * 100}%`,
          backgroundColor: '#3b3b5c', height: '100%', borderRadius: 4,
          transition: 'width 0.3s'
        }} />
      </div>

      {/* Question navigation dots */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
        {questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => setCurrent(i)}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              border: i === current ? '2px solid #3b3b5c' : '1px solid #ddd',
              backgroundColor: answers[q.id] !== undefined
                ? '#3b3b5c' : i === current ? '#e8e8f0' : '#fff',
              color: answers[q.id] !== undefined ? '#fff' : '#333',
              cursor: 'pointer', fontSize: 12, fontWeight: 600
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Question card */}
      {question && (
        <div style={{
          backgroundColor: '#fff', padding: 24, borderRadius: 8,
          border: '1px solid #ddd', marginBottom: 24
        }}>
          <div style={{ fontWeight: 600, marginBottom: 16, fontSize: 15 }}>
            Question {current + 1} of {questions.length}
          </div>
          <div style={{ fontSize: 15, marginBottom: 20 }}>
            <RichTextRenderer content={question.questionText} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {question.options.map((option, i) => (
              <button
                key={i}
                onClick={() => setAnswers(prev => ({ ...prev, [question.id]: i }))}
                style={{
                  textAlign: 'left', padding: '12px 16px',
                  border: `2px solid ${answers[question.id] === i ? '#3b3b5c' : '#ddd'}`,
                  borderRadius: 8, cursor: 'pointer',
                  backgroundColor: answers[question.id] === i ? '#e8e8f0' : '#fff',
                  fontWeight: answers[question.id] === i ? 600 : 400,
                  fontSize: 14
                }}
              >
                <span style={{ marginRight: 10, color: '#888', fontWeight: 600 }}>
                  {['A', 'B', 'C', 'D', 'E'][i]}.
                </span>
                <RichTextRenderer content={option} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => setCurrent(c => c - 1)}
          disabled={current === 0}
          style={{
            padding: '10px 20px', border: '1px solid #ccc',
            borderRadius: 6, cursor: current === 0 ? 'default' : 'pointer',
            backgroundColor: current === 0 ? '#f5f5f5' : '#fff',
            color: current === 0 ? '#aaa' : '#333'
          }}
        >
          ← Previous
        </button>

        {current < questions.length - 1 ? (
          <button
            onClick={() => setCurrent(c => c + 1)}
            style={{
              padding: '10px 20px', backgroundColor: '#3b3b5c',
              color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer'
            }}
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitted}
            style={{
              padding: '10px 24px', backgroundColor: '#2e7d32',
              color: '#fff', border: 'none', borderRadius: 6,
              cursor: 'pointer', fontWeight: 600
            }}
          >
            Submit Test
          </button>
        )}
      </div>
    </div>
  )
}

export default PostTestPage