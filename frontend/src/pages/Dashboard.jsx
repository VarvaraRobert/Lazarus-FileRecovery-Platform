import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'
import { useApp } from '../context/AppContext'
import NotificationPanel from '../components/NotificationPanel'

const translations = {
  en: {
    dashboard: 'Dashboard', evidence: 'Evidence', reports: 'Reports', archives: 'Archives',
    logout: 'Logout', scanTitle: 'Scan Disk Image', targetPath: 'Target Path',
    placeholder: '/path/to/disk/image.dd', uploadScan: 'Upload & Scan',
    scanning: 'Reconstructing Bitstream...', scanningDesc: 'Scanning in progress',
    scanComplete: 'Scan Complete', filesRecovered: 'files recovered', noFiles: 'No files found.',
    offsetStart: 'OFFSET START', offsetEnd: 'OFFSET END', newScan: 'NEW SCAN',
    overview: 'Overview', fileRecovery: 'File Recovery', hexViewer: 'Hex Viewer',
    auditLog: 'Audit Log', scanFailed: 'Scan failed. Check the file path and try again.',
  },
  de: {
    dashboard: 'Armaturenbrett', evidence: 'Beweise', reports: 'Berichte', archives: 'Archive',
    logout: 'Abmelden', scanTitle: 'Disk-Image scannen', targetPath: 'Zielpfad',
    placeholder: '/pfad/zur/disk/image.dd', uploadScan: 'Hochladen & Scannen',
    scanning: 'Bitstream wird rekonstruiert...', scanningDesc: 'Scan läuft',
    scanComplete: 'Scan abgeschlossen', filesRecovered: 'Dateien wiederhergestellt', noFiles: 'Keine Dateien gefunden.',
    offsetStart: 'OFFSET START', offsetEnd: 'OFFSET ENDE', newScan: 'NEUER SCAN',
    overview: 'Übersicht', fileRecovery: 'Dateiwiederherstellung', hexViewer: 'Hex-Viewer',
    auditLog: 'Prüfprotokoll', scanFailed: 'Scan fehlgeschlagen. Überprüfen Sie den Dateipfad.',
  },
  fr: {
    dashboard: 'Tableau de bord', evidence: 'Preuves', reports: 'Rapports', archives: 'Archives',
    logout: 'Déconnexion', scanTitle: 'Scanner une image disque', targetPath: 'Chemin cible',
    placeholder: '/chemin/vers/image.dd', uploadScan: 'Télécharger & Scanner',
    scanning: 'Reconstruction du flux binaire...', scanningDesc: 'Scan en cours',
    scanComplete: 'Scan terminé', filesRecovered: 'fichiers récupérés', noFiles: 'Aucun fichier trouvé.',
    offsetStart: 'OFFSET DÉBUT', offsetEnd: 'OFFSET FIN', newScan: 'NOUVEAU SCAN',
    overview: 'Aperçu', fileRecovery: 'Récupération', hexViewer: 'Visionneuse Hex',
    auditLog: 'Journal d\'audit', scanFailed: 'Échec du scan. Vérifiez le chemin du fichier.',
  }
}

