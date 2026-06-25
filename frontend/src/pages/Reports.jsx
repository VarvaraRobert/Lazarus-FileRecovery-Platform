import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'
import { useApp } from '../context/AppContext'
import NotificationPanel from '../components/NotificationPanel'
import jsPDF from 'jspdf'

const translations = {
  en: {
    dashboard: 'Dashboard', evidence: 'Evidence', reports: 'Reports', archives: 'Archives',
    logout: 'Logout', titleMain: 'REPORTS', titleAccent: 'ENGINE',
    subtitle: 'Aggregate forensic telemetry and recovery performance analytics.',
    totalScans: 'Total Scans', allTime: 'All time',
    filesRecovered: 'Files Recovered', totalObjects: 'Total objects',
    dataVolume: 'Data Volume', uncompressed: 'Uncompressed',
    systemIntegrity: 'System Integrity', zeroCorrupt: 'Zero corrupt blocks',
    fileTypeDist: 'File Type Distribution', files: 'Files',
    deepSector: 'Deep Sector Analysis', deepSectorDesc: 'Visualizing data clusters across physical disk sectors 0x000 to 0xFFFF.',
    launchViewer: 'Launch Viewer', recentScans: 'RECENT FORENSIC SCANS',
    filterStatus: 'Filter by Status', timestamp: 'Timestamp', filename: 'Filename',
    status: 'Status', objects: 'Objects', noScans: 'No scans yet.',
    loading: 'Loading stats...', overview: 'Overview', fileRecovery: 'File Recovery',
    hexViewer: 'Hex Viewer', auditLog: 'Audit Log',
    newScan: 'NEW SCAN',
  },
  de: {
    dashboard: 'Armaturenbrett', evidence: 'Beweise', reports: 'Berichte', archives: 'Archive',
    logout: 'Abmelden', titleMain: 'BERICHTE', titleAccent: 'ENGINE',
    subtitle: 'Aggregierte forensische Telemetrie und Wiederherstellungsanalysen.',
    totalScans: 'Scans gesamt', allTime: 'Gesamt',
    filesRecovered: 'Wiederhergestellte Dateien', totalObjects: 'Objekte gesamt',
    dataVolume: 'Datenvolumen', uncompressed: 'Unkomprimiert',
    systemIntegrity: 'Systemintegrität', zeroCorrupt: 'Keine beschädigten Blöcke',
    fileTypeDist: 'Dateitypverteilung', files: 'Dateien',
    deepSector: 'Tiefe Sektoranalyse', deepSectorDesc: 'Visualisierung von Datenclustern über physische Festplattensektoren 0x000 bis 0xFFFF.',
    launchViewer: 'Viewer starten', recentScans: 'AKTUELLE FORENSISCHE SCANS',
    filterStatus: 'Nach Status filtern', timestamp: 'Zeitstempel', filename: 'Dateiname',
    status: 'Status', objects: 'Objekte', noScans: 'Noch keine Scans.',
    loading: 'Statistiken werden geladen...', overview: 'Übersicht', fileRecovery: 'Dateiwiederherstellung',
    hexViewer: 'Hex-Viewer', auditLog: 'Prüfprotokoll',
    newScan: 'NEUER SCAN',
  },
  fr: {
    dashboard: 'Tableau de bord', evidence: 'Preuves', reports: 'Rapports', archives: 'Archives',
    logout: 'Déconnexion', titleMain: 'RAPPORTS', titleAccent: 'MOTEUR',
    subtitle: 'Télémétrie forensique agrégée et analyses de performance de récupération.',
    totalScans: 'Scans totaux', allTime: 'Total',
    filesRecovered: 'Fichiers récupérés', totalObjects: 'Objets totaux',
    dataVolume: 'Volume de données', uncompressed: 'Non compressé',
    systemIntegrity: 'Intégrité système', zeroCorrupt: 'Zéro bloc corrompu',
    fileTypeDist: 'Distribution des types de fichiers', files: 'Fichiers',
    deepSector: 'Analyse de secteur profond', deepSectorDesc: 'Visualisation des clusters de données sur les secteurs 0x000 à 0xFFFF.',
    launchViewer: 'Lancer la visionneuse', recentScans: 'SCANS FORENSIQUES RÉCENTS',
    filterStatus: 'Filtrer par statut', timestamp: 'Horodatage', filename: 'Nom du fichier',
    status: 'Statut', objects: 'Objets', noScans: 'Aucun scan pour l\'instant.',
    loading: 'Chargement des statistiques...', overview: 'Aperçu', fileRecovery: 'Récupération',
    hexViewer: 'Visionneuse Hex', auditLog: 'Journal d\'audit',
    newScan: 'NOUVEAU SCAN',
  }
}

