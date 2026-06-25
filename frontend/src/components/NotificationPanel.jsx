import { useEffect, useState, useRef } from 'react'
import API from '../services/api'

function NotificationPanel() {
  const [notifications, setNotifications] = useState([])
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(0)
  const panelRef = useRef(null)

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications/')
      setNotifications(res.data)
      setUnread(res.data.filter(n => !n.read).length)
    } catch {}
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 15000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMarkAllRead = async () => {
    try {
      await API.patch('/notifications/read-all')
      fetchNotifications()
    } catch {}
  }

  const handleMarkRead = async (id) => {
    try {
      await API.patch(`/notifications/${id}/read`)
      fetchNotifications()
    } catch {}
  }

  const typeIcon = (type) => {
    if (type === 'success') return { icon: 'check_circle', color: '#4edea3' }
    if (type === 'warning') return { icon: 'warning', color: '#ffb3ad' }
    if (type === 'error') return { icon: 'error', color: '#ff5451' }
    return { icon: 'info', color: '#adc6ff' }
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg relative transition-all"
        style={{ color: '#94a3b8' }}
      >
        <span className="material-symbols-outlined">notifications</span>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
            style={{ backgroundColor: '#ff5451', color: '#ffffff' }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl shadow-2xl z-50 overflow-hidden"
          style={{ backgroundColor: '#141b2b', border: '1px solid rgba(66,71,84,0.3)' }}>

          <div className="px-4 py-3 border-b flex justify-between items-center"
            style={{ borderColor: 'rgba(66,71,84,0.3)' }}>
            <span className="font-bold text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#dce2f7' }}>
              Notifications
            </span>
            {unread > 0 && (
              <button onClick={handleMarkAllRead}
                className="text-xs transition-colors"
                style={{ color: '#3b82f6', fontFamily: 'JetBrains Mono, monospace' }}>
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <span className="material-symbols-outlined text-3xl block mb-2" style={{ color: '#374151' }}>notifications_off</span>
                <p className="text-xs" style={{ color: '#64748b' }}>No notifications yet</p>
              </div>
            ) : (
              notifications.map(n => (
                <div key={n.id}
                  onClick={() => !n.read && handleMarkRead(n.id)}
                  className="px-4 py-3 border-b cursor-pointer transition-all"
                  style={{
                    borderColor: 'rgba(66,71,84,0.15)',
                    backgroundColor: n.read ? 'transparent' : 'rgba(59,130,246,0.05)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = n.read ? 'transparent' : 'rgba(59,130,246,0.05)'}
                >
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-sm mt-0.5" style={{ color: typeIcon(n.type).color }}>
                      {typeIcon(n.type).icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-bold" style={{ color: '#dce2f7' }}>{n.title}</p>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full flex-shrink-0 ml-2 mt-1" style={{ backgroundColor: '#3b82f6' }}></span>
                        )}
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>{n.message}</p>
                      <p className="text-xs mt-1" style={{ color: '#374151', fontFamily: 'JetBrains Mono, monospace' }}>
                        {n.created_at?.slice(0, 16).replace('T', ' ')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationPanel