const express = require('express')
const router = express.Router()
const auth = require('../middleware/authMiddleware')
const role = require('../middleware/roleMiddleware')
const {
  getQuestionsForStudent,
  getQuestionsForTeacher,
  createQuestion,
  deleteQuestion,
  submitDiagnostic,
  getConfigRoute,
  updateConfig,
  getResults,
  exportResults
} = require('../controllers/diagnosticController')

router.get('/questions', auth, role('STUDENT'), getQuestionsForStudent)
router.get('/manage', auth, role('TEACHER'), getQuestionsForTeacher)
router.post('/questions', auth, role('TEACHER'), createQuestion)
router.delete('/questions/:id', auth, role('TEACHER'), deleteQuestion)
router.post('/submit', auth, role('STUDENT'), submitDiagnostic)
router.get('/config', auth, getConfigRoute)
router.put('/config', auth, role('TEACHER'), updateConfig)
router.get('/results', auth, role('TEACHER'), getResults)
router.get('/results/export', auth, role('TEACHER'), exportResults)

module.exports = router