import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import NotificationPanel from '../components/NotificationPanel'

const translations = {
  en: {
    dashboard: 'Dashboard', evidence: 'Evidence', reports: 'Reports', archives: 'Archives',
    logout: 'Logout', title: 'Settings',
    subtitle: 'Manage your account preferences and application settings.',
    appearance: 'Appearance', darkMode: 'Dark Mode', lightMode: 'Light Mode',
    darkDesc: 'Default dark forensics theme.', lightDesc: 'Light theme for bright environments.',
    language: 'Language', langDesc: 'Select your preferred interface language.',
    save: 'Preferences saved automatically.',
    overview: 'Overview', fileRecovery: 'File Recovery', hexViewer: 'Hex Viewer',
    auditLog: 'Audit Log', newScan: 'NEW SCAN',
  },
  de: {
    dashboard: 'Armaturenbrett', evidence: 'Beweise', reports: 'Berichte', archives: 'Archive',
    logout: 'Abmelden', title: 'Einstellungen',
    subtitle: 'Verwalten Sie Ihre Konto-Einstellungen und Anwendungsvoreinstellungen.',
    appearance: 'Erscheinungsbild', darkMode: 'Dunkler Modus', lightMode: 'Heller Modus',
    darkDesc: 'Standard dunkles Forensik-Theme.', lightDesc: 'Helles Theme für helle Umgebungen.',
    language: 'Sprache', langDesc: 'Wählen Sie Ihre bevorzugte Sprache.',
    save: 'Einstellungen automatisch gespeichert.',
    overview: 'Übersicht', fileRecovery: 'Dateiwiederherstellung', hexViewer: 'Hex-Viewer',
    auditLog: 'Prüfprotokoll', newScan: 'NEUER SCAN',
  },
  fr: {
    dashboard: 'Tableau de bord', evidence: 'Preuves', reports: 'Rapports', archives: 'Archives',
    logout: 'Déconnexion', title: 'Paramètres',
    subtitle: 'Gérez vos préférences de compte et les paramètres de l\'application.',
    appearance: 'Apparence', darkMode: 'Mode Sombre', lightMode: 'Mode Clair',
    darkDesc: 'Thème sombre forensique par défaut.', lightDesc: 'Thème clair pour les environnements lumineux.',
    language: 'Langue', langDesc: 'Sélectionnez votre langue d\'interface préférée.',
    save: 'Préférences sauvegardées automatiquement.',
    overview: 'Aperçu', fileRecovery: 'Récupération', hexViewer: 'Visionneuse Hex',
    auditLog: 'Journal d\'audit', newScan: 'NOUVEAU SCAN',
  }
}

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
]

function Settings() {
  const navigate = useNavigate()
  const { theme, language, updateTheme, updateLanguage } = useApp()
  const t = translations[language] || translations.en
  const isDark = theme === 'dark'
  const bg = isDark ? '#0c1322' : '#f1f5f9'
  const card = isDark ? '#141b2b' : '#ffffff'
  const text = isDark ? '#dce2f7' : '#1e293b'
  const subtext = isDark ? '#64748b' : '#94a3b8'
  const border = isDark ? 'rgba(66,71,84,0.2)' : 'rgba(0,0,0,0.08)'

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
          <NotificationPanel />
          <button onClick={() => navigate('/settings')} className="p-2 rounded-lg" style={{ color: '#3b82f6' }}>
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
                onClick={(e) => { e.preventDefault(); navigate(item.path) }}
                className="py-3 px-4 flex items-center gap-3 transition-all duration-200"
                style={{ color: subtext }}
                onMouseEnter={e => { e.currentTarget.style.color = text; e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}
                onMouseLeave={e => { e.currentTarget.style.color = subtext; e.currentTarget.style.backgroundColor = 'transparent' }}
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
          <div className="mb-4">
            <h1 className="text-3xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{t.title}</h1>
            <p className="text-sm mt-1" style={{ color: subtext }}>{t.subtitle}</p>
          </div>

          <div className="p-6 rounded-xl border" style={{ backgroundColor: card, borderColor: border }}>
            <h2 className="font-bold mb-4 flex items-center gap-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <span className="material-symbols-outlined" style={{ color: '#adc6ff' }}>palette</span>
              {t.appearance}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div onClick={() => updateTheme('dark')}
                className="p-4 rounded-xl border-2 cursor-pointer transition-all"
                style={{ borderColor: theme === 'dark' ? '#3b82f6' : border, backgroundColor: '#0c1322' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold" style={{ color: '#dce2f7', fontFamily: 'Space Grotesk, sans-serif' }}>{t.darkMode}</span>
                  {theme === 'dark' && <span className="material-symbols-outlined text-sm" style={{ color: '#3b82f6' }}>check_circle</span>}
                </div>
                <p className="text-xs" style={{ color: '#64748b' }}>{t.darkDesc}</p>
                <div className="mt-3 flex gap-2">
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: '#141b2b' }}></div>
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: '#232a3a' }}></div>
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
                </div>
              </div>

              <div onClick={() => updateTheme('light')}
                className="p-4 rounded-xl border-2 cursor-pointer transition-all"
                style={{ borderColor: theme === 'light' ? '#3b82f6' : border, backgroundColor: '#f8fafc' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold" style={{ color: '#1e293b', fontFamily: 'Space Grotesk, sans-serif' }}>{t.lightMode}</span>
                  {theme === 'light' && <span className="material-symbols-outlined text-sm" style={{ color: '#3b82f6' }}>check_circle</span>}
                </div>
                <p className="text-xs" style={{ color: '#94a3b8' }}>{t.lightDesc}</p>
                <div className="mt-3 flex gap-2">
                  <div className="w-6 h-6 rounded border" style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}></div>
                  <div className="w-6 h-6 rounded border" style={{ backgroundColor: '#f1f5f9', borderColor: '#e2e8f0' }}></div>
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl border" style={{ backgroundColor: card, borderColor: border }}>
            <h2 className="font-bold mb-1 flex items-center gap-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <span className="material-symbols-outlined" style={{ color: '#adc6ff' }}>language</span>
              {t.language}
            </h2>
            <p className="text-xs mb-4" style={{ color: subtext }}>{t.langDesc}</p>
            <div className="flex gap-3">
              {languages.map(lang => (
                <button key={lang.code} onClick={() => updateLanguage(lang.code)}
                  className="px-5 py-3 rounded-xl font-bold text-sm transition-all border-2"
                  style={{
                    borderColor: language === lang.code ? '#3b82f6' : border,
                    backgroundColor: language === lang.code ? 'rgba(59,130,246,0.1)' : 'transparent',
                    color: language === lang.code ? '#3b82f6' : subtext,
                    fontFamily: 'JetBrains Mono, monospace'
                  }}>
                  {lang.flag} {lang.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs" style={{ color: '#4edea3', fontFamily: 'JetBrains Mono, monospace' }}>
            ✓ {t.save}
          </p>
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

export default Settings