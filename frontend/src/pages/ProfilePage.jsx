import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Spinner } from '../components/Loader'
import { getInitials } from '../utils/helpers'

export default function ProfilePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const fileRef = useRef(null)
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

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Preview
    const reader = new FileReader()
    reader.onload = (ev) => setAvatarPreview(ev.target.result)
    reader.readAsDataURL(file)

    // Upload
    setAvatarLoading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      const { data } = await api.post('/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success(data.message || 'Avatar berhasil diperbarui!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal upload avatar')
      setAvatarPreview(null)
    } finally {
      setAvatarLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password && form.password !== form.password_confirmation) {
      toast.error('Konfirmasi kata sandi tidak cocok')
      return
    }
    setLoading(true)
    try {
      const { data } = await api.put('/profile', form)
      toast.success(data.message || 'Profil berhasil diperbarui!')
      setForm(prev => ({ ...prev, current_password: '', password: '', password_confirmation: '' }))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal memperbarui profil')
    } finally {
      setLoading(false)
    }
  }

  const avatarSrc = avatarPreview || (user?.avatar_path ? `/storage/${user.avatar_path}` : null)

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-xl">👤</div>
          <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
        </div>
        <p className="text-sm text-gray-500">Kelola informasi akun dan kata sandi Anda</p>
      </div>

      {/* Avatar Card */}
      <div className="card card-body mb-6">
        <div className="flex items-center gap-6">
          {/* Avatar display */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md">
              {avatarSrc ? (
                <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">{getInitials(user?.name)}</span>
                </div>
              )}
            </div>
            {avatarLoading && (
              <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                <Spinner size="sm" />
              </div>
            )}
          </div>

          <div>
            <h3 className="font-bold text-gray-900 text-lg">{user?.name}</h3>
            <p className="text-sm text-gray-500 mb-3">{user?.email}</p>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="btn btn-sm btn-outline"
              disabled={avatarLoading}
            >
              📷 Ganti Foto
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <p className="text-xs text-gray-400 mt-1.5">JPG, PNG, GIF, WEBP · Maks 2MB</p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="card card-body">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">Informasi Dasar</h3>
            <div className="space-y-4">
              <div className="form-group">
                <label className="form-label">Nama Lengkap</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Institusi / Afiliasi</label>
                <input
                  type="text"
                  value={form.institution}
                  onChange={e => setForm({ ...form, institution: e.target.value })}
                  className="form-input"
                  placeholder="Nama universitas atau lembaga..."
                />
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div>
            <h3 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-3 mb-1">Ubah Kata Sandi</h3>
            <p className="text-xs text-gray-400 mb-4">Kosongkan jika tidak ingin mengubah kata sandi.</p>
            <div className="space-y-4">
              <div className="form-group">
                <label className="form-label">Kata Sandi Saat Ini</label>
                <input
                  type="password"
                  value={form.current_password}
                  onChange={e => setForm({ ...form, current_password: e.target.value })}
                  className="form-input"
                  autoComplete="current-password"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Kata Sandi Baru</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="form-input"
                    minLength={8}
                    autoComplete="new-password"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Konfirmasi Kata Sandi</label>
                  <input
                    type="password"
                    value={form.password_confirmation}
                    onChange={e => setForm({ ...form, password_confirmation: e.target.value })}
                    className="form-input"
                    minLength={8}
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" disabled={loading} className="btn-primary gap-2 shadow-lg shadow-primary/20">
              {loading ? <><Spinner size="sm" /> Menyimpan...</> : '💾 Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
