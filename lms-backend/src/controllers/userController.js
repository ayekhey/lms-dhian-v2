const bcrypt = require('bcryptjs')
const prisma = require('../prismaClient')

const getStudents = async (req, res) => {
  try {
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        tier: true,
        diagnosticDone: true,
        postTestDone: true,
        createdAt: true
      }
    })
    res.json(students)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

const createStudent = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' })
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(400).json({ error: 'Email already in use' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const student = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'STUDENT'
      }
    })

    res.status(201).json({
      id: student.id,
      name: student.name,
      email: student.email,
      role: student.role
    })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

const resetPassword = async (req, res) => {
  const { id } = req.params
  const { password } = req.body

  if (!password) {
    return res.status(400).json({ error: 'New password is required' })
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10)
    await prisma.user.update({
      where: { id },
      data: { passwordHash }
    })
    res.json({ message: 'Password reset successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

const resetDiagnostic = async (req, res) => {
  const { id } = req.params

  try {
    await prisma.user.update({
      where: { id },
      data: {
        diagnosticDone: false,
        tier: null
      }
    })
    res.json({ message: 'Pre-test reset successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

const resetPostTest = async (req, res) => {
  const { id } = req.params

  try {
    await prisma.user.update({
      where: { id },
      data: { postTestDone: false }
    })
    res.json({ message: 'Post-test reset successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

const deleteStudent = async (req, res) => {
  const { id } = req.params

  try {
    await prisma.user.delete({ where: { id } })
    res.json({ message: 'Student deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

module.exports = {
  getStudents,
  createStudent,
  resetPassword,
  resetDiagnostic,
  resetPostTest,
  deleteStudent
}