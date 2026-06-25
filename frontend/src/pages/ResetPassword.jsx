import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import API from '../services/api'

function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const handleReset = async () => {
    if (!password || !confirm) {
      setError('Please fill in all fields.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await API.post('/auth/reset-password', {
        token: token,
        new_password: password
      })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch {
      setError('Invalid or expired token.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#0c1322' }}>
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px]" style={{ background: 'rgba(173,198,255,0.1)' }}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px]" style={{ background: 'rgba(78,222,163,0.05)' }}></div>
      </div>

      <main className="relative z-10 w-full max-w-md px-6 py-12">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-xl border shadow-2xl" style={{ background: '#232a3a', borderColor: 'rgba(66,71,84,0.2)' }}>
            <span className="material-symbols-outlined text-4xl" style={{ color: '#adc6ff' }}>lock_reset</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tighter uppercase" style={{ color: '#dce2f7', fontFamily: 'Space Grotesk, sans-serif' }}>LAZARUS</h1>
          <p className="text-sm mt-1" style={{ color: '#c2c6d6' }}>Reset your password</p>
        </div>

        <section className="p-8 rounded-xl shadow-2xl border" style={{ background: 'rgba(20,27,43,0.8)', borderColor: 'rgba(66,71,84,0.1)' }}>
          {success ? (
            <div className="text-center space-y-4">
              <span className="material-symbols-outlined text-5xl" style={{ color: '#4edea3' }}>check_circle</span>
              <h2 className="text-xl font-bold" style={{ color: '#dce2f7', fontFamily: 'Space Grotesk, sans-serif' }}>Password Reset!</h2>
              <p className="text-sm" style={{ color: '#94a3b8' }}>Your password has been updated. Redirecting to login...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {!token && (
                <p className="text-red-400 text-sm text-center">Invalid reset link. Please request a new one.</p>
              )}
              {error && <p className="text-red-400 text-sm text-center">{error}</p>}

              <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="block w-full px-4 pr-12 py-3 rounded-lg text-sm outline-none"
                    style={{ background: '#1e293b', color: '#dce2f7' }}
                />
                <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-lg cursor-pointer"
                    style={{ color: showPassword ? '#adc6ff' : '#64748b' }}>
                    {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </div>

              <div className="relative">
                <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    className="block w-full px-4 pr-12 py-3 rounded-lg text-sm outline-none"
                    style={{ background: '#1e293b', color: '#dce2f7' }}
                />
                <span
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-lg cursor-pointer"
                    style={{ color: showConfirm ? '#adc6ff' : '#64748b' }}>
                    {showConfirm ? 'visibility_off' : 'visibility'}
                </span>
              </div>

              <button
                onClick={handleReset}
                disabled={loading || !token}
                className="w-full py-3.5 px-4 rounded-lg font-bold text-sm tracking-wide transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
                style={{ background: 'linear-gradient(to right, #4d8eff, #adc6ff)', color: '#002e6a' }}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>

              <div className="text-center">
                <span onClick={() => navigate('/login')} className="text-xs cursor-pointer" style={{ color: '#adc6ff', fontFamily: 'JetBrains Mono, monospace' }}>
                  ← Back to Login
                </span>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default ResetPassword