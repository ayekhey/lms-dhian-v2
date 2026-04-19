const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const moduleRoutes = require('./routes/moduleRoutes')
const diagnosticRoutes = require('./routes/diagnosticRoutes')
const postTestRoutes = require('./routes/postTestRoutes')
const mediaRoutes = require('./routes/mediaRoutes')

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))

app.use(express.json({ limit: '10mb' }))

app.get('/', (req, res) => {
  res.json({ message: 'LMS Dhian API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/modules', moduleRoutes)
app.use('/api/diagnostic', diagnosticRoutes)
app.use('/api/posttest', postTestRoutes)
app.use('/api/media', mediaRoutes)

module.exports = app