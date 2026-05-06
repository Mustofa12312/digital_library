import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Spinner } from '../components/Loader'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(email, password)
      toast.success(`Selamat datang, ${user.name}!`)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Login gagal. Periksa email dan password.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[50%] rounded-full bg-primary/20 blur-[120px] mix-blend-multiply animate-pulse-slow"></div>
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[120px] mix-blend-multiply animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[40%] rounded-full bg-secondary/20 blur-[120px] mix-blend-multiply animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Glass Container */}
      <div className="relative z-10 flex flex-col lg:flex-row w-full max-w-[1100px] mx-4 sm:mx-6 rounded-2xl sm:rounded-[2.5rem] bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden">
        
        {/* Left Side (Features) */}
        <div className="hidden lg:flex lg:w-[45%] p-12 flex-col justify-between bg-primary/95 text-white relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                <span className="text-2xl font-bold">A</span>
              </div>
              <div>
                <div className="text-xl font-bold tracking-wider">ABDImu</div>
                <div className="text-white/60 text-xs">Platform Terintegrasi Penelitian dan Pengabdian Masyarakat IAIMU</div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-5 leading-tight">
              Platform Publikasi<br/>
              <span className="text-accent">Ilmiah Modern</span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-10">
              Sistem manajemen pengumpulan jurnal, peer review, hingga publikasi dalam satu pintu.
            </p>
            
            <div className="space-y-4">
              {[
                { icon: '📄', text: 'Submit & track paper penelitian' },
                { icon: '🔍', text: 'Sistem peer review terstruktur' },
                { icon: '🌐', text: 'Publikasi digital terstandar' },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/5 hover:bg-white/10 transition-colors p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">{f.icon}</div>
                  <span className="text-white/90 font-medium text-sm">{f.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative z-10 text-xs text-white/40 mt-12">
            © 2026 ABDImu
          </div>
        </div>

        {/* Right Side (Form) */}
        <div className="flex-1 p-6 sm:p-8 lg:p-16 flex flex-col justify-center bg-white/50 relative">
          <div className="w-full max-w-md mx-auto relative z-10">
            {/* Mobile logo */}
            <div className="flex items-center gap-3 mb-8 lg:hidden">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="font-bold text-gray-900 text-xl tracking-wider">ABDImu</span>
            </div>

            <div className="mb-6 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Masuk ke Akun</h2>
              <p className="text-sm sm:text-base text-gray-500">Gunakan kredensial yang telah diberikan oleh institusi</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="form-group">
                <label className="form-label text-gray-700" htmlFor="email">Email</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input pl-11 bg-white/80 backdrop-blur-sm border-gray-200 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm hover:bg-white/90 rounded-xl py-3.5 w-full"
                    placeholder="nama@email.com"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label text-gray-700" htmlFor="password">Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input pl-11 pr-11 bg-white/80 backdrop-blur-sm border-gray-200 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm hover:bg-white/90 rounded-xl py-3.5 w-full"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="btn-login"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center py-3.5 sm:py-4 rounded-xl text-base font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 mt-6 sm:mt-8"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="ml-2">Memproses...</span>
                  </>
                ) : 'Masuk ke Dashboard'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400">
                Lupa kata sandi?{' '}
                <Link
                  to="/forgot-password"
                  className="text-primary hover:underline font-medium"
                >
                  Klik di sini
                </Link>
              </p>
            </div>




          </div>
        </div>
      </div>
    </div>
  )
}
