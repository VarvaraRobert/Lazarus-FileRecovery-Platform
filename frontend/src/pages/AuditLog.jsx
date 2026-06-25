import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'
import { useApp } from '../context/AppContext'
import NotificationPanel from '../components/NotificationPanel'

const translations = {
  en: {
    dashboard: 'Dashboard', evidence: 'Evidence', reports: 'Reports', archives: 'Archives',
    logout: 'Logout', title: 'AUDIT', titleAccent: 'LOG',
    subtitle: 'Complete history of all user actions and system events.',
    searchPlaceholder: 'Search logs...', allActions: 'All Actions',
    timestamp: 'Timestamp', action: 'Action', details: 'Details',
    loading: 'Loading logs...', noLogs: 'No audit logs found.',
    totalEvents: 'Total Events', todayEvents: 'Today', lastAction: 'Last Action',
    overview: 'Overview', fileRecovery: 'File Recovery', hexViewer: 'Hex Viewer',
    auditLog: 'Audit Log', newScan: 'NEW SCAN',
  },
  de: {
    dashboard: 'Armaturenbrett', evidence: 'Beweise', reports: 'Berichte', archives: 'Archive',
    logout: 'Abmelden', title: 'PRÜF', titleAccent: 'PROTOKOLL',
    subtitle: 'Vollständige Historie aller Benutzeraktionen und Systemereignisse.',
    searchPlaceholder: 'Protokolle suchen...', allActions: 'Alle Aktionen',
    timestamp: 'Zeitstempel', action: 'Aktion', details: 'Details',
    loading: 'Protokolle werden geladen...', noLogs: 'Keine Protokolle gefunden.',
    totalEvents: 'Ereignisse gesamt', todayEvents: 'Heute', lastAction: 'Letzte Aktion',
    overview: 'Übersicht', fileRecovery: 'Dateiwiederherstellung', hexViewer: 'Hex-Viewer',
    auditLog: 'Prüfprotokoll', newScan: 'NEUER SCAN',
  },
  fr: {
    dashboard: 'Tableau de bord', evidence: 'Preuves', reports: 'Rapports', archives: 'Archives',
    logout: 'Déconnexion', title: 'JOURNAL', titleAccent: "D'AUDIT",
    subtitle: 'Historique complet de toutes les actions utilisateur et événements système.',
    searchPlaceholder: 'Rechercher dans les logs...', allActions: 'Toutes les actions',
    timestamp: 'Horodatage', action: 'Action', details: 'Détails',
    loading: 'Chargement des logs...', noLogs: 'Aucun log trouvé.',
    totalEvents: 'Événements totaux', todayEvents: "Aujourd'hui", lastAction: 'Dernière action',
    overview: 'Aperçu', fileRecovery: 'Récupération', hexViewer: 'Visionneuse Hex',
    auditLog: "Journal d'audit", newScan: 'NOUVEAU SCAN',
  }
}

const actionColors = {
  LOGIN: { color: '#4edea3', bg: 'rgba(78,222,163,0.1)', border: 'rgba(78,222,163,0.2)' },
  REGISTER: { color: '#adc6ff', bg: 'rgba(173,198,255,0.1)', border: 'rgba(173,198,255,0.2)' },
  SCAN_STARTED: { color: '#ffb3ad', bg: 'rgba(255,179,173,0.1)', border: 'rgba(255,179,173,0.2)' },
  SCAN_COMPLETE: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' },
  CASE_CREATED: { color: '#4edea3', bg: 'rgba(78,222,163,0.1)', border: 'rgba(78,222,163,0.2)' },
  CASE_DELETED: { color: '#ff5451', bg: 'rgba(255,84,81,0.1)', border: 'rgba(255,84,81,0.2)' },
}

