const getEmbedUrl = (url) => {
  if (!url) return null

  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }

  return url
}

const VideoBlock = ({ src }) => {
  const embedUrl = getEmbedUrl(src)

  if (!embedUrl) return <div style={{ color: '#aaa' }}>Invalid video URL</div>

  return (
    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, marginBottom: 16 }}>
      <iframe
        src={embedUrl}
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          border: 'none',
          borderRadius: 8
        }}
        allowFullScreen
      />
    </div>
  )
}

export default VideoBlock