import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'
import { useApp } from '../context/AppContext'
import NotificationPanel from '../components/NotificationPanel'

const translations = {
  en: {
    dashboard: 'Dashboard', evidence: 'Evidence', reports: 'Reports', archives: 'Archives',
    logout: 'Logout', title: 'SCAN', titleAccent: 'ARCHIVES',
    subtitle: 'Complete history of all forensic scan operations.',
    searchPlaceholder: 'Search scans...', allStatus: 'All Status',
    completed: 'Completed', processing: 'Processing', failed: 'Failed',
    totalScans: 'Total Scans', completedLabel: 'Completed', totalFiles: 'Total Files',
    allRecords: 'All Scan Records', records: 'records',
    timestamp: 'Timestamp', filename: 'Filename', size: 'Size', status: 'Status', files: 'Files',
    loading: 'Loading...', noScans: 'No scans found.',
    overview: 'Overview', fileRecovery: 'File Recovery', hexViewer: 'Hex Viewer',
    auditLog: 'Audit Log', newScan: 'NEW SCAN',
  },
  de: {
    dashboard: 'Armaturenbrett', evidence: 'Beweise', reports: 'Berichte', archives: 'Archive',
    logout: 'Abmelden', title: 'SCAN', titleAccent: 'ARCHIV',
    subtitle: 'Vollständige Historie aller forensischen Scan-Operationen.',
    searchPlaceholder: 'Scans suchen...', allStatus: 'Alle Status',
    completed: 'Abgeschlossen', processing: 'Verarbeitung', failed: 'Fehlgeschlagen',
    totalScans: 'Scans gesamt', completedLabel: 'Abgeschlossen', totalFiles: 'Dateien gesamt',
    allRecords: 'Alle Scan-Einträge', records: 'Einträge',
    timestamp: 'Zeitstempel', filename: 'Dateiname', size: 'Größe', status: 'Status', files: 'Dateien',
    loading: 'Wird geladen...', noScans: 'Keine Scans gefunden.',
    overview: 'Übersicht', fileRecovery: 'Dateiwiederherstellung', hexViewer: 'Hex-Viewer',
    auditLog: 'Prüfprotokoll', newScan: 'NEUER SCAN',
  },
  fr: {
    dashboard: 'Tableau de bord', evidence: 'Preuves', reports: 'Rapports', archives: 'Archives',
    logout: 'Déconnexion', title: 'SCAN', titleAccent: 'ARCHIVES',
    subtitle: 'Historique complet de toutes les opérations de scan forensique.',
    searchPlaceholder: 'Rechercher des scans...', allStatus: 'Tous les statuts',
    completed: 'Terminé', processing: 'En cours', failed: 'Échoué',
    totalScans: 'Scans totaux', completedLabel: 'Terminés', totalFiles: 'Fichiers totaux',
    allRecords: 'Tous les enregistrements', records: 'enregistrements',
    timestamp: 'Horodatage', filename: 'Nom du fichier', size: 'Taille', status: 'Statut', files: 'Fichiers',
    loading: 'Chargement...', noScans: 'Aucun scan trouvé.',
    overview: 'Aperçu', fileRecovery: 'Récupération', hexViewer: 'Visionneuse Hex',
    auditLog: 'Journal d\'audit', newScan: 'NOUVEAU SCAN',
  }
}

function Archives() {
  const [user, setUser] = useState(null)
  const [scans, setScans] = useState([])
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
  const input = isDark ? '#141b2b' : '#e2e8f0'

  useEffect(() => {
    const init = async () => {
      try {
        const res = await API.get('/api/me')
        setUser(res.data)
        const statsRes = await API.get('/reports/stats')
        setScans(statsRes.data.recent_scans || [])
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

  const filtered = scans.filter(s => {
    const matchSearch = s.filename?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || s.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: bg, color: text }}>

      <header className="flex justify-between items-center w-full px-6 py-4 z-50 shadow-xl sticky top-0" style={{ backgroundColor: bg }}>
        <div className="flex items-center gap-8">
          <span className="text-2xl font-bold tracking-tighter" style={{ color: '#3b82f6', fontFamily: 'Space Grotesk, sans-serif' }}>LAZARUS</span>
          <nav className="hidden md:flex gap-6">
            <a className="transition-colors" style={{ color: subtext }} onClick={() => navigate('/dashboard')} href="#">{t.dashboard}</a>
            <a className="transition-colors" style={{ color: subtext }} onClick={() => navigate('/evidence')} href="#">{t.evidence}</a>
            <a className="transition-colors" style={{ color: subtext }} onClick={() => navigate('/reports')} href="#">{t.reports}</a>
            <a className="font-bold border-b-2 pb-1" style={{ color: '#3b82f6', borderColor: '#3b82f6' }} href="#">{t.archives}</a>
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
              { label: t.auditLog, icon: 'history', path: '/audit-log' },
            ].map((item) => (
                <a
                key={item.label}
                href="#"
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
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
                  style={{ backgroundColor: input, color: text, border: `1px solid ${border}` }} />
              </div>
              <select value={filter} onChange={e => setFilter(e.target.value)}
                className="rounded-lg px-4 py-2 text-sm outline-none"
                style={{ backgroundColor: input, color: text, border: `1px solid ${border}`, fontFamily: 'JetBrains Mono, monospace' }}>
                <option value="all">{t.allStatus}</option>
                <option value="completed">{t.completed}</option>
                <option value="processing">{t.processing}</option>
                <option value="failed">{t.failed}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border-l-2" style={{ backgroundColor: card, borderColor: '#3b82f6' }}>
              <div className="text-xs uppercase tracking-widest mb-1" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{t.totalScans}</div>
              <div className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{scans.length}</div>
            </div>
            <div className="p-4 rounded-xl border-l-2" style={{ backgroundColor: card, borderColor: '#4edea3' }}>
              <div className="text-xs uppercase tracking-widest mb-1" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{t.completedLabel}</div>
              <div className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{scans.filter(s => s.status === 'completed').length}</div>
            </div>
            <div className="p-4 rounded-xl border-l-2" style={{ backgroundColor: card, borderColor: '#ffb3ad' }}>
              <div className="text-xs uppercase tracking-widest mb-1" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{t.totalFiles}</div>
              <div className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{scans.reduce((a, s) => a + s.recovered_count, 0)}</div>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden" style={{ backgroundColor: card }}>
            <div className="px-8 py-5 border-b flex justify-between items-center" style={{ borderColor: border }}>
              <h2 className="font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{t.allRecords}</h2>
              <span className="text-xs px-3 py-1 rounded-full border" style={{ color: subtext, borderColor: border, fontFamily: 'JetBrains Mono, monospace' }}>
                {filtered.length} {t.records}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: tableHeader }}>
                    <th className="px-8 py-4 text-left text-xs uppercase tracking-widest" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{t.timestamp}</th>
                    <th className="px-8 py-4 text-left text-xs uppercase tracking-widest" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{t.filename}</th>
                    <th className="px-8 py-4 text-left text-xs uppercase tracking-widest" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{t.size}</th>
                    <th className="px-8 py-4 text-left text-xs uppercase tracking-widest" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{t.status}</th>
                    <th className="px-8 py-4 text-right text-xs uppercase tracking-widest" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{t.files}</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && <tr><td colSpan={5} className="px-8 py-6 text-center text-sm" style={{ color: subtext }}>{t.loading}</td></tr>}
                  {!loading && filtered.length === 0 && <tr><td colSpan={5} className="px-8 py-6 text-center text-sm" style={{ color: subtext }}>{t.noScans}</td></tr>}
                  {filtered.map((scan, i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${border}` }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td className="px-8 py-4 text-xs" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>
                        {scan.created_at ? scan.created_at.slice(0, 19).replace('T', ' ') : '—'}
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-sm" style={{ color: '#adc6ff' }}>storage</span>
                          <div>
                            <div className="text-sm font-medium" style={{ color: text }}>{scan.filename}</div>
                            <div className="text-xs mt-0.5" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{scan.scan_id?.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-xs" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>
                        {(scan.file_size / (1024 * 1024)).toFixed(2)} MB
                      </td>
                      <td className="px-8 py-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border"
                          style={{
                            backgroundColor: scan.status === 'completed' ? 'rgba(78,222,163,0.1)' : 'rgba(255,180,171,0.1)',
                            color: scan.status === 'completed' ? '#4edea3' : '#ffb4ab',
                            borderColor: scan.status === 'completed' ? 'rgba(78,222,163,0.2)' : 'rgba(255,180,171,0.2)',
                            fontFamily: 'JetBrains Mono, monospace'
                          }}>
                          {scan.status}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-right text-sm font-bold" style={{ color: text, fontFamily: 'JetBrains Mono, monospace' }}>
                        {scan.recovered_count}
                      </td>
                    </tr>
                  ))}
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

export default Archives