function AuditLog() {
  const [user, setUser] = useState(null)
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()
  const { theme, language } = useApp()
  const t = translations[language] || translations.en
  const isDark = theme === 'dark'
  const bg = isDark ? '#0c1322' : '#f1f5f9'
  const card = isDark ? '#141b2b' : '#ffffff'
  const text = isDark ? '#dce2f7' : '#1e293b'
  const subtext = isDark ? '#64748b' : '#94a3b8'
  const border = isDark ? 'rgba(66,71,84,0.2)' : 'rgba(0,0,0,0.08)'
  const tableHeader = isDark ? 'rgba(15,23,42,0.5)' : 'rgba(0,0,0,0.03)'

  useEffect(() => {
    const init = async () => {
      try {
        const res = await API.get('/api/me')
        setUser(res.data)
        const logsRes = await API.get('/audit/logs')
        setLogs(logsRes.data)
      } catch {
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const today = new Date().toISOString().slice(0, 10)

  const filtered = logs.filter(l => {
    const matchSearch = l.action?.toLowerCase().includes(search.toLowerCase()) ||
      l.details?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || l.action === filter
    return matchSearch && matchFilter
  })

  const getActionStyle = (action) => actionColors[action] || { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)' }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: bg, color: text }}>

      <header className="flex justify-between items-center w-full px-6 py-4 z-50 shadow-xl sticky top-0" style={{ backgroundColor: bg }}>
        <div className="flex items-center gap-8">
          <span className="text-2xl font-bold tracking-tighter" style={{ color: '#3b82f6', fontFamily: 'Space Grotesk, sans-serif' }}>LAZARUS</span>
          <nav className="hidden md:flex gap-6">
            <a className="transition-colors" style={{ color: subtext }} onClick={() => navigate('/dashboard')} href="#">{t.dashboard}</a>
            <a className="transition-colors" style={{ color: subtext }} onClick={() => navigate('/evidence')} href="#">{t.evidence}</a>
            <a className="transition-colors" style={{ color: subtext }} onClick={() => navigate('/reports')} href="#">{t.reports}</a>
            <a className="transition-colors" style={{ color: subtext }} onClick={() => navigate('/archives')} href="#">{t.archives}</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs hidden sm:block" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{user?.email}</span>
          <NotificationPanel />
          <button onClick={() => navigate('/settings')} className="p-2 rounded-lg" style={{ color: subtext }}>
            <span className="material-symbols-outlined">settings</span>
          </button>
          <button onClick={handleLogout} className="ml-2 px-4 py-1.5 font-semibold rounded-lg text-sm" style={{ backgroundColor: '#93000a', color: '#ffdad6' }}>
            {t.logout}
          </button>
        </div>
      </header>

      <main className="flex-grow w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

        <aside className="hidden lg:flex lg:col-span-2 flex-col gap-2">
          <div className="mb-6 px-4">
            <div className="flex items-center gap-2" style={{ color: '#adc6ff' }}>
              <span className="material-symbols-outlined">biotech</span>
              <span className="font-bold tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Forensic Engine</span>
            </div>
            <div className="text-xs mt-1 uppercase tracking-widest" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>v1.0.0-stable</div>
          </div>
          <nav className="flex flex-col">
            {[
              { label: t.overview, icon: 'dashboard', path: '/dashboard' },
              { label: t.fileRecovery, icon: 'settings_backup_restore', path: '/dashboard' },
              { label: t.hexViewer, icon: 'memory', path: '/hex-viewer' },
              { label: t.auditLog, icon: 'history', active: true },
            ].map((item) => (
              <a key={item.label} href="#"
                onClick={(e) => { e.preventDefault(); if (item.path) navigate(item.path) }}
                className="py-3 px-4 flex items-center gap-3 transition-all duration-200"
                style={item.active
                  ? { backgroundColor: 'rgba(59,130,246,0.1)', color: '#60a5fa', borderRight: '3px solid #3b82f6' }
                  : { color: subtext }
                }
                onMouseEnter={e => { if (!item.active) { e.currentTarget.style.color = text; e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' } }}
                onMouseLeave={e => { if (!item.active) { e.currentTarget.style.color = subtext; e.currentTarget.style.backgroundColor = 'transparent' } }}
              >
                <span className="material-symbols-outlined text-sm">{item.icon}</span>
                <span className="text-xs uppercase tracking-widest" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{item.label}</span>
              </a>
            ))}
          </nav>
          <button onClick={() => navigate('/dashboard')} className="mt-8 mx-4 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all active:scale-95" style={{ backgroundColor: '#4d8eff', color: '#002e6a' }}>
            <span className="material-symbols-outlined text-sm">add</span>
            {t.newScan}
          </button>
        </aside>

        <section className="lg:col-span-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {t.title} <span style={{ color: '#3b82f6' }}>{t.titleAccent}</span>
              </h1>
              <p className="text-sm mt-1" style={{ color: subtext }}>{t.subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-sm" style={{ color: subtext }}>search</span>
                <input type="text" placeholder={t.searchPlaceholder} value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="rounded-lg pl-9 pr-4 py-2 text-sm outline-none"
                  style={{ backgroundColor: isDark ? '#141b2b' : '#e2e8f0', color: text, border: `1px solid ${border}` }} />
              </div>
              <select value={filter} onChange={e => setFilter(e.target.value)}
                className="rounded-lg px-4 py-2 text-sm outline-none"
                style={{ backgroundColor: isDark ? '#141b2b' : '#e2e8f0', color: text, border: `1px solid ${border}`, fontFamily: 'JetBrains Mono, monospace' }}>
                <option value="all">{t.allActions}</option>
                <option value="LOGIN">LOGIN</option>
                <option value="REGISTER">REGISTER</option>
                <option value="SCAN_STARTED">SCAN_STARTED</option>
                <option value="SCAN_COMPLETE">SCAN_COMPLETE</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border-l-2" style={{ backgroundColor: card, borderColor: '#3b82f6' }}>
              <div className="text-xs uppercase tracking-widest mb-1" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{t.totalEvents}</div>
              <div className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{logs.length}</div>
            </div>
            <div className="p-4 rounded-xl border-l-2" style={{ backgroundColor: card, borderColor: '#4edea3' }}>
              <div className="text-xs uppercase tracking-widest mb-1" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{t.todayEvents}</div>
              <div className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {logs.filter(l => l.timestamp?.slice(0, 10) === today).length}
              </div>
            </div>
            <div className="p-4 rounded-xl border-l-2" style={{ backgroundColor: card, borderColor: '#adc6ff' }}>
              <div className="text-xs uppercase tracking-widest mb-1" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{t.lastAction}</div>
              <div className="text-sm font-bold truncate" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {logs[0]?.action || '—'}
              </div>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden" style={{ backgroundColor: card }}>
            <div className="px-8 py-5 border-b flex justify-between items-center" style={{ borderColor: border }}>
              <h2 className="font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Event Log</h2>
              <span className="text-xs px-3 py-1 rounded-full border" style={{ color: subtext, borderColor: border, fontFamily: 'JetBrains Mono, monospace' }}>
                {filtered.length} events
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: tableHeader }}>
                    <th className="px-8 py-4 text-left text-xs uppercase tracking-widest" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{t.timestamp}</th>
                    <th className="px-8 py-4 text-left text-xs uppercase tracking-widest" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{t.action}</th>
                    <th className="px-8 py-4 text-left text-xs uppercase tracking-widest" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{t.details}</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && <tr><td colSpan={3} className="px-8 py-6 text-center text-sm" style={{ color: subtext }}>{t.loading}</td></tr>}
                  {!loading && filtered.length === 0 && <tr><td colSpan={3} className="px-8 py-6 text-center text-sm" style={{ color: subtext }}>{t.noLogs}</td></tr>}
                  {filtered.map((log, i) => {
                    const style = getActionStyle(log.action)
                    return (
                      <tr key={i} style={{ borderTop: `1px solid ${border}` }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <td className="px-8 py-4 text-xs" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>
                          {log.timestamp ? log.timestamp.slice(0, 19).replace('T', ' ') : '—'}
                        </td>
                        <td className="px-8 py-4">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border"
                            style={{ backgroundColor: style.bg, color: style.color, borderColor: style.border, fontFamily: 'JetBrains Mono, monospace' }}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-sm" style={{ color: text }}>{log.details}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-6 mt-auto border-t" style={{ backgroundColor: bg, borderColor: border }}>
        <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto">
          <div className="text-xs uppercase tracking-tighter mb-4 md:mb-0" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>
            © 2026 LAZARUS FORENSICS. ALL DATA ENCRYPTED.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-xs uppercase tracking-tighter" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>Privacy Policy</a>
            <a href="#" className="text-xs uppercase tracking-tighter" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>Terms of Service</a>
            <a href="#" className="text-xs uppercase tracking-tighter" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>API Documentation</a>
            <a href="#" className="text-xs uppercase tracking-tighter" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>Support Portal</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AuditLog