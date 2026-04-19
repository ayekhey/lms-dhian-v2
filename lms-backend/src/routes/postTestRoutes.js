const express = require('express')
const router = express.Router()
const auth = require('../middleware/authMiddleware')
const role = require('../middleware/roleMiddleware')
const {
  getQuestionsForStudent,
  submitPostTest,
  getMyResult,
  getConfigRoute,
  updateConfig,
  getResults,
  exportResults
} = require('../controllers/postTestController')

router.get('/questions', auth, role('STUDENT'), getQuestionsForStudent)
router.post('/submit', auth, role('STUDENT'), submitPostTest)
router.get('/my-result', auth, role('STUDENT'), getMyResult)
router.get('/config', auth, getConfigRoute)
router.put('/config', auth, role('TEACHER'), updateConfig)
router.get('/results', auth, role('TEACHER'), getResults)
router.get('/results/export', auth, role('TEACHER'), exportResults)

module.exports = router