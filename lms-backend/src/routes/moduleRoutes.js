const express = require('express')
const router = express.Router()
const auth = require('../middleware/authMiddleware')
const role = require('../middleware/roleMiddleware')
const {
  getModules,
  createModule,
  updateModule,
  deleteModule,
  getTopics,
  createTopic,
  updateTopic,
  deleteTopic
} = require('../controllers/moduleController')

router.get('/', auth, getModules)
router.post('/', auth, role('TEACHER'), createModule)
router.put('/:id', auth, role('TEACHER'), updateModule)
router.delete('/:id', auth, role('TEACHER'), deleteModule)

router.get('/:id/topics', auth, getTopics)
router.post('/:id/topics', auth, role('TEACHER'), createTopic)
router.put('/:id/topics/:topicId', auth, role('TEACHER'), updateTopic)
router.delete('/:id/topics/:topicId', auth, role('TEACHER'), deleteTopic)

module.exports = router