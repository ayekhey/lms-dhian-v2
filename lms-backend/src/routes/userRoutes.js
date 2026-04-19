const express = require('express')
const router = express.Router()
const auth = require('../middleware/authMiddleware')
const role = require('../middleware/roleMiddleware')
const {
  getStudents,
  createStudent,
  resetPassword,
  resetDiagnostic,
  resetPostTest,
  deleteStudent
} = require('../controllers/userController')

router.get('/students', auth, role('TEACHER'), getStudents)
router.post('/students', auth, role('TEACHER'), createStudent)
router.put('/students/:id/reset-password', auth, role('TEACHER'), resetPassword)
router.put('/students/:id/reset-diagnostic', auth, role('TEACHER'), resetDiagnostic)
router.put('/students/:id/reset-posttest', auth, role('TEACHER'), resetPostTest)
router.delete('/students/:id', auth, role('TEACHER'), deleteStudent)

module.exports = router