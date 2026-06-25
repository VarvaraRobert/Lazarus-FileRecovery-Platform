import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'

function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRegister = async () => {
    try {
      await API.post('/auth/register', { username, email, password })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{backgroundColor: '#0c1322', color: '#dce2f7'}}>
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full blur-[120px]" style={{background: 'rgba(173,198,255,0.1)'}}></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full blur-[100px]" style={{background: 'rgba(78,222,163,0.05)'}}></div>
      </div>

      <main className="relative z-10 flex-grow flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-xl border shadow-2xl" style={{borderColor: 'rgba(66,71,84,0.1)'}}>
          
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-12 relative overflow-hidden border-r" style={{backgroundColor: '#141b2b', borderColor: 'rgba(66,71,84,0.1)'}}>
            <div className="relative z-10">
              <div className="text-2xl font-bold tracking-tighter mb-12" style={{color: '#adc6ff', fontFamily: 'Space Grotesk, sans-serif'}}>LAZARUS</div>
              <h1 className="text-4xl font-bold leading-tight mb-6" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
                Secure Access to <br/>
                <span style={{color: '#4edea3'}}>Digital Truth.</span>
              </h1>
              <p className="leading-relaxed max-w-xs" style={{color: '#c2c6d6'}}>
                Enter the forensic layer. Our environment is secured with end-to-end encryption for all investigative data.
              </p>
            </div>
            <div className="relative z-10 mt-12">
              <div className="p-4 rounded-lg border" style={{backgroundColor: '#232a3a', borderColor: 'rgba(66,71,84,0.05)'}}>
                <div className="flex gap-2 items-center mb-2" style={{color: '#adc6ff'}}>
                  <span className="material-symbols-outlined text-sm">shield</span>
                  <span className="text-xs uppercase tracking-tighter" style={{fontFamily: 'JetBrains Mono, monospace'}}>System Integrity</span>
                </div>
                <div className="h-1 w-full rounded-full overflow-hidden" style={{backgroundColor: '#2e3545'}}>
                  <div className="h-full rounded-full" style={{width: '100%', backgroundColor: '#00a572'}}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center p-8 md:p-16 lg:p-20" style={{backgroundColor: '#191f2f'}}>
            <div className="max-w-md mx-auto lg:mx-0 w-full">
              <header className="mb-10">
                <h2 className="text-2xl font-semibold mb-2" style={{fontFamily: 'Space Grotesk, sans-serif'}}>Initialize Account</h2>
                <p className="text-sm" style={{color: '#c2c6d6'}}>Create your forensic investigator credentials.</p>
              </header>

              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest flex justify-between" style={{color: '#64748b', fontFamily: 'JetBrains Mono, monospace'}}>
                    <span>Username</span>
                    <span style={{color: 'rgba(173,198,255,0.4)'}}>Unique Identifier</span>
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{color: '#64748b'}}>person</span>
                    <input
                      type="text"
                      placeholder="investigator_01"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-lg text-sm outline-none"
                      style={{backgroundColor: '#2e3545', color: '#dce2f7', border: '1px solid rgba(66,71,84,0.1)'}}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest" style={{color: '#64748b', fontFamily: 'JetBrains Mono, monospace'}}>Official Email</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{color: '#64748b'}}>mail</span>
                    <input
                      type="email"
                      placeholder="name@agency.gov"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-lg text-sm outline-none"
                      style={{backgroundColor: '#2e3545', color: '#dce2f7', border: '1px solid rgba(66,71,84,0.1)'}}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest" style={{color: '#64748b', fontFamily: 'JetBrains Mono, monospace'}}>Password</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{color: '#64748b'}}>lock</span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 rounded-lg text-sm outline-none"
                      style={{backgroundColor: '#2e3545', color: '#dce2f7', border: '1px solid rgba(66,71,84,0.1)'}}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-lg cursor-pointer transition-colors"
                      style={{color: showPassword ? '#adc6ff' : '#64748b'}}>
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleRegister}
                    className="w-full py-4 font-bold rounded-lg transition-all shadow-lg"
                    style={{background: 'linear-gradient(to right, #adc6ff, #4d8eff)', color: '#002e6a', fontFamily: 'Space Grotesk, sans-serif'}}>
                    Register Investigator
                  </button>
                </div>
              </div>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" style={{borderColor: 'rgba(66,71,84,0.1)'}}></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 text-xs uppercase tracking-widest" style={{backgroundColor: '#191f2f', color: '#64748b', fontFamily: 'JetBrains Mono, monospace'}}>Federated Identity</span>
                </div>
              </div>

              <button
                onClick={() => window.location.href = 'http://localhost:8000/auth/google/login'}
                className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-lg text-sm font-medium transition-colors border"
                style={{backgroundColor: '#232a3a', borderColor: 'rgba(66,71,84,0.1)', color: '#dce2f7'}}>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Register with Google OAuth2
              </button>

              <footer className="mt-10 text-center">
                <p className="text-sm" style={{color: '#64748b'}}>
                  Already part of the team?{' '}
                  <span onClick={() => navigate('/login')} className="font-semibold cursor-pointer hover:underline" style={{color: '#adc6ff'}}>Login here</span>
                </p>
              </footer>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 w-full py-8 border-t" style={{backgroundColor: '#0c1322', borderColor: 'rgba(66,71,84,0.1)'}}>
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-xs uppercase tracking-tighter" style={{color: '#64748b', fontFamily: 'JetBrains Mono, monospace'}}>© 2026 LAZARUS FORENSICS. ALL DATA ENCRYPTED.</span>
          <div className="flex flex-wrap justify-center gap-8">
            <a href="#" className="text-xs uppercase tracking-tighter" style={{color: '#475569', fontFamily: 'JetBrains Mono, monospace'}}>Privacy Policy</a>
            <a href="#" className="text-xs uppercase tracking-tighter" style={{color: '#475569', fontFamily: 'JetBrains Mono, monospace'}}>Terms of Service</a>
            <a href="#" className="text-xs uppercase tracking-tighter" style={{color: '#475569', fontFamily: 'JetBrains Mono, monospace'}}>API Documentation</a>
            <a href="#" className="text-xs uppercase tracking-tighter" style={{color: '#475569', fontFamily: 'JetBrains Mono, monospace'}}>Support Portal</a>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{backgroundColor: '#4edea3'}}></div>
            <span className="text-xs uppercase tracking-widest" style={{color: '#64748b', fontFamily: 'JetBrains Mono, monospace'}}>Node Secure</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Register