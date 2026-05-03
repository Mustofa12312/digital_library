import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Spinner } from '../components/Loader'

export default function ProfilePage() {
  const { user, login } = useAuth() // login method also updates user state if we pass new token or we just refetch
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    institution: '',
    current_password: '',
    password: '',
    password_confirmation: ''
  })

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        institution: user.institution || ''
      }))
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.put('/profile', form)
      toast.success(data.message || 'Profil berhasil diperbarui')
      // Clear passwords
      setForm(prev => ({ ...prev, current_password: '', password: '', password_confirmation: '' }))
      // Update local user state
      // This is a bit hacky, ideally we have an updateUser function in useAuth
      window.location.reload()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal memperbarui profil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="page-header mb-8">
        <h1 className="page-title">Profil Saya 👤</h1>
        <p className="page-subtitle">Kelola informasi akun dan kata sandi Anda</p>
      </div>

      <div className="card card-body">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Informasi Dasar</h3>
            
            <div className="form-group">
              <label className="form-label">Nama Lengkap</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Institusi / Afiliasi</label>
              <input
                type="text"
                value={form.institution}
                onChange={e => setForm({...form, institution: e.target.value})}
                className="form-input"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Ubah Kata Sandi (Opsional)</h3>
            <p className="text-xs text-gray-500">Kosongkan jika tidak ingin mengubah kata sandi.</p>

            <div className="form-group">
              <label className="form-label">Kata Sandi Saat Ini</label>
              <input
                type="password"
                value={form.current_password}
                onChange={e => setForm({...form, current_password: e.target.value})}
                className="form-input"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Kata Sandi Baru</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  className="form-input"
                  minLength={8}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Konfirmasi Kata Sandi</label>
                <input
                  type="password"
                  value={form.password_confirmation}
                  onChange={e => setForm({...form, password_confirmation: e.target.value})}
                  className="form-input"
                  minLength={8}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? <Spinner size="sm" /> : '💾 Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