function Dashboard() {
  const [user, setUser] = useState(null)
  const [filePath, setFilePath] = useState('')
  const [scanId, setScanId] = useState(null)
  const [scanResults, setScanResults] = useState(null)
  const [polling, setPolling] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { theme, language } = useApp()
  const t = translations[language] || translations.en
  const isDark = theme === 'dark'
  const bg = isDark ? '#0c1322' : '#f1f5f9'
  const card = isDark ? '#141b2b' : '#ffffff'
  const cardAlt = isDark ? '#232a3a' : '#e8edf2'
  const text = isDark ? '#dce2f7' : '#1e293b'
  const subtext = isDark ? '#64748b' : '#94a3b8'
  const border = isDark ? 'rgba(66,71,84,0.1)' : 'rgba(0,0,0,0.08)'
  const input = isDark ? '#2e3545' : '#e2e8f0'

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.get('/api/me')
        setUser(response.data)
      } catch {
        navigate('/login')
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    if (!scanId) return
    setPolling(true)
    const interval = setInterval(async () => {
      try {
        const response = await API.get('/results/' + scanId)
        setScanResults(response.data)
        if (response.data.status === 'completed') {
          setPolling(false)
          clearInterval(interval)
        }
      } catch {
        clearInterval(interval)
        setPolling(false)
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [scanId])

  const handleScan = async () => {
    if (!filePath) return
    setError('')
    try {
      const response = await API.post('/upload/by-path', { file_path: filePath })
      setScanId(response.data.scan_id)
      setScanResults(null)
    } catch {
      setError(t.scanFailed)
    }
  }

  const handleDownload = async (file) => {
    const response = await API.get(
      '/results/download/' + scanResults.scan_id + '/' + file.file_id,
      { responseType: 'blob' }
    )
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', file.filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const getFileIcon = (fileType) => {
    const icons = { jpeg: 'image', jpg: 'image', png: 'image', pdf: 'picture_as_pdf', docx: 'description', txt: 'text_snippet' }
    return icons[fileType] || 'insert_drive_file'
  }

  const getFileColor = (fileType) => {
    const colors = { jpeg: '#adc6ff', jpg: '#adc6ff', png: '#adc6ff', pdf: '#ffb4ab', docx: '#4edea3', txt: '#ffb3ad' }
    return colors[fileType] || '#adc6ff'
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: bg, color: text }}>
      <header className="flex justify-between items-center w-full px-6 py-4 z-50 shadow-xl sticky top-0" style={{ backgroundColor: bg }}>
        <div className="flex items-center gap-8">
          <span className="text-2xl font-bold tracking-tighter" style={{ color: '#3b82f6', fontFamily: 'Space Grotesk, sans-serif' }}>LAZARUS</span>
          <nav className="hidden md:flex gap-6">
            <a className="font-bold border-b-2 pb-1" style={{ color: '#3b82f6', borderColor: '#3b82f6' }} href="#">{t.dashboard}</a>
            <a className="transition-colors" style={{ color: subtext }} onClick={() => navigate('/evidence')} href="#">{t.evidence}</a>
            <a className="transition-colors" style={{ color: subtext }} onClick={() => navigate('/reports')} href="#">{t.reports}</a>
            <a className="transition-colors" style={{ color: subtext }} onClick={() => navigate('/archives')} href="#">{t.archives}</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs hidden sm:block" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{user?.email}</span>
          <NotificationPanel />
          <button onClick={() => navigate('/settings')} className="p-2 rounded-lg transition-all" style={{ color: subtext }}>
            <span className="material-symbols-outlined">settings</span>
          </button>
          <button onClick={handleLogout} className="ml-2 px-4 py-1.5 font-semibold rounded-lg text-sm transition-all" style={{ backgroundColor: '#93000a', color: '#ffdad6' }}>
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
            <a className="py-3 px-4 flex items-center gap-3 border-r-4" style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#60a5fa', borderColor: '#3b82f6' }} href="#">
              <span className="material-symbols-outlined text-sm">dashboard</span>
              <span className="text-xs uppercase tracking-widest" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{t.overview}</span>
            </a>
            {[
              { label: t.hexViewer, icon: 'memory', path: '/hex-viewer' },
              { label: t.auditLog, icon: 'history', path: '/audit-log' },
            ].map(item => (
              <a key={item.label} className="py-3 px-4 flex items-center gap-3 transition-all" style={{ color: subtext }}
                onClick={(e) => { e.preventDefault(); navigate(item.path) }}
                onMouseEnter={e => { e.currentTarget.style.color = text; e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}
                onMouseLeave={e => { e.currentTarget.style.color = subtext; e.currentTarget.style.backgroundColor = 'transparent' }}
                href="#">
                <span className="material-symbols-outlined text-sm">{item.icon}</span>
                <span className="text-xs uppercase tracking-widest" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{item.label}</span>
              </a>
            ))}
          </nav>
          <button onClick={handleScan} className="mt-8 mx-4 py-3 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95" style={{ backgroundColor: '#4d8eff', color: '#002e6a' }}>
            <span className="material-symbols-outlined text-sm">add</span>
            {t.newScan}
          </button>
        </aside>

        <section className="lg:col-span-10 space-y-8">
          <div className="rounded-xl p-8 border relative overflow-hidden" style={{ backgroundColor: card, borderColor: border }}>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(173,198,255,0.1)', color: '#adc6ff' }}>
                  <span className="material-symbols-outlined">search_insights</span>
                </div>
                <h2 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{t.scanTitle}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3">
                  <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{t.targetPath}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined" style={{ color: subtext }}>folder</span>
                    <input
                      type="text"
                      placeholder={t.placeholder}
                      value={filePath}
                      onChange={(e) => setFilePath(e.target.value)}
                      className="w-full rounded-lg py-4 pl-12 pr-4 text-sm outline-none"
                      style={{ backgroundColor: input, color: text, fontFamily: 'JetBrains Mono, monospace' }}
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <button onClick={handleScan} className="w-full h-[52px] font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                    style={{ backgroundColor: '#adc6ff', color: '#002e6a' }}>
                    <span className="material-symbols-outlined">upload_file</span>
                    {t.uploadScan}
                  </button>
                </div>
              </div>

              {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}

              {polling && (
                <div className="mt-8 space-y-3">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#4edea3', fontFamily: 'JetBrains Mono, monospace' }}>{t.scanning}</span>
                      <p className="text-xs" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{t.scanningDesc}</p>
                    </div>
                  </div>
                  <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: input }}>
                    <div className="h-full animate-pulse" style={{ backgroundColor: '#4edea3', width: '60%' }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {scanResults && scanResults.status === 'completed' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: border }}>
                <h3 className="text-xl font-bold flex items-center gap-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {t.scanComplete}
                  <span className="px-2 py-0.5 text-xs rounded border" style={{ backgroundColor: 'rgba(78,222,163,0.1)', color: '#4edea3', borderColor: 'rgba(78,222,163,0.2)' }}>
                    {scanResults.recovered_count} {t.filesRecovered}
                  </span>
                </h3>
              </div>

              {scanResults.recovered_files.length === 0 ? (
                <p style={{ color: subtext }}>{t.noFiles}</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {scanResults.recovered_files.map((file) => (
                    <div key={file.file_id} className="rounded-xl p-5 border transition-all group" style={{ backgroundColor: cardAlt, borderColor: border }}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: bg, color: getFileColor(file.file_type) }}>
                          <span className="material-symbols-outlined text-3xl">{getFileIcon(file.file_type)}</span>
                        </div>
                        <button onClick={() => handleDownload(file)} className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity"
                          style={{ backgroundColor: 'rgba(173,198,255,0.1)', color: '#adc6ff' }}>
                          <span className="material-symbols-outlined text-sm">download</span>
                        </button>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-medium truncate" style={{ color: text }}>{file.filename}</h4>
                        <p className="text-xs" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{(file.size_bytes / 1024).toFixed(2)} KB</p>
                      </div>
                      <div className="mt-4 pt-4 border-t flex flex-col gap-1" style={{ borderColor: border }}>
                        <div className="flex justify-between items-center text-xs" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          <span style={{ color: subtext }}>{t.offsetStart}</span>
                          <span style={{ color: '#4d8eff' }}>0x{file.offset_start.toString(16).toUpperCase().padStart(8, '0')}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          <span style={{ color: subtext }}>{t.offsetEnd}</span>
                          <span style={{ color: '#4d8eff' }}>0x{file.offset_end.toString(16).toUpperCase().padStart(8, '0')}</span>
                        </div>
                        {file.md5 && (
                          <div className="flex justify-between items-center text-xs" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                            <span style={{ color: subtext }}>MD5</span>
                            <span style={{ color: '#4d8eff' }} className="truncate ml-2 max-w-[160px]">{file.md5}</span>
                          </div>
                        )}
                        {file.sha256 && (
                          <div className="flex justify-between items-center text-xs" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                            <span style={{ color: subtext }}>SHA256</span>
                            <span style={{ color: '#4d8eff' }} className="truncate ml-2 max-w-[160px]">{file.sha256.slice(0, 16)}...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
            <a href="#" className="text-xs uppercase tracking-tighter transition-colors" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>Privacy Policy</a>
            <a href="#" className="text-xs uppercase tracking-tighter transition-colors" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>Terms of Service</a>
            <a href="#" className="text-xs uppercase tracking-tighter transition-colors" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>API Documentation</a>
            <a href="#" className="text-xs uppercase tracking-tighter transition-colors" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>Support Portal</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Dashboard