function Reports() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { theme, language } = useApp()
  const t = translations[language] || translations.en
  const isDark = theme === 'dark'
  const bg = isDark ? '#0c1322' : '#f1f5f9'
  const card = isDark ? '#141b2b' : '#ffffff'
  const text = isDark ? '#dce2f7' : '#1e293b'
  const subtext = isDark ? '#64748b' : '#94a3b8'
  const border = isDark ? 'rgba(66,71,84,0.3)' : 'rgba(0,0,0,0.08)'
  const tableHeader = isDark ? 'rgba(15,23,42,0.5)' : 'rgba(0,0,0,0.03)'
  const circleTrack = isDark ? '#1f2937' : '#e2e8f0'

  useEffect(() => {
    const init = async () => {
      try {
        const res = await API.get('/api/me')
        setUser(res.data)
        const statsRes = await API.get('/reports/stats')
        setStats(statsRes.data)
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

  const handleExportPDF = () => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()

  doc.setFillColor(12, 19, 34)
  doc.rect(0, 0, pageWidth, 45, 'F')
  
  doc.setFillColor(59, 130, 246)
  doc.rect(0, 0, 4, 45, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('LAZARUS', 14, 20)
  doc.setTextColor(59, 130, 246)
  doc.text(' FORENSICS', 52, 20)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(148, 163, 184)
  doc.text('Digital Forensics & File Recovery Platform', 14, 30)
  doc.text(`Generated: ${new Date().toISOString().slice(0, 19).replace('T', ' ')}`, pageWidth - 14, 30, { align: 'right' })
  doc.text(`Analyst: ${user?.username || ''}`, 14, 38)

  let y = 60
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(30, 41, 59)
  doc.text('REPORTS ENGINE', 14, y)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 116, 139)
  doc.text(t.subtitle, 14, y + 7)

  doc.setDrawColor(59, 130, 246)
  doc.setLineWidth(0.5)
  doc.line(14, y + 13, pageWidth - 14, y + 13)
  y += 24

  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(30, 41, 59)
  doc.text('KEY METRICS', 14, y)
  y += 10

  const metrics = [
    [t.totalScans, stats?.total_scans ?? 0, [59, 130, 246]],
    [t.filesRecovered, stats?.total_files ?? 0, [78, 222, 163]],
    [t.dataVolume, `${stats?.total_size_mb ?? 0} MB`, [173, 198, 255]],
    [t.systemIntegrity, 'NOMINAL', [78, 222, 163]],
  ]

  metrics.forEach(([label, value, color]) => {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(71, 85, 105)
    doc.text(label, 14, y)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...color)
    doc.text(String(value), 90, y)
    y += 9
  })

  y += 6
  doc.setDrawColor(226, 232, 240)
  doc.setLineWidth(0.3)
  doc.line(14, y, pageWidth - 14, y)
  y += 12

  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(30, 41, 59)
  doc.text('FILE TYPE DISTRIBUTION', 14, y)
  y += 10

  const typeColorMap = {
    jpeg: [59, 130, 246],
    png: [78, 222, 163],
    pdf: [255, 179, 173],
    docx: [100, 116, 139],
  }

  Object.entries(stats?.file_types ?? {}).forEach(([type, count]) => {
    const percent = stats.total_files > 0 ? Math.round((count / stats.total_files) * 100) : 0
    const color = typeColorMap[type] || [100, 116, 139]

    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...color)
    doc.text(type.toUpperCase(), 14, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(71, 85, 105)
    doc.text(`${count} files`, 90, y)
    doc.setTextColor(...color)
    doc.text(`${percent}%`, 130, y)

    doc.setFillColor(226, 232, 240)
    doc.rect(14, y + 2, 100, 3, 'F')
    doc.setFillColor(...color)
    doc.rect(14, y + 2, percent, 3, 'F')
    y += 12
  })

  y += 4
  doc.setDrawColor(226, 232, 240)
  doc.setLineWidth(0.3)
  doc.line(14, y, pageWidth - 14, y)
  y += 12

  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(30, 41, 59)
  doc.text('RECENT FORENSIC SCANS', 14, y)
  y += 10

  doc.setFillColor(241, 245, 249)
  doc.rect(14, y - 5, pageWidth - 28, 10, 'F')
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(71, 85, 105)
  doc.text('TIMESTAMP', 16, y + 1)
  doc.text('FILENAME', 62, y + 1)
  doc.text('STATUS', 132, y + 1)
  doc.text('FILES', pageWidth - 16, y + 1, { align: 'right' })
  y += 8

  doc.setFont('helvetica', 'normal')
  stats?.recent_scans?.forEach((scan, i) => {
    if (y > 270) {
      doc.addPage()
      y = 20
    }
    if (i % 2 === 0) {
      doc.setFillColor(248, 250, 252)
      doc.rect(14, y - 4, pageWidth - 28, 9, 'F')
    }
    doc.setFontSize(8)
    doc.setTextColor(100, 116, 139)
    doc.text(scan.created_at?.slice(0, 16).replace('T', ' ') || '—', 16, y + 1)
    doc.setTextColor(30, 41, 59)
    doc.text((scan.filename || '').slice(0, 35), 62, y + 1)
    if (scan.status === 'completed') {
      doc.setTextColor(21, 128, 61)
    } else {
      doc.setTextColor(185, 28, 28)
    }
    doc.text(scan.status || '', 132, y + 1)
    doc.setTextColor(59, 130, 246)
    doc.text(String(scan.recovered_count), pageWidth - 16, y + 1, { align: 'right' })
    y += 9
  })

  y += 10
  doc.setDrawColor(59, 130, 246)
  doc.setLineWidth(0.5)
  doc.line(14, y, pageWidth - 14, y)
  y += 8
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(148, 163, 184)
  doc.text('© 2026 LAZARUS FORENSICS. ALL DATA ENCRYPTED.', pageWidth / 2, y, { align: 'center' })

  doc.save(`lazarus-report-${new Date().toISOString().slice(0, 10)}.pdf`)
}

  const getCircleOffset = (percent) => {
    const circumference = 251.2
    return circumference - (percent / 100) * circumference
  }

  const getTypePercent = (count) => {
    if (!stats || stats.total_files === 0) return 0
    return Math.round((count / stats.total_files) * 100)
  }

  const typeColors = {
    jpeg: '#3b82f6', png: '#4edea3', pdf: '#ffb3ad', docx: '#424754',
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: bg, color: text }}>

      <header className="flex justify-between items-center w-full px-6 py-4 z-50 shadow-xl sticky top-0" style={{ backgroundColor: bg }}>
        <div className="flex items-center gap-8">
          <span className="text-2xl font-bold tracking-tighter" style={{ color: '#3b82f6', fontFamily: 'Space Grotesk, sans-serif' }}>LAZARUS</span>
          <nav className="hidden md:flex gap-6">
            <a className="transition-colors" style={{ color: subtext }} onClick={() => navigate('/dashboard')} href="#">{t.dashboard}</a>
            <a className="transition-colors" style={{ color: subtext }} onClick={() => navigate('/evidence')} href="#">{t.evidence}</a>
            <a className="font-bold border-b-2 pb-1" style={{ color: '#3b82f6', borderColor: '#3b82f6' }} href="#">{t.reports}</a>
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

        <section className="lg:col-span-10 space-y-8">
          <div className="mb-8 flex justify-between items-start">
  <div>
      <h1 className="text-4xl font-bold tracking-tight mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        {t.titleMain} <span style={{ color: '#3b82f6' }}>{t.titleAccent}</span>
      </h1>
      <p className="text-sm" style={{ color: subtext }}>
        {t.subtitle}{' '}
        <span className="px-2 py-0.5 rounded text-xs" style={{ color: '#60a5fa', backgroundColor: 'rgba(59,130,246,0.1)', fontFamily: 'JetBrains Mono, monospace' }}>
          USER: {user?.username}
        </span>
      </p>
    </div>
    <button
      onClick={handleExportPDF}
      className="px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95 flex-shrink-0"
      style={{ backgroundColor: '#adc6ff', color: '#002e6a' }}>
      <span className="material-symbols-outlined text-sm">download</span>
      Export PDF
    </button>
  </div>

          {loading ? (
            <p style={{ color: subtext }}>{t.loading}</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-6 rounded-xl border-l-2" style={{ backgroundColor: card, borderColor: '#3b82f6' }}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs uppercase tracking-widest" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{t.totalScans}</span>
                    <span className="material-symbols-outlined" style={{ color: '#60a5fa' }}>radar</span>
                  </div>
                  <div className="text-3xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{stats?.total_scans ?? 0}</div>
                  <div className="text-xs" style={{ color: '#4edea3', fontFamily: 'JetBrains Mono, monospace' }}>{t.allTime}</div>
                </div>

                <div className="p-6 rounded-xl border-l-2" style={{ backgroundColor: card, borderColor: '#4edea3' }}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs uppercase tracking-widest" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{t.filesRecovered}</span>
                    <span className="material-symbols-outlined" style={{ color: '#4edea3' }}>settings_backup_restore</span>
                  </div>
                  <div className="text-3xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{stats?.total_files ?? 0}</div>
                  <div className="text-xs" style={{ color: '#4edea3', fontFamily: 'JetBrains Mono, monospace' }}>{t.totalObjects}</div>
                </div>

                <div className="p-6 rounded-xl border-l-2" style={{ backgroundColor: card, borderColor: '#adc6ff' }}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs uppercase tracking-widest" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{t.dataVolume}</span>
                    <span className="material-symbols-outlined" style={{ color: '#adc6ff' }}>database</span>
                  </div>
                  <div className="text-3xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {stats?.total_size_mb ?? 0} <span className="text-lg">MB</span>
                  </div>
                  <div className="text-xs" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{t.uncompressed}</div>
                </div>

                <div className="p-6 rounded-xl border-l-2" style={{ backgroundColor: card, borderColor: '#ff5451' }}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs uppercase tracking-widest" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{t.systemIntegrity}</span>
                    <span className="material-symbols-outlined" style={{ color: '#ff5451' }}>shield</span>
                  </div>
                  <div className="text-3xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>NOMINAL</div>
                  <div className="text-xs" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{t.zeroCorrupt}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 rounded-xl overflow-hidden" style={{ backgroundColor: card }}>
                  <div className="px-6 py-4 border-b flex justify-between items-center" style={{ borderColor: border }}>
                    <h3 className="text-xs uppercase tracking-widest" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{t.fileTypeDist}</h3>
                    <div className="flex gap-2">
                      {Object.values(typeColors).map((c, i) => (
                        <span key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }}></span>
                      ))}
                    </div>
                  </div>
                  <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                    {Object.entries(stats?.file_types ?? {}).map(([type, count]) => {
                      const percent = getTypePercent(count)
                      const color = typeColors[type] || '#adc6ff'
                      return (
                        <div key={type} className="text-center">
                          <div className="relative inline-block mb-4">
                            <svg className="w-24 h-24" style={{ transform: 'rotate(-90deg)' }}>
                              <circle cx="48" cy="48" fill="transparent" r="40" stroke={circleTrack} strokeWidth="8" />
                              <circle cx="48" cy="48" fill="transparent" r="40" stroke={color} strokeDasharray="251.2" strokeDashoffset={getCircleOffset(percent)} strokeWidth="8" />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-xs" style={{ fontFamily: 'JetBrains Mono, monospace', color: text }}>{percent}%</span>
                          </div>
                          <div className="font-bold text-xl uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{type}</div>
                          <div className="text-xs uppercase mt-1" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{count} {t.files}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="rounded-xl flex flex-col justify-center items-center text-center p-6" style={{ backgroundColor: card }}>
                  <span className="material-symbols-outlined mb-4" style={{ fontSize: '64px', color: 'rgba(59,130,246,0.5)' }}>biotech</span>
                  <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{t.deepSector}</h3>
                  <p className="text-sm mb-6" style={{ color: subtext }}>{t.deepSectorDesc}</p>
                  <button className="px-6 py-2 text-xs uppercase tracking-widest transition-all" style={{ border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa', fontFamily: 'JetBrains Mono, monospace' }}>
                    {t.launchViewer}
                  </button>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden" style={{ backgroundColor: card }}>
                <div className="px-8 py-6 border-b flex justify-between items-center" style={{ borderColor: border }}>
                  <h2 className="text-lg font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{t.recentScans}</h2>
                  <div className="flex items-center gap-2 text-xs uppercase" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>
                    <span className="material-symbols-outlined text-sm">filter_list</span>
                    {t.filterStatus}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ backgroundColor: tableHeader }}>
                        <th className="px-8 py-4 text-left text-xs uppercase tracking-widest" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{t.timestamp}</th>
                        <th className="px-8 py-4 text-left text-xs uppercase tracking-widest" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{t.filename}</th>
                        <th className="px-8 py-4 text-left text-xs uppercase tracking-widest" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{t.status}</th>
                        <th className="px-8 py-4 text-right text-xs uppercase tracking-widest" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{t.objects}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats?.recent_scans?.length === 0 && (
                        <tr><td colSpan={4} className="px-8 py-6 text-center text-sm" style={{ color: subtext }}>{t.noScans}</td></tr>
                      )}
                      {stats?.recent_scans?.map((scan, i) => (
                        <tr key={i} style={{ borderTop: `1px solid ${border}` }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <td className="px-8 py-4 text-xs" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{scan.created_at?.slice(0, 19).replace('T', ' ')}</td>
                          <td className="px-8 py-4">
                            <div className="text-sm font-medium" style={{ color: text }}>{scan.filename}</div>
                            <div className="text-xs mt-0.5" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{(scan.file_size / (1024 * 1024)).toFixed(2)} MB</div>
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
                          <td className="px-8 py-4 text-right text-sm font-bold" style={{ color: text, fontFamily: 'JetBrains Mono, monospace' }}>{scan.recovered_count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
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

export default Reports