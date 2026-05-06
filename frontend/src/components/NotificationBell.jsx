import { useState, useEffect, useRef } from 'react'
import api from '../services/api'
import { Link } from 'react-router-dom'

const TYPE_ICONS = {
  paper_submitted:     '📄',
  paper_status_changed:'🔔',
  reviewer_assigned:   '👤',
  review_submitted:    '💬',
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(false)
  const ref = useRef(null)

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/notifications')
      setNotifications(data.notifications || [])
      setUnread(data.unread_count || 0)
    } catch {
      // silent fail
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000) // Poll every 30s
    return () => clearInterval(interval)
  }, [])

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const markRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/read`)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
      setUnread(prev => Math.max(0, prev - 1))
    } catch {}
  }

  const markAllRead = async () => {
    try {
      await api.post('/notifications/mark-all-read')
      setNotifications(prev => prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() })))
      setUnread(0)
    } catch {}
  }

  const deleteNotif = async (e, id) => {
    e.stopPropagation()
    try {
      await api.delete(`/notifications/${id}`)
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch {}
  }

  const formatTime = (dateStr) => {
    const d = new Date(dateStr)
    const now = new Date()
    const diff = Math.floor((now - d) / 1000)
    if (diff < 60) return 'Baru saja'
    if (diff < 3600) return `${Math.floor(diff / 60)} mnt lalu`
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`
    return `${Math.floor(diff / 86400)} hari lalu`
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
        aria-label="Notifikasi"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Mobile fullscreen overlay */}
          <div 
            className="fixed inset-0 bg-black/30 z-40 sm:hidden" 
            onClick={() => setOpen(false)} 
          />
          
          <div className="fixed inset-x-0 bottom-0 top-auto sm:absolute sm:inset-auto sm:right-0 sm:top-11 
            w-full sm:w-80 bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl sm:shadow-xl 
            border border-gray-100 z-50 overflow-hidden animate-fade-in
            max-h-[80vh] sm:max-h-none flex flex-col"
          >
            {/* Mobile drag indicator */}
            <div className="flex justify-center pt-2 sm:hidden">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
              <h3 className="font-bold text-gray-900 text-sm">Notifikasi</h3>
              <div className="flex items-center gap-3">
                {unread > 0 && (
                  <button onClick={markAllRead} className="text-xs text-primary hover:underline font-medium">
                    Tandai semua dibaca
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 sm:hidden"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {loading && notifications.length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-sm">Memuat...</div>
              ) : notifications.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="text-3xl mb-2">🔔</div>
                  <p className="text-sm text-gray-400">Belum ada notifikasi</p>
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => { if (!n.read_at) markRead(n.id); if (n.link) { setOpen(false); window.location.href = n.link } }}
                    className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors group ${!n.read_at ? 'bg-primary/2' : ''}`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${!n.read_at ? 'bg-primary/10' : 'bg-gray-100'}`}>
                      {TYPE_ICONS[n.type] || '🔔'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug ${!n.read_at ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                        {n.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{formatTime(n.created_at)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {!n.read_at && (
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                      )}
                      <button
                        onClick={(e) => deleteNotif(e, n.id)}
                        className="opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 w-5 h-5 rounded text-gray-300 hover:text-red-400 transition-all text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
