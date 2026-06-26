import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'
import { useApp } from '../context/AppContext'
import NotificationPanel from '../components/NotificationPanel'

const translations = {
  en: {
    dashboard: 'Dashboard', evidence: 'Evidence', reports: 'Reports', archives: 'Archives',
    logout: 'Logout', title: 'HEX', titleAccent: 'VIEWER',
    subtitle: 'Binary-level forensic file inspection tool.',
    selectScan: 'Select a scan', selectFile: 'Select a file',
    noScans: 'No completed scans found.', noFiles: 'No files in this scan.',
    loading: 'Loading...', loadingHex: 'Loading hex data...',
    offset: 'OFFSET', hex: 'HEX', ascii: 'ASCII',
    prev: 'Previous', next: 'Next', fileInfo: 'File Info',
    fileType: 'Type', fileSize: 'Size', page: 'Page',
    overview: 'Overview', fileRecovery: 'File Recovery', hexViewer: 'Hex Viewer',
    auditLog: 'Audit Log', newScan: 'NEW SCAN',
    selectPrompt: 'Select a scan and file to begin hex inspection.',
  },
  de: {
    dashboard: 'Armaturenbrett', evidence: 'Beweise', reports: 'Berichte', archives: 'Archive',
    logout: 'Abmelden', title: 'HEX', titleAccent: 'VIEWER',
    subtitle: 'Forensisches Dateiinspektionstool auf Binärebene.',
    selectScan: 'Scan auswählen', selectFile: 'Datei auswählen',
    noScans: 'Keine abgeschlossenen Scans gefunden.', noFiles: 'Keine Dateien in diesem Scan.',
    loading: 'Wird geladen...', loadingHex: 'Hex-Daten werden geladen...',
    offset: 'OFFSET', hex: 'HEX', ascii: 'ASCII',
    prev: 'Zurück', next: 'Weiter', fileInfo: 'Dateiinfo',
    fileType: 'Typ', fileSize: 'Größe', page: 'Seite',
    overview: 'Übersicht', fileRecovery: 'Dateiwiederherstellung', hexViewer: 'Hex-Viewer',
    auditLog: 'Prüfprotokoll', newScan: 'NEUER SCAN',
    selectPrompt: 'Wählen Sie einen Scan und eine Datei für die Hex-Inspektion.',
  },
  fr: {
    dashboard: 'Tableau de bord', evidence: 'Preuves', reports: 'Rapports', archives: 'Archives',
    logout: 'Déconnexion', title: 'HEX', titleAccent: 'VIEWER',
    subtitle: 'Outil d\'inspection forensique de fichiers au niveau binaire.',
    selectScan: 'Sélectionner un scan', selectFile: 'Sélectionner un fichier',
    noScans: 'Aucun scan terminé trouvé.', noFiles: 'Aucun fichier dans ce scan.',
    loading: 'Chargement...', loadingHex: 'Chargement des données hex...',
    offset: 'OFFSET', hex: 'HEX', ascii: 'ASCII',
    prev: 'Précédent', next: 'Suivant', fileInfo: 'Info fichier',
    fileType: 'Type', fileSize: 'Taille', page: 'Page',
    overview: 'Aperçu', fileRecovery: 'Récupération', hexViewer: 'Visionneuse Hex',
    auditLog: 'Journal d\'audit', newScan: 'NOUVEAU SCAN',
    selectPrompt: 'Sélectionnez un scan et un fichier pour l\'inspection hex.',
  }
}

