import { useState, useEffect } from 'react'
import { systemService } from '../services/systemService'
import { Spinner, PageLoader } from '../components/Loader'
import toast from 'react-hot-toast'

export default function SystemSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [downloading, setDownloading] = useState(false)
  
  const [form, setForm] = useState({
    university_name: '',
    description: '',
    contact_email: '',
    address: '',
  })

  useEffect(() => {
    systemService.getSettings()
      .then(res => setForm({
        university_name: res.university_name || '',
        description: res.description || '',
        contact_email: res.contact_email || '',
        address: res.address || '',
      }))
      .catch(() => toast.error('Gagal memuat pengaturan sistem'))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await systemService.updateSettings(form)
      toast.success('Pengaturan sistem berhasil disimpan! ⚙️')
    } catch (err) {
      toast.error('Gagal menyimpan pengaturan')
    } finally {
      setSaving(false)
    }
  }

  const handleBackup = async () => {
    setDownloading(true)
    try {
      await systemService.downloadBackup()
      toast.success('Database berhasil di-backup! 💾')
    } catch (err) {
      toast.error('Gagal membackup database')
    } finally {
      setDownloading(false)
    }
  }

  if (loading) return <PageLoader />

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">Pengaturan Sistem ⚙️</h1>
        <p className="page-subtitle">Kelola identitas institusi dan backup database sistem</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Settings Form */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="card card-body">
            <h2 className="font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-xl">🏛️</span>
              Identitas Perguruan Tinggi
            </h2>

            <div className="form-group">
              <label className="form-label" htmlFor="univ-name">Nama Perguruan Tinggi / Kampus *</label>
              <input
                id="univ-name"
                type="text"
                value={form.university_name}
                onChange={e => setForm({ ...form, university_name: e.target.value })}
                className="form-input"
                placeholder="Misal: Universitas Teknologi Jurnal"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="univ-desc">Deskripsi Sistem</label>
              <textarea
                id="univ-desc"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="form-textarea"
                rows={3}
                placeholder="Misal: Sistem Manajemen Publikasi Akademik Resmi..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group mb-0">
                <label className="form-label" htmlFor="univ-email">Email Kontak *</label>
                <input
                  id="univ-email"
                  type="email"
                  value={form.contact_email}
                  onChange={e => setForm({ ...form, contact_email: e.target.value })}
                  className="form-input"
                  placeholder="admin@kampus.ac.id"
                  required
                />
              </div>

              <div className="form-group mb-0">
                <label className="form-label" htmlFor="univ-address">Alamat Kampus</label>
                <input
                  id="univ-address"
                  type="text"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  className="form-input"
                  placeholder="Jl. Pendidikan No. 1..."
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? <><Spinner size="sm" /> Menyimpan...</> : '💾 Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>

        {/* System Operations */}
        <div className="space-y-6">
          <div className="card card-body bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">💾</span>
              Backup Database
            </h2>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Unduh salinan penuh database SQLite saat ini (termasuk user, paper, review). Sangat disarankan untuk membackup secara rutin.
            </p>
            <button 
              type="button" 
              onClick={handleBackup} 
              disabled={downloading}
              className="w-full btn-outline border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
            >
              {downloading ? <><Spinner size="sm" color="text-blue-600" /> Mengunduh Backup...</> : '📥 Unduh Database SQLite'}
            </button>
          </div>
          
          <div className="card card-body bg-orange-50 border-orange-100">
            <h2 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              Info Sistem
            </h2>
            <ul className="text-sm text-orange-900 space-y-2">
              <li>• Mode: <strong>Production</strong></li>
              <li>• Database: <strong>SQLite 3</strong></li>
              <li>• Fitur ini eksklusif hanya untuk peran <strong>Super Admin</strong>.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
