const prisma = require('../prismaClient')

const getMedia = async (req, res) => {
  try {
    const media = await prisma.mediaContent.findFirst()
    res.json(media || { content: null })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

const updateMedia = async (req, res) => {
  const { content } = req.body

  try {
    const existing = await prisma.mediaContent.findFirst()

    if (existing) {
      const updated = await prisma.mediaContent.update({
        where: { id: existing.id },
        data: { content }
      })
      res.json(updated)
    } else {
      const created = await prisma.mediaContent.create({
        data: { content }
      })
      res.json(created)
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

module.exports = { getMedia, updateMedia }