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

const getQuestionsForTeacher = async (req, res) => {
  try {
    const questions = await prisma.diagnosticQuestion.findMany({
      orderBy: { createdAt: 'asc' }
    })
    res.json(questions)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

const createQuestion = async (req, res) => {
  const { questionText, options, correctOption } = req.body

  if (!questionText || !options || correctOption === undefined) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    const question = await prisma.diagnosticQuestion.create({
      data: { questionText, options, correctOption }
    })
    res.status(201).json(question)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

const deleteQuestion = async (req, res) => {
  const { id } = req.params

  try {
    await prisma.diagnosticQuestion.delete({ where: { id } })
    res.json({ message: 'Question deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

const submitDiagnostic = async (req, res) => {
  const { answers } = req.body

  try {
    const questions = await prisma.diagnosticQuestion.findMany()
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

    const percentage = total > 0 ? (score / total) * 100 : 0
    let tier = 3
    if (percentage >= 70) tier = 1
    else if (percentage >= 40) tier = 2

    await prisma.diagnosticResult.create({
      data: {
        studentId: req.user.id,
        score,
        total,
        tier,
        answers: answerDetails
      }
    })

    await prisma.user.update({
      where: { id: req.user.id },
      data: { diagnosticDone: true, tier }
    })

    res.json({ score, total, tier })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

const getConfig = async () => {
  const configs = await prisma.systemConfig.findMany({
    where: {
      key: {
        in: [
          'pre_test_timer_minutes',
          'pre_test_randomize',
          'pre_test_max_score'
        ]
      }
    }
  })

  const map = {}
  configs.forEach(c => { map[c.key] = c.value })

  return {
    timerMinutes: map['pre_test_timer_minutes']
      ? parseInt(map['pre_test_timer_minutes'])
      : null,
    randomize: map['pre_test_randomize'] === 'true',
    maxScore: map['pre_test_max_score']
      ? parseInt(map['pre_test_max_score'])
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
      await upsert('pre_test_timer_minutes', timerMinutes ?? '')
    if (randomize !== undefined)
      await upsert('pre_test_randomize', randomize)
    if (maxScore !== undefined)
      await upsert('pre_test_max_score', maxScore ?? '')

    res.json({ message: 'Config updated' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

const getResults = async (req, res) => {
  try {
    const results = await prisma.diagnosticResult.findMany({
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
    const results = await prisma.diagnosticResult.findMany({
      orderBy: { submittedAt: 'desc' },
      include: {
        student: { select: { name: true, email: true } }
      }
    })

    // Find max number of questions
    const maxQ = results.reduce((max, r) => {
      const len = Array.isArray(r.answers) ? r.answers.length : 0
      return Math.max(max, len)
    }, 0)

    // Build question headers
    const qHeaders = Array.from({ length: maxQ }, (_, i) => `Q${i + 1}`)

    const rows = [
      ['Student Name', 'Email', 'Tier', 'Score', 'Total', 'Date', ...qHeaders],
      ...results.map(r => {
        const qCols = Array.from({ length: maxQ }, (_, i) => {
          const a = Array.isArray(r.answers) ? r.answers[i] : null
          if (!a) return ''
          return a.correct ? '1 (correct)' : '0 (incorrect)'
        })
        return [
          r.student.name,
          r.student.email,
          r.tier,
          r.score,
          r.total,
          r.submittedAt.toISOString().split('T')[0],
          ...qCols
        ]
      })
    ]

    const csv = rows.map(r => r.join(',')).join('\n')
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename=pretest-results.csv')
    res.send(csv)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

module.exports = {
  getQuestionsForStudent,
  getQuestionsForTeacher,
  createQuestion,
  deleteQuestion,
  submitDiagnostic,
  getConfigRoute,
  updateConfig,
  getResults,
  exportResults
}