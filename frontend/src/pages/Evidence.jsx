import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'
import { useApp } from '../context/AppContext'
import NotificationPanel from '../components/NotificationPanel'

const translations = {
  en: {
    dashboard: 'Dashboard', evidence: 'Evidence', reports: 'Reports', archives: 'Archives',
    logout: 'Logout', title: 'Evidence Vault',
    subtitle: 'Secure cold-storage for all active forensic investigations.',
    filterPlaceholder: 'Filter cases...', newCase: '+ New Case',
    activeRegistries: 'Active Registries', noCases: 'No cases found. Create one to get started.',
    files: 'Files', newCaseTitle: 'New Case', caseName: 'Case name',
    description: 'Description', create: 'Create', cancel: 'Cancel',
    loading: 'Loading cases...', selectCase: 'Select a case to view details.',
    investigator: 'Investigator', status: 'Status', notes: 'Notes',
    notesPlaceholder: 'Add investigation notes...', recoveredArtifacts: 'Recovered Artifacts',
    objects: 'Objects', fileLinking: 'File linking coming soon.',
    fileLinkingDesc: 'You\'ll be able to attach recovered files from scans to this case.',
    delete: 'Delete', overview: 'Overview', fileRecovery: 'File Recovery',
    hexViewer: 'Hex Viewer', auditLog: 'Audit Log',
    newScan: 'NEW SCAN', active: 'Active', pending: 'Pending', closed: 'Closed',
  },
  de: {
    dashboard: 'Armaturenbrett', evidence: 'Beweise', reports: 'Berichte', archives: 'Archive',
    logout: 'Abmelden', title: 'Beweismittel-Tresor',
    subtitle: 'Sicherer Kaltlager für alle aktiven forensischen Untersuchungen.',
    filterPlaceholder: 'Fälle filtern...', newCase: '+ Neuer Fall',
    activeRegistries: 'Aktive Register', noCases: 'Keine Fälle gefunden. Erstellen Sie einen.',
    files: 'Dateien', newCaseTitle: 'Neuer Fall', caseName: 'Fallname',
    description: 'Beschreibung', create: 'Erstellen', cancel: 'Abbrechen',
    loading: 'Fälle werden geladen...', selectCase: 'Wählen Sie einen Fall aus.',
    investigator: 'Ermittler', status: 'Status', notes: 'Notizen',
    notesPlaceholder: 'Untersuchungsnotizen hinzufügen...', recoveredArtifacts: 'Wiederhergestellte Artefakte',
    objects: 'Objekte', fileLinking: 'Dateiverknüpfung demnächst verfügbar.',
    fileLinkingDesc: 'Sie können wiederhergestellte Dateien mit diesem Fall verknüpfen.',
    delete: 'Löschen', overview: 'Übersicht', fileRecovery: 'Dateiwiederherstellung',
    hexViewer: 'Hex-Viewer', auditLog: 'Prüfprotokoll',
    newScan: 'NEUER SCAN', active: 'Aktiv', pending: 'Ausstehend', closed: 'Geschlossen',
  },
  fr: {
    dashboard: 'Tableau de bord', evidence: 'Preuves', reports: 'Rapports', archives: 'Archives',
    logout: 'Déconnexion', title: 'Coffre à preuves',
    subtitle: 'Stockage sécurisé pour toutes les enquêtes forensiques actives.',
    filterPlaceholder: 'Filtrer les dossiers...', newCase: '+ Nouveau dossier',
    activeRegistries: 'Registres actifs', noCases: 'Aucun dossier trouvé. Créez-en un.',
    files: 'Fichiers', newCaseTitle: 'Nouveau dossier', caseName: 'Nom du dossier',
    description: 'Description', create: 'Créer', cancel: 'Annuler',
    loading: 'Chargement des dossiers...', selectCase: 'Sélectionnez un dossier.',
    investigator: 'Enquêteur', status: 'Statut', notes: 'Notes',
    notesPlaceholder: 'Ajouter des notes d\'enquête...', recoveredArtifacts: 'Artefacts récupérés',
    objects: 'Objets', fileLinking: 'Liaison de fichiers bientôt disponible.',
    fileLinkingDesc: 'Vous pourrez lier les fichiers récupérés à ce dossier.',
    delete: 'Supprimer', overview: 'Aperçu', fileRecovery: 'Récupération',
    hexViewer: 'Visionneuse Hex', auditLog: 'Journal d\'audit',
    newScan: 'NOUVEAU SCAN', active: 'Actif', pending: 'En attente', closed: 'Fermé',
  }
}

