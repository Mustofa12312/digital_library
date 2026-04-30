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
    <div className="min-h-screen flex bg-background">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-secondary to-primary-800 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute top-3/4 left-1/3 w-48 h-48 rounded-full bg-white/5 blur-2xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <span className="text-2xl font-bold">A</span>
            </div>
            <div>
              <div className="text-xl font-bold">APMS</div>
              <div className="text-white/70 text-sm">Academic Publication Management</div>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Platform Publikasi
            <br />
            <span className="text-accent">Ilmiah Modern</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mb-10">
            Kelola jurnal, penelitian, dan proses review akademik dalam satu platform terintegrasi.
          </p>

          {/* Features */}
          {[
            { icon: '📄', text: 'Submit & track paper penelitian' },
            { icon: '🔍', text: 'Sistem peer review terstruktur' },
            { icon: '🌐', text: 'Publikasi digital terstandar' },
            { icon: '📊', text: 'Analytics & statistik lengkap' },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-3 mb-3">
              <span className="text-xl">{f.icon}</span>
              <span className="text-white/80">{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center px-6 lg:px-16">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="font-bold text-primary text-lg">APMS</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Masuk ke Akun</h2>
            <p className="text-gray-500 mt-2">Gunakan kredensial yang telah diberikan</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input pl-10"
                  placeholder="nama@email.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input pl-10 pr-10"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="btn-login"
              disabled={loading}
              className="btn-primary w-full btn-lg justify-center"
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span>Masuk...</span>
                </>
              ) : 'Masuk'}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-8 p-4 bg-background rounded-xl border border-accent/30">
            <p className="text-xs font-semibold text-gray-600 mb-2">🧪 Akun Demo:</p>
            <div className="space-y-1 text-xs text-gray-500">
              <div className="flex justify-between"><span>Super Admin:</span><span className="font-mono">superadmin@apms.com</span></div>
              <div className="flex justify-between"><span>Admin:</span><span className="font-mono">admin@apms.com</span></div>
              <div className="flex justify-between"><span>Reviewer:</span><span className="font-mono">reviewer1@apms.com</span></div>
              <div className="flex justify-between"><span>Author:</span><span className="font-mono">author1@apms.com</span></div>
              <div className="flex justify-between"><span>Password semua:</span><span className="font-mono font-semibold text-primary">password</span></div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link to="/publications" className="text-sm text-primary hover:underline">
              Lihat publikasi tanpa login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
