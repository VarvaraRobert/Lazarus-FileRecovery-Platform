import { createContext, useContext, useState, useEffect } from 'react'
import API from '../services/api'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('dark')
  const [language, setLanguage] = useState('en')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    const loadPrefs = async () => {
      try {
        const res = await API.get('/api/me/preferences')
        setTheme(res.data.theme || 'dark')
        setLanguage(res.data.language || 'en')
      } catch {}
    }
    loadPrefs()
  }, [])

  const updateTheme = async (newTheme) => {
    setTheme(newTheme)
    try {
      await API.patch('/api/me/preferences', { theme: newTheme, language })
    } catch {}
  }

  const updateLanguage = async (newLanguage) => {
    setLanguage(newLanguage)
    try {
      await API.patch('/api/me/preferences', { theme, language: newLanguage })
    } catch {}
  }

  return (
    <AppContext.Provider value={{ theme, language, updateTheme, updateLanguage }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}