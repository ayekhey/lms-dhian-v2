const prisma = require('../prismaClient')

// MODULES
const getModules = async (req, res) => {
  try {
    const modules = await prisma.module.findMany({
      orderBy: { order: 'asc' },
      include: {
        topics: {
          orderBy: { topicNumber: 'asc' },
          select: { id: true, title: true, topicNumber: true }
        }
      }
    })
    res.json(modules)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

const createModule = async (req, res) => {
  const { title, description } = req.body

  if (!title) {
    return res.status(400).json({ error: 'Title is required' })
  }

  try {
    const count = await prisma.module.count()
    const module = await prisma.module.create({
      data: {
        title,
        description: description || null,
        order: count,
        createdById: req.user.id
      }
    })
    res.status(201).json(module)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

const updateModule = async (req, res) => {
  const { id } = req.params
  const { title, description } = req.body

  try {
    const module = await prisma.module.update({
      where: { id },
      data: { title, description }
    })
    res.json(module)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

const deleteModule = async (req, res) => {
  const { id } = req.params

  try {
    await prisma.topic.deleteMany({ where: { moduleId: id } })
    await prisma.module.delete({ where: { id } })
    res.json({ message: 'Module deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

// TOPICS
const getTopics = async (req, res) => {
  const { id } = req.params

  try {
    const topics = await prisma.topic.findMany({
      where: { moduleId: id },
      orderBy: { topicNumber: 'asc' }
    })
    res.json(topics)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

const createTopic = async (req, res) => {
  const { id } = req.params
  const { title } = req.body

  if (!title) {
    return res.status(400).json({ error: 'Title is required' })
  }

  try {
    const count = await prisma.topic.count({ where: { moduleId: id } })

    const topic = await prisma.topic.create({
      data: {
        moduleId: id,
        title,
        topicNumber: count + 1,
        blocks: [
          {
            id: crypto.randomUUID(),
            type: 'main',
            content: {
              type: 'doc',
              content: [{ type: 'paragraph' }]
            }
          }
        ]
      }
    })
    res.status(201).json(topic)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

const updateTopic = async (req, res) => {
  const { topicId } = req.params
  const { title, blocks } = req.body

  try {
    const topic = await prisma.topic.update({
      where: { id: topicId },
      data: { title, blocks }
    })
    res.json(topic)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

const deleteTopic = async (req, res) => {
  const { topicId } = req.params

  try {
    await prisma.topic.delete({ where: { id: topicId } })
    res.json({ message: 'Topic deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

module.exports = {
  getModules,
  createModule,
  updateModule,
  deleteModule,
  getTopics,
  createTopic,
  updateTopic,
  deleteTopic
}