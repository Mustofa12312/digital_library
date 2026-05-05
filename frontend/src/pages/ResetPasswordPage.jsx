import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Spinner } from '../components/Loader'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const [form, setForm] = useState({
    token: '',
    email: '',
    password: '',
    password_confirmation: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = searchParams.get('token')
    const email = searchParams.get('email')
    
    if (!token || !email) {
      toast.error('Link reset tidak valid atau tidak lengkap')
      navigate('/login')
      return
    }

    setForm(prev => ({ ...prev, token, email }))
  }, [searchParams, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.password_confirmation) {
      toast.error('Konfirmasi kata sandi tidak cocok')
      return
    }

    setLoading(true)
    try {
      const { data } = await api.post('/reset-password', form)
      toast.success(data.message || 'Password berhasil diubah!')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengubah password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">ABDImu</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Reset Kata Sandi</h1>
          <p className="text-gray-500 mt-2">Buat kata sandi baru untuk akun <span className="font-semibold text-gray-700">{form.email}</span></p>
        </div>

        <div className="card card-body shadow-xl border-none p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label className="form-label" htmlFor="password">Kata Sandi Baru</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                <input
                  id="password"
                  type="password"
                  className="form-input pl-11"
                  placeholder="Minimal 8 karakter"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password_confirmation">Konfirmasi Kata Sandi</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">🔄</span>
                <input
                  id="password_confirmation"
                  type="password"
                  className="form-input pl-11"
                  placeholder="Ulangi kata sandi baru"
                  value={form.password_confirmation}
                  onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary h-12 text-base shadow-lg shadow-primary/20"
            >
              {loading ? <Spinner size="sm" /> : '💾 Simpan Password Baru'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
