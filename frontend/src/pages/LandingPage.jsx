import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { systemService } from '../services/systemService'

export default function LandingPage() {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    systemService.getSettings().then(setSettings).catch(() => { })
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 font-sans overflow-x-hidden selection:bg-primary/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">ABDImu</span>
          </div>
          <div className="flex gap-4">
            <Link to="/login" className="btn-ghost hover:bg-gray-100 px-5 py-2.5 rounded-full font-medium transition-colors">
              Masuk
            </Link>
            <Link to="/login" className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-full font-medium shadow-xl shadow-gray-900/20 transition-all hover:-translate-y-0.5">
              Mulai Sekarang
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1200px] pointer-events-none -z-10">
          <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-pulse-slow"></div>
          <div className="absolute top-[30%] right-[10%] w-[400px] h-[400px] bg-emerald-400/20 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-[-10%] left-[30%] w-[600px] h-[600px] bg-blue-300/20 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-sm font-medium text-gray-600">Sistem Manajemen Publikasi Terpadu</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Platform Terintegrasi Penelitian dan<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">
              Pengabdian Masyarakat IAIMU
            </span>
          </h1>

          <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {settings?.description || 'Tingkatkan kualitas, efisiensi, dan visibilitas penelitian institusi Anda melalui platform manajemen publikasi ilmiah yang modern dan terintegrasi.'}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/login" className="bg-primary hover:bg-primary-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl shadow-primary/30 transition-all hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center gap-2">
              Masuk ke Sistem <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Fitur Unggulan</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Semua alat yang Anda butuhkan untuk mengelola publikasi ilmiah dari tahap pengumpulan hingga penerbitan.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '📝', title: 'Submit & Tracking Mudah', desc: 'Author dapat dengan mudah mengunggah paper dan memantau status setiap tahap review secara real-time.' },
              { icon: '👥', title: 'Manajemen Peer Review', desc: 'Sistem alokasi reviewer otomatis dan alur review yang terstruktur untuk memastikan kualitas publikasi.' },
              { icon: '📊', title: 'Dashboard Informatif', desc: 'Pantau kinerja, statistik publikasi, dan aktivitas terkini melalui dashboard intuitif dan komprehensif.' }
            ].map((feature, i) => (
              <div key={i} className="bg-slate-50 border border-gray-100 rounded-[2rem] p-8 hover:shadow-xl hover:shadow-gray-200/50 transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-gray-100 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="font-bold text-white tracking-tight text-lg">{settings?.title || 'ABDImu'}</span>
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} ABDImu. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
