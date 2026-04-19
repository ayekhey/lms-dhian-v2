const prisma = require('../prismaClient')

const getQuestionsForStudent = async (req, res) => {
  try {
    const config = await getConfig()
    let questions = await prisma.diagnosticQuestion.findMany()

    if (config.randomize) {
      questions = questions.sort(() => Math.random() - 0.5)
      questions = questions.map(q => ({
        ...q,
        options: [...q.options].sort(() => Math.random() - 0.5)
      }))
    }

    res.json({ questions, config })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

const submitPostTest = async (req, res) => {
  const { answers } = req.body

  try {
    const questions = await prisma.diagnosticQuestion.findMany()
    const config = await getConfig()
    const total = questions.length

    let score = 0
    const answerDetails = questions.map((q, index) => {
      const answer = answers.find(a => a.questionId === q.id)
      const selected = answer?.selectedOption ?? -1
      const correct = selected === q.correctOption
      if (correct) score++
      return {
        questionNumber: index + 1,
        questionId: q.id,
        selectedOption: selected,
        correctOption: q.correctOption,
        correct
      }
    })

    const maxScore = config.maxScore || total
    const scaledScore = total > 0 ? Math.round((score / total) * maxScore) : 0

    await prisma.postTestResult.create({
      data: {
        studentId: req.user.id,
        score: scaledScore,
        maxScore,
        answers: answerDetails
      }
    })

    await prisma.user.update({
      where: { id: req.user.id },
      data: { postTestDone: true }
    })

    res.json({ score: scaledScore, maxScore })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

const getMyResult = async (req, res) => {
  try {
    const result = await prisma.postTestResult.findFirst({
      where: { studentId: req.user.id },
      orderBy: { submittedAt: 'desc' }
    })

    if (!result) {
      return res.status(404).json({ error: 'No result found' })
    }

    res.json(result)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

const getConfig = async () => {
  const configs = await prisma.systemConfig.findMany({
    where: {
      key: {
        in: [
          'post_test_timer_minutes',
          'post_test_randomize',
          'post_test_max_score'
        ]
      }
    }
  })

  const map = {}
  configs.forEach(c => { map[c.key] = c.value })

  return {
    timerMinutes: map['post_test_timer_minutes']
      ? parseInt(map['post_test_timer_minutes'])
      : null,
    randomize: map['post_test_randomize'] === 'true',
    maxScore: map['post_test_max_score']
      ? parseInt(map['post_test_max_score'])
      : null
  }
}

const getConfigRoute = async (req, res) => {
  try {
    const config = await getConfig()
    res.json(config)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

const updateConfig = async (req, res) => {
  const { timerMinutes, randomize, maxScore } = req.body

  try {
    const upsert = async (key, value) => {
      await prisma.systemConfig.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      })
    }

    if (timerMinutes !== undefined)
      await upsert('post_test_timer_minutes', timerMinutes ?? '')
    if (randomize !== undefined)
      await upsert('post_test_randomize', randomize)
    if (maxScore !== undefined)
      await upsert('post_test_max_score', maxScore ?? '')

    res.json({ message: 'Config updated' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

const getResults = async (req, res) => {
  try {
    const results = await prisma.postTestResult.findMany({
      orderBy: { submittedAt: 'desc' },
      include: {
        student: {
          select: { name: true, email: true, tier: true }
        }
      }
    })
    res.json(results)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

const exportResults = async (req, res) => {
  try {
    const results = await prisma.postTestResult.findMany({
      orderBy: { submittedAt: 'desc' },
      include: {
        student: { select: { name: true, email: true, tier: true } }
      }
    })

    const maxQ = results.reduce((max, r) => {
      const len = Array.isArray(r.answers) ? r.answers.length : 0
      return Math.max(max, len)
    }, 0)

    const qHeaders = Array.from({ length: maxQ }, (_, i) => `Q${i + 1}`)

    const rows = [
      ['Student Name', 'Email', 'Tier', 'Score', 'Max Score', 'Date', ...qHeaders],
      ...results.map(r => {
        const qCols = Array.from({ length: maxQ }, (_, i) => {
          const a = Array.isArray(r.answers) ? r.answers[i] : null
          if (!a) return ''
          return a.correct ? '1 (correct)' : '0 (incorrect)'
        })
        return [
          r.student.name,
          r.student.email,
          r.student.tier,
          r.score,
          r.maxScore,
          r.submittedAt.toISOString().split('T')[0],
          ...qCols
        ]
      })
    ]

    const csv = rows.map(r => r.join(',')).join('\n')
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename=posttest-results.csv')
    res.send(csv)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

module.exports = {
  getQuestionsForStudent,
  submitPostTest,
  getMyResult,
  getConfigRoute,
  updateConfig,
  getResults,
  exportResults
}