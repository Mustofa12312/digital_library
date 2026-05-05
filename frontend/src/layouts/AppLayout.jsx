import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getInitials, ROLE_LABELS } from '../utils/helpers'
import toast from 'react-hot-toast'
import NotificationBell from '../components/NotificationBell'

const adminNav = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/papers', icon: '📄', label: 'Manajemen Paper' },
  { to: '/users', icon: '👥', label: 'Manajemen User' },
]

const superAdminNav = [
  ...adminNav,
  { to: '/settings', icon: '⚙️', label: 'Pengaturan Sistem' },
]

const authorNav = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/my-papers', icon: '📄', label: 'Paper Saya' },
  { to: '/submit-paper', icon: '➕', label: 'Submit Paper' },
]

const reviewerNav = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/review-queue', icon: '🔍', label: 'Antrian Review' },
]

export default function AppLayout({ children }) {
  const { user, logout, isAdmin, isReviewer } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = user?.role === 'super_admin' ? superAdminNav : isAdmin() ? adminNav : isReviewer() ? reviewerNav : authorNav

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
      toast.success('Berhasil logout')
    } catch {
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex flex-col transition-all duration-300 
        ${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg border-r border-gray-100`}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 py-5 border-b border-gray-100 ${!sidebarOpen && 'justify-center'}`}>
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          {sidebarOpen && (
            <div className="animate-fade-in overflow-hidden">
              <div className="font-bold text-primary text-sm leading-tight">ABDImu</div>
              <div className="text-xs text-gray-400 leading-tight">Jurnal Ilmiah</div>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-link ${location.pathname === item.to ? 'active' : ''} ${!sidebarOpen ? 'justify-center px-2' : ''}`}
              title={!sidebarOpen ? item.label : ''}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </Link>
          ))}

          {/* Public publications link */}
          <div className="pt-2 border-t border-gray-100 mt-2">
            {sidebarOpen && (
              <div className="px-4 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Publik</div>
            )}
            <Link
              to="/publications"
              className={`nav-link ${location.pathname === '/publications' ? 'active' : ''} ${!sidebarOpen ? 'justify-center px-2' : ''}`}
              title={!sidebarOpen ? 'Publikasi Ilmiah' : ''}
            >
              <span className="text-lg flex-shrink-0">🌐</span>
              {sidebarOpen && <span className="truncate">Publikasi Ilmiah</span>}
            </Link>
          </div>
        </nav>

        {/* User profile */}
        <div className={`px-3 py-4 border-t border-gray-100`}>
          {sidebarOpen ? (
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-background">
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">{getInitials(user?.name)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <Link to="/profile" className="text-sm font-semibold text-gray-800 truncate hover:text-primary transition-colors block">{user?.name}</Link>
                <div className="text-xs text-gray-400">{ROLE_LABELS[user?.role]}</div>
              </div>
              <button
                onClick={handleLogout}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Logout"
                aria-label="Logout"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex justify-center p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Top navbar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 h-16 flex items-center justify-between shadow-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-3">
            <NotificationBell />
            <div className="flex items-center gap-2 pl-2 border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-gray-900 leading-none">{user?.name}</p>
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">{user?.role?.replace('_', ' ')}</p>
              </div>
              <Link to="/profile" className="w-9 h-9 rounded-xl overflow-hidden shadow-sm hover:ring-2 hover:ring-primary/20 transition-all">
                {user?.avatar_path ? (
                  <img src={`/storage/${user.avatar_path}`} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
                    {getInitials(user?.name)}
                  </div>
                )}
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}
