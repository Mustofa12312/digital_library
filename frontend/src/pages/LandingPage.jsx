import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { systemService } from '../services/systemService'

export default function LandingPage() {
  const [settings, setSettings] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    systemService.getSettings().then(setSettings).catch(() => { })
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 font-sans overflow-x-hidden selection:bg-primary/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-bold text-base sm:text-lg">A</span>
            </div>
            <span className="font-bold text-lg sm:text-xl tracking-tight text-gray-900">ABDImu</span>
          </div>

          {/* Desktop buttons */}
          <div className="hidden sm:flex gap-3">
            <Link to="/login" className="btn-ghost hover:bg-gray-100 px-5 py-2.5 rounded-full font-medium transition-colors">
              Masuk
            </Link>
            <Link to="/login" className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-full font-medium shadow-xl shadow-gray-900/20 transition-all hover:-translate-y-0.5">
              Mulai Sekarang
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="sm:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 px-4 py-4 space-y-3 animate-fade-in">
            <Link
              to="/login"
              className="block w-full text-center py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Masuk
            </Link>
            <Link
              to="/login"
              className="block w-full text-center bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-medium shadow-lg"
              onClick={() => setMenuOpen(false)}
            >
              Mulai Sekarang
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1200px] pointer-events-none -z-10">
          <div className="absolute top-[10%] left-[5%] sm:left-[10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary/20 rounded-full blur-[80px] sm:blur-[120px] mix-blend-multiply opacity-70 animate-pulse-slow"></div>
          <div className="absolute top-[30%] right-[5%] sm:right-[10%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-emerald-400/20 rounded-full blur-[80px] sm:blur-[100px] mix-blend-multiply opacity-70 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-[-10%] left-[20%] sm:left-[30%] w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-blue-300/20 rounded-full blur-[80px] sm:blur-[120px] mix-blend-multiply opacity-70 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-6 sm:mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs sm:text-sm font-medium text-gray-600">Sistem Manajemen Publikasi Terpadu</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.15] sm:leading-[1.1] mb-6 sm:mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Platform Terintegrasi Penelitian dan{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">
              Pengabdian Masyarakat IAIMU
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed animate-fade-in-up px-2" style={{ animationDelay: '0.2s' }}>
            {settings?.description || 'Tingkatkan kualitas, efisiensi, dan visibilitas penelitian institusi Anda melalui platform manajemen publikasi ilmiah yang modern dan terintegrasi.'}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 animate-fade-in-up px-4 sm:px-0" style={{ animationDelay: '0.3s' }}>
            <Link to="/login" className="bg-primary hover:bg-primary-600 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-semibold text-base sm:text-lg shadow-xl shadow-primary/30 transition-all hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center gap-2">
              Masuk ke Sistem <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-24 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Fitur Unggulan</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-base sm:text-lg px-2">Semua alat yang Anda butuhkan untuk mengelola publikasi ilmiah dari tahap pengumpulan hingga penerbitan.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              { icon: '📝', title: 'Submit & Tracking Mudah', desc: 'Author dapat dengan mudah mengunggah paper dan memantau status setiap tahap review secara real-time.' },
              { icon: '👥', title: 'Manajemen Peer Review', desc: 'Sistem alokasi reviewer otomatis dan alur review yang terstruktur untuk memastikan kualitas publikasi.' },
              { icon: '📊', title: 'Dashboard Informatif', desc: 'Pantau kinerja, statistik publikasi, dan aktivitas terkini melalui dashboard intuitif dan komprehensif.' }
            ].map((feature, i) => (
              <div key={i} className="bg-slate-50 border border-gray-100 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 hover:shadow-xl hover:shadow-gray-200/50 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-sm border border-gray-100 mb-4 sm:mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 sm:py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="font-bold text-white tracking-tight text-lg">{settings?.title || 'ABDImu'}</span>
          </div>
          <p className="text-gray-500 text-sm text-center sm:text-right">
            © {new Date().getFullYear()} ABDImu. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
