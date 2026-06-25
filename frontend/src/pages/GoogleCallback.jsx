import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

function GoogleCallback() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    if (token) {
      localStorage.setItem('token', token)
      navigate('/dashboard')
    } else {
      navigate('/login')
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0c1322' }}>
      <div className="text-center">
        <span className="material-symbols-outlined text-5xl mb-4 block" style={{ color: '#3b82f6' }}>sync</span>
        <p className="text-sm" style={{ color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>Authenticating with Google...</p>
      </div>
    </div>
  )
}

export default GoogleCallback