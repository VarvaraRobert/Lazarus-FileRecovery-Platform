import { useState, useEffect } from 'react'
import { useSessionTimeout } from '../hooks/useSessionTimeout'

function SessionWarning() {
  const [showWarning, setShowWarning] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const { setWarningCallback } = useSessionTimeout()

  useEffect(() => {
    setWarningCallback(() => {
      setShowWarning(true)
      setCountdown(60)
    })
  }, [])

  useEffect(() => {
    if (!showWarning) return
    if (countdown <= 0) {
      setShowWarning(false)
      return
    }
    const interval = setInterval(() => {
      setCountdown(prev => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [showWarning, countdown])

  const handleStayLoggedIn = () => {
    setShowWarning(false)
    setCountdown(60)
  }

  const token = localStorage.getItem('token')
  if (!token) return null
  if (!showWarning) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div className="rounded-2xl p-8 max-w-sm w-full mx-4 border" style={{ backgroundColor: '#141b2b', borderColor: 'rgba(255,179,173,0.3)' }}>
        <div className="flex items-center gap-3 mb-4">
          <span className="material-symbols-outlined text-3xl" style={{ color: '#ffb3ad' }}>timer</span>
          <h2 className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#dce2f7' }}>
            Session Expiring
          </h2>
        </div>
        <p className="text-sm mb-2" style={{ color: '#94a3b8' }}>
          Your session will expire due to inactivity.
        </p>
        <div className="text-4xl font-bold text-center my-6" style={{ fontFamily: 'JetBrains Mono, monospace', color: countdown <= 10 ? '#ff5451' : '#ffb3ad' }}>
          {countdown}s
        </div>
        <button
          onClick={handleStayLoggedIn}
          className="w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
          style={{ backgroundColor: '#adc6ff', color: '#002e6a' }}>
          Stay Logged In
        </button>
      </div>
    </div>
  )
}

export default SessionWarning