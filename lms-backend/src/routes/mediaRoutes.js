const express = require('express')
const router = express.Router()
const auth = require('../middleware/authMiddleware')
const role = require('../middleware/roleMiddleware')
const { getMedia, updateMedia } = require('../controllers/mediaController')

router.get('/', auth, getMedia)
router.put('/', auth, role('TEACHER'), updateMedia)

module.exports = router