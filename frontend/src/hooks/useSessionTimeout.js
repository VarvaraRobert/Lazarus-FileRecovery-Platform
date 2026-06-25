import { useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const TIMEOUT_DURATION = 10 * 60 * 1000
const WARNING_BEFORE = 60 * 1000

export function useSessionTimeout() {
  const navigate = useNavigate()
  const timeoutRef = useRef(null)
  const warningRef = useRef(null)
  const warningCallbackRef = useRef(null)

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (warningRef.current) clearTimeout(warningRef.current)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    navigate('/login')
  }, [navigate])

  const resetTimer = useCallback(() => {
    if (!localStorage.getItem('token')) return
    clearTimers()

    warningRef.current = setTimeout(() => {
      if (warningCallbackRef.current) {
        warningCallbackRef.current()
      }
    }, TIMEOUT_DURATION - WARNING_BEFORE)

    timeoutRef.current = setTimeout(() => {
      logout()
    }, TIMEOUT_DURATION)
  }, [clearTimers, logout])

  const setWarningCallback = useCallback((cb) => {
    warningCallbackRef.current = cb
  }, [])

  useEffect(() => {
    if (!localStorage.getItem('token')) return

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click']
    
    const handleActivity = () => resetTimer()

    events.forEach(e => window.addEventListener(e, handleActivity))
    resetTimer()

    return () => {
      events.forEach(e => window.removeEventListener(e, handleActivity))
      clearTimers()
    }
  }, [resetTimer, clearTimers])

  return { setWarningCallback }
}