function HexViewer() {
  const [user, setUser] = useState(null)
  const [scans, setScans] = useState([])
  const [selectedScan, setSelectedScan] = useState('')
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [hexData, setHexData] = useState(null)
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingHex, setLoadingHex] = useState(false)
  const LIMIT = 512
  const navigate = useNavigate()
  const { theme, language } = useApp()
  const t = translations[language] || translations.en
  const isDark = theme === 'dark'
  const bg = isDark ? '#0c1322' : '#f1f5f9'
  const card = isDark ? '#141b2b' : '#ffffff'
  const cardAlt = isDark ? '#232a3a' : '#e8edf2'
  const text = isDark ? '#dce2f7' : '#1e293b'
  const subtext = isDark ? '#64748b' : '#94a3b8'
  const border = isDark ? 'rgba(66,71,84,0.2)' : 'rgba(0,0,0,0.08)'

  useEffect(() => {
    const init = async () => {
      try {
        const res = await API.get('/api/me')
        setUser(res.data)
        const scansRes = await API.get('/hexviewer/scans')
        setScans(scansRes.data)
      } catch {
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const handleScanChange = async (scanId) => {
    setSelectedScan(scanId)
    setSelectedFile(null)
    setHexData(null)
    setOffset(0)
    if (!scanId) return
    try {
      const res = await API.get(`/hexviewer/files/${scanId}`)
      setFiles(res.data)
    } catch {}
  }

  const handleFileChange = async (file) => {
    setSelectedFile(file)
    setOffset(0)
    await loadHex(file.file_id, 0)
  }

  const loadHex = async (fileId, newOffset) => {
    setLoadingHex(true)
    try {
      const res = await API.get(`/hexviewer/hex/${selectedScan}/${fileId}?offset=${newOffset}&limit=${LIMIT}`)
      setHexData(res.data)
      setOffset(newOffset)
    } catch {} finally {
      setLoadingHex(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

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
              { label: t.hexViewer, icon: 'memory', active: true },
              { label: t.auditLog, icon: 'history', path: '/audit-log' },
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
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {t.title} <span style={{ color: '#3b82f6' }}>{t.titleAccent}</span>
            </h1>
            <p className="text-sm mt-1" style={{ color: subtext }}>{t.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{t.selectScan}</label>
              <select value={selectedScan} onChange={e => handleScanChange(e.target.value)}
                className="w-full rounded-lg px-4 py-2.5 text-sm outline-none"
                style={{ backgroundColor: card, color: text, border: `1px solid ${border}`, fontFamily: 'JetBrains Mono, monospace' }}>
                <option value="">— {t.selectScan} —</option>
                {scans.map(s => (
                  <option key={s.scan_id} value={s.scan_id}>
                    {s.filename} ({s.recovered_count} files)
                  </option>
                ))}
              </select>
              {!loading && scans.length === 0 && <p className="text-xs mt-2" style={{ color: subtext }}>{t.noScans}</p>}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{t.selectFile}</label>
              <select value={selectedFile?.file_id || ''} onChange={e => {
                const file = files.find(f => f.file_id === e.target.value)
                if (file) handleFileChange(file)
              }}
                className="w-full rounded-lg px-4 py-2.5 text-sm outline-none"
                style={{ backgroundColor: card, color: text, border: `1px solid ${border}`, fontFamily: 'JetBrains Mono, monospace' }}
                disabled={!selectedScan}>
                <option value="">— {t.selectFile} —</option>
                {files.map(f => (
                  <option key={f.file_id} value={f.file_id}>
                    {f.filename} ({(f.size_bytes / 1024).toFixed(2)} KB)
                  </option>
                ))}
              </select>
              {selectedScan && files.length === 0 && <p className="text-xs mt-2" style={{ color: subtext }}>{t.noFiles}</p>}
            </div>
          </div>

          {selectedFile && hexData && (
            <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: card, borderColor: border }}>
              <div className="px-6 py-4 border-b flex flex-wrap justify-between items-center gap-4" style={{ borderColor: border, backgroundColor: cardAlt }}>
                <div className="flex flex-wrap items-center gap-4 text-xs" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  <span style={{ color: '#adc6ff' }}>{hexData.filename}</span>
                  <span style={{ color: subtext }}>{t.fileType}: <span style={{ color: text }}>{hexData.file_type?.toUpperCase()}</span></span>
                  <span style={{ color: subtext }}>{t.fileSize}: <span style={{ color: text }}>{(hexData.file_size / 1024).toFixed(2)} KB</span></span>
                  {selectedFile?.md5 && (
                    <span style={{ color: subtext }}>MD5: <span style={{ color: '#4d8eff' }}>{selectedFile.md5}</span></span>
                  )}
                  {selectedFile?.sha256 && (
                    <span style={{ color: subtext }}>SHA256: <span style={{ color: '#4d8eff' }}>{selectedFile.sha256.slice(0, 16)}...</span></span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => loadHex(selectedFile.file_id, Math.max(0, offset - LIMIT))}
                    disabled={offset === 0}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-30"
                    style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#60a5fa', fontFamily: 'JetBrains Mono, monospace' }}>
                    ← {t.prev}
                  </button>
                  <span className="text-xs px-3" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>
                    {t.offset}: 0x{offset.toString(16).toUpperCase().padStart(8, '0')}
                  </span>
                  <button
                    onClick={() => loadHex(selectedFile.file_id, offset + LIMIT)}
                    disabled={!hexData.has_more}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-30"
                    style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#60a5fa', fontFamily: 'JetBrains Mono, monospace' }}>
                    {t.next} →
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                {loadingHex ? (
                  <p className="px-6 py-8 text-center text-sm" style={{ color: subtext }}>{t.loadingHex}</p>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr style={{ backgroundColor: isDark ? 'rgba(15,23,42,0.5)' : 'rgba(0,0,0,0.03)' }}>
                        <th className="px-6 py-3 text-left text-xs uppercase tracking-widest w-32" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{t.offset}</th>
                        <th className="px-6 py-3 text-left text-xs uppercase tracking-widest" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{t.hex}</th>
                        <th className="px-6 py-3 text-left text-xs uppercase tracking-widest w-40" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{t.ascii}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hexData.rows.map((row, i) => (
                        <tr key={i} style={{ borderTop: `1px solid ${border}` }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <td className="px-6 py-2 text-xs" style={{ color: '#4d8eff', fontFamily: 'JetBrains Mono, monospace' }}>
                            {row.offset}
                          </td>
                          <td className="px-6 py-2 text-xs" style={{ color: '#4edea3', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em' }}>
                            {row.hex}
                          </td>
                          <td className="px-6 py-2 text-xs" style={{ color: '#ffb3ad', fontFamily: 'JetBrains Mono, monospace' }}>
                            {row.ascii}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {!selectedFile && (
            <div className="rounded-xl p-12 border flex flex-col items-center justify-center text-center" style={{ backgroundColor: card, borderColor: border }}>
              <span className="material-symbols-outlined text-5xl mb-4" style={{ color: isDark ? '#374151' : '#cbd5e1' }}>memory</span>
              <p className="text-sm" style={{ color: subtext }}>{t.selectPrompt}</p>
            </div>
          )}
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

export default HexViewer