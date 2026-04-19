import Sidebar from './Sidebar'

const PageLayout = ({ children, title }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
        {title && (
          <h1 style={{ marginTop: 0, marginBottom: 24, fontSize: 24, fontWeight: 700 }}>
            {title}
          </h1>
        )}
        {children}
      </div>
    </div>
  )
}

export default PageLayout