function Evidence() {
  const [user, setUser] = useState(null)
  const [cases, setCases] = useState([])
  const [selectedCase, setSelectedCase] = useState(null)
  const [search, setSearch] = useState('')
  const [showNewCase, setShowNewCase] = useState(false)
  const [newCase, setNewCase] = useState({ name: '', description: '', status: 'Active' })
  const [loading, setLoading] = useState(true)
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
  const input = isDark ? '#2e3545' : '#e2e8f0'
  const detailHeader = isDark ? 'rgba(35,42,58,0.4)' : 'rgba(0,0,0,0.03)'

  useEffect(() => {
    const init = async () => {
      try {
        const res = await API.get('/api/me')
        setUser(res.data)
        const casesRes = await API.get('/cases/')
        const casesData = Array.isArray(casesRes.data) ? casesRes.data : []
        setCases(casesData)
        if (casesData.length > 0) setSelectedCase(casesData[0])
      } catch {
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const handleCreateCase = async () => {
    if (!newCase.name) return
    try {
      const res = await API.post('/cases/', newCase)
      const updatedRes = await API.get('/cases/')
      const updatedCases = Array.isArray(updatedRes.data) ? updatedRes.data : []
      setCases(updatedCases)
      setSelectedCase(res.data)
      setShowNewCase(false)
      setNewCase({ name: '', description: '', status: 'Active' })
    } catch {}
  }

  const handleUpdateNotes = async (notes) => {
    if (!selectedCase) return
    try {
      const res = await API.patch(`/cases/${selectedCase.id}`, { notes })
      setCases(cases.map(c => c.id === selectedCase.id ? res.data : c))
      setSelectedCase(res.data)
    } catch {}
  }

  const handleStatusChange = async (status) => {
    if (!selectedCase) return
    try {
      const res = await API.patch(`/cases/${selectedCase.id}`, { status })
      setCases(cases.map(c => c.id === selectedCase.id ? res.data : c))
      setSelectedCase(res.data)
    } catch {}
  }

  const handleDeleteCase = async () => {
    if (!selectedCase) return
    try {
      await API.delete(`/cases/${selectedCase.id}`)
      const remaining = cases.filter(c => c.id !== selectedCase.id)
      setCases(remaining)
      setSelectedCase(remaining[0] || null)
    } catch {}
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const filteredCases = cases.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.case_id.toLowerCase().includes(search.toLowerCase())
  )

  const statusColor = (status) => {
    if (status === 'Active') return { bg: 'rgba(78,222,163,0.1)', color: '#4edea3', border: 'rgba(78,222,163,0.2)' }
    if (status === 'Pending') return { bg: 'rgba(255,179,173,0.1)', color: '#ffb3ad', border: 'rgba(255,179,173,0.2)' }
    return { bg: 'rgba(100,116,139,0.1)', color: subtext, border: 'rgba(100,116,139,0.2)' }
  }

  const statusBorderColor = (status) => {
    if (status === 'Active') return '#4edea3'
    if (status === 'Pending') return '#ffb3ad'
    return '#334155'
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: bg, color: text }}>

      <header className="flex justify-between items-center w-full px-6 py-4 z-50 shadow-xl sticky top-0" style={{ backgroundColor: bg }}>
        <div className="flex items-center gap-8">
          <span className="text-2xl font-bold tracking-tighter" style={{ color: '#3b82f6', fontFamily: 'Space Grotesk, sans-serif' }}>LAZARUS</span>
          <nav className="hidden md:flex gap-6">
            <a className="transition-colors" style={{ color: subtext }} onClick={() => navigate('/dashboard')} href="#">{t.dashboard}</a>
            <a className="font-bold border-b-2 pb-1" style={{ color: '#3b82f6', borderColor: '#3b82f6' }} href="#">{t.evidence}</a>
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

        <section className="lg:col-span-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl border" style={{ backgroundColor: cardAlt, borderColor: border }}>
                <span className="material-symbols-outlined text-3xl" style={{ color: '#adc6ff' }}>enhanced_encryption</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{t.title}</h1>
                <p className="text-sm" style={{ color: subtext }}>{t.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-sm" style={{ color: subtext }}>search</span>
                <input type="text" placeholder={t.filterPlaceholder} value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="rounded-lg pl-9 pr-4 py-2 text-sm outline-none"
                  style={{ backgroundColor: card, color: text, border: `1px solid ${border}` }} />
              </div>
              <button onClick={() => setShowNewCase(true)}
                className="px-5 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all active:scale-95"
                style={{ backgroundColor: '#adc6ff', color: '#002e6a' }}>
                <span className="material-symbols-outlined text-sm">add_box</span>
                {t.newCase}
              </button>
            </div>
          </div>

          {showNewCase && (
            <div className="rounded-xl p-6 border" style={{ backgroundColor: card, borderColor: 'rgba(173,198,255,0.2)' }}>
              <h3 className="font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{t.newCaseTitle}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" placeholder={t.caseName} value={newCase.name}
                  onChange={e => setNewCase({ ...newCase, name: e.target.value })}
                  className="rounded-lg px-4 py-2 text-sm outline-none"
                  style={{ backgroundColor: input, color: text, border: `1px solid ${border}` }} />
                <input type="text" placeholder={t.description} value={newCase.description}
                  onChange={e => setNewCase({ ...newCase, description: e.target.value })}
                  className="rounded-lg px-4 py-2 text-sm outline-none"
                  style={{ backgroundColor: input, color: text, border: `1px solid ${border}` }} />
                <select value={newCase.status} onChange={e => setNewCase({ ...newCase, status: e.target.value })}
                  className="rounded-lg px-4 py-2 text-sm outline-none"
                  style={{ backgroundColor: input, color: text, border: `1px solid ${border}` }}>
                  <option value="Active">{t.active}</option>
                  <option value="Pending">{t.pending}</option>
                  <option value="Closed">{t.closed}</option>
                </select>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={handleCreateCase} className="px-5 py-2 rounded-lg font-bold text-sm" style={{ backgroundColor: '#adc6ff', color: '#002e6a' }}>{t.create}</button>
                <button onClick={() => setShowNewCase(false)} className="px-5 py-2 rounded-lg text-sm" style={{ backgroundColor: cardAlt, color: subtext }}>{t.cancel}</button>
              </div>
            </div>
          )}

          {loading ? (
            <p style={{ color: subtext }}>{t.loading}</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <p className="text-xs uppercase tracking-widest px-1" style={{ color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>{t.activeRegistries}</p>
                {filteredCases.length === 0 && (
                  <p className="text-sm px-1" style={{ color: subtext }}>{t.noCases}</p>
                )}
                {filteredCases.map(c => (
                  <div key={c.id} onClick={() => setSelectedCase(c)}
                    className="p-5 rounded-2xl cursor-pointer transition-all duration-200"
                    style={{
                      backgroundColor: selectedCase?.id === c.id ? cardAlt : card,
                      border: `1px solid ${border}`,
                      borderLeft: `4px solid ${statusBorderColor(c.status)}`,
                      opacity: c.status === 'Closed' ? 0.6 : 1,
                    }}
                    onMouseEnter={e => { if (selectedCase?.id !== c.id) e.currentTarget.style.backgroundColor = isDark ? '#1a2235' : '#e8edf2' }}
                    onMouseLeave={e => { if (selectedCase?.id !== c.id) e.currentTarget.style.backgroundColor = card }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-bold" style={{ color: '#adc6ff', fontFamily: 'JetBrains Mono, monospace' }}>{c.case_id}</span>
                      <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider border"
                        style={{ backgroundColor: statusColor(c.status).bg, color: statusColor(c.status).color, borderColor: statusColor(c.status).border }}>
                        {c.status}
                      </span>
                    </div>
                    <h3 className="font-bold mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif', color: text }}>{c.name}</h3>
                    <p className="text-xs mb-3 line-clamp-2" style={{ color: subtext }}>{c.description}</p>
                    <div className="flex justify-between text-xs pt-3 border-t" style={{ borderColor: border, color: subtext, fontFamily: 'JetBrains Mono, monospace' }}>
                      <span>📅 {c.created_at?.slice(0, 10)}</span>
                      <span>📁 {c.file_count} {t.files}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-2">
                {!selectedCase ? (
                  <div className="rounded-3xl p-8 border flex items-center justify-center h-64" style={{ backgroundColor: card, borderColor: border }}>
                    <p style={{ color: subtext }}>{t.selectCase}</p>
                  </div>
                ) : (
                  <div className="rounded-3xl border overflow-hidden" style={{ backgroundColor: card, borderColor: border }}>
                    <div className="p-7 border-b" style={{ backgroundColor: detailHeader, borderColor: border }}>
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl flex items-center justify-center border" style={{ backgroundColor: 'rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,0.2)' }}>
                            <span className="material-symbols-outlined text-3xl" style={{ color: '#60a5fa' }}>folder_open</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h2 className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{selectedCase.name}</h2>
                              <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#60a5fa', fontFamily: 'JetBrains Mono, monospace' }}>{selectedCase.case_id}</span>
                            </div>
                            <div className="flex items-center gap-4 text-xs" style={{ color: subtext }}>
                              <span>👤 {t.investigator}: {selectedCase.investigator}</span>
                              <span>🔒 {t.status}: {selectedCase.status}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <select value={selectedCase.status} onChange={e => handleStatusChange(e.target.value)}
                            className="rounded-lg px-3 py-2 text-xs outline-none"
                            style={{ backgroundColor: input, color: text, border: `1px solid ${border}`, fontFamily: 'JetBrains Mono, monospace' }}>
                            <option value="Active">{t.active}</option>
                            <option value="Pending">{t.pending}</option>
                            <option value="Closed">{t.closed}</option>
                          </select>
                          <button onClick={handleDeleteCase} className="px-3 py-2 rounded-lg text-xs"
                            style={{ backgroundColor: 'rgba(147,0,10,0.2)', color: '#ffb4ab', border: '1px solid rgba(147,0,10,0.3)' }}>
                            {t.delete}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-7">
                      <h3 className="font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{t.notes}</h3>
                      <textarea rows={4} placeholder={t.notesPlaceholder}
                        defaultValue={selectedCase.notes}
                        onBlur={e => handleUpdateNotes(e.target.value)}
                        className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
                        style={{ backgroundColor: input, color: text, border: `1px solid ${border}`, fontFamily: 'JetBrains Mono, monospace' }} />

                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{t.recoveredArtifacts}</h3>
                          <span className="text-xs px-3 py-1 rounded-full border" style={{ color: subtext, borderColor: border, fontFamily: 'JetBrains Mono, monospace' }}>
                            {selectedCase.file_count} {t.objects}
                          </span>
                        </div>
                        <div className="rounded-xl p-6 border text-center" style={{ backgroundColor: bg, borderColor: border }}>
                          <span className="material-symbols-outlined text-4xl mb-2 block" style={{ color: subtext }}>link</span>
                          <p className="text-sm" style={{ color: subtext }}>{t.fileLinking}</p>
                          <p className="text-xs mt-1" style={{ color: subtext }}>{t.fileLinkingDesc}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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

export default Evidence