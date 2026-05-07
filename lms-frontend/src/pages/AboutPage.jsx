import PageLayout from '../components/PageLayout'

const team = [
  {
    name: 'Dhian Andriani',
    faculty: 'Magister Pendidikan Fisika',
    university: 'Universitas Negeri Jakarta',
    color: '#3b3b5c',
    image: '/public/dhian.png'
  },
  {
    name: 'Dr. rer. nat. Bambang Heru Iswanto, M.Si',
    faculty: 'Magister Pendidikan Fisika',
    university: 'Universitas Negeri Jakarta',
    color: '#1565c0',
    image: '/public/bambang.png'
  },
  {
    name: 'Prof. Dr. Esmar Budi, S.Si,. M.T',
    faculty: 'Magister Pendidikan Fisika',
    university: 'Universitas Negeri Jakarta',
    color: '#2e7d32',
    image: '/public/esmar.png'
  }
]

const AboutPage = () => {
  return (
    <PageLayout title="About Us">

      {/* App info */}
      <div style={{
        backgroundColor: '#fff', padding: 24, borderRadius: 12,
        border: '1px solid #ddd', marginBottom: 48,
        display: 'flex', alignItems: 'center', gap: 16, maxWidth: 500
      }}>
        <img
          src="/favicon.png"
          alt="GYROSCOPE 361"
          style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }}
        />
        <div>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>GYROSCOPE 361</div>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 2 }}>Learning Management System</div>
          <div style={{ fontSize: 12, color: '#aaa' }}>Version 2.2</div>
        </div>
      </div>

      {/* Developers label */}
      <div style={{
        fontSize: 13, fontWeight: 600, color: '#aaa',
        letterSpacing: '0.08em', textTransform: 'uppercase',
        marginBottom: 24
      }}>
        Developers
      </div>

      {/* Team grid — side by side */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: 32, justifyContent: 'center' }}>
        {team.map((member, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 28 }}>

            {/* Photo */}
            <div style={{
              width: 136, height: 204, flexShrink: 0,
              borderRadius: 10, overflow: 'hidden',
              backgroundColor: '#f0f0f0'
            }}>
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                />
              ) : (
                <div style={{
                  width: '100%', height: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: member.color
                }}>
                  <span style={{ fontSize: 48, fontWeight: 700, color: '#fff' }}>
                    {member.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <div style={{ width: 32, height: 3, backgroundColor: member.color, borderRadius: 2, marginBottom: 10 }} />
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>
                {member.name}
              </div>
              <div style={{
                display: 'inline-block', padding: '2px 10px',
                backgroundColor: '#f0f0f0', borderRadius: 20,
                fontSize: 11, fontWeight: 600, color: '#555',
                marginBottom: 12
              }}>
                {member.role}
              </div>
              <div style={{ fontSize: 13, color: '#555', marginBottom: 4 }}>
                📚 {member.faculty}
              </div>
              <div style={{ fontSize: 13, color: '#888' }}>
                🏛️ {member.university}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: 56, padding: '14px 20px',
        backgroundColor: '#f8f8f8', borderRadius: 8,
        border: '1px solid #eee',
        fontSize: 12, color: '#aaa', textAlign: 'center'
      }}>
        GYROSCOPE 361 © {new Date().getFullYear()} — All rights reserved
      </div>

    </PageLayout>
  )
}

export default AboutPage