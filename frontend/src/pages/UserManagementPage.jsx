import { useState, useEffect, useCallback } from 'react'
import { userService } from '../services/userService'
import { RoleBadge } from '../components/Badge'
import { TableSkeleton } from '../components/Loader'
import { Modal, ConfirmModal } from '../components/Modal'
import { formatDate, ROLE_LABELS, getInitials } from '../utils/helpers'
import { useDebounce } from '../hooks/useDebounce'
import toast from 'react-hot-toast'

const ROLES = ['super_admin', 'admin', 'reviewer', 'author']

const defaultForm = { name: '', email: '', password: '', role: 'author', institution: '', phone: '', bio: '', is_active: true }

export default function UserManagementPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState(null)
  const [formModal, setFormModal] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [form, setForm] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [importModal, setImportModal] = useState(false)
  const [importFile, setImportFile] = useState(null)
  const [importing, setImporting] = useState(false)

  const debouncedSearch = useDebounce(search, 500)

  const fetchUsers = useCallback(() => {
    setLoading(true)
    userService.list({ page, search: debouncedSearch, ...(roleFilter && { role: roleFilter }) })
      .then(res => {
        setUsers(res.data || res)
        setMeta(res)
      })
      .finally(() => setLoading(false))
  }, [page, debouncedSearch, roleFilter])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const openCreate = () => {
    setEditUser(null)
    setForm(defaultForm)
    setFormModal(true)
  }

  const openEdit = (user) => {
    setEditUser(user)
    setForm({ ...user, password: '' })
    setFormModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editUser) {
        await userService.update(editUser.id, form)
        toast.success('User berhasil diperbarui')
      } else {
        await userService.create(form)
        toast.success('User berhasil dibuat')
      }
      setFormModal(false)
      fetchUsers()
    } catch (err) {
      const msg = err.response?.data?.message || Object.values(err.response?.data?.errors || {}).flat()[0] || 'Gagal menyimpan user'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleActive = async (user) => {
    try {
      const updated = await userService.toggleActive(user.id)
      toast.success(`User ${updated.is_active ? 'diaktifkan' : 'dinonaktifkan'}`)
      fetchUsers()
    } catch {
      toast.error('Gagal mengubah status user')
    }
  }

  const handleDelete = async (user) => {
    try {
      await userService.delete(user.id)
      toast.success('User berhasil dihapus')
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus user')
    }
  }

  const handleExportCsv = async () => {
    try {
      await userService.exportCsv()
      toast.success('CSV berhasil diunduh')
    } catch {
      toast.error('Gagal mengunduh CSV')
    }
  }

  const handleDownloadTemplate = async () => {
    try {
      await userService.downloadTemplate()
      toast.success('Template CSV berhasil diunduh')
    } catch {
      toast.error('Gagal mengunduh template')
    }
  }

  const handleImportSubmit = async (e) => {
    e.preventDefault()
    if (!importFile) {
      toast.error('Silakan pilih file CSV terlebih dahulu')
      return
    }
    setImporting(true)
    try {
      const res = await userService.importCsv(importFile)
      toast.success(res.message || 'Import berhasil')
      setImportModal(false)
      setImportFile(null)
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengimpor data')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">Manajemen User 👥</h1>
          <p className="page-subtitle">Kelola akun, import dosen, dan hak akses pengguna</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setImportModal(true)} className="btn-outline btn-sm flex-1 sm:flex-none justify-center">
            📤 Import CSV
          </button>
          <button onClick={handleExportCsv} className="btn-outline btn-sm flex-1 sm:flex-none justify-center">
            📥 Export CSV
          </button>
          <button onClick={openCreate} className="btn-primary w-full sm:w-auto justify-center" id="btn-create-user">
            <span>➕</span> Tambah User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card card-body mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="form-input pl-8"
              id="user-search"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }}
            className="form-select w-full sm:w-48"
            id="user-role-filter"
          >
            <option value="">Semua Role</option>
            {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
          </select>
        </div>
      </div>

      {/* Table - Desktop */}
      {loading ? (
        <TableSkeleton rows={6} cols={5} />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="card hidden md:block">
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Institusi</th>
                    <th>Status</th>
                    <th>Bergabung</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-gray-400">
                        <div className="text-4xl mb-2">👤</div>
                        Tidak ada user ditemukan
                      </td>
                    </tr>
                  )}
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">{getInitials(user.name)}</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-800">{user.name}</div>
                            <div className="text-xs text-gray-400">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><RoleBadge role={user.role} /></td>
                      <td className="text-sm text-gray-600">{user.institution || '-'}</td>
                      <td>
                        <span className={`badge ${user.is_active ? 'badge-accepted' : 'badge-rejected'}`}>
                          {user.is_active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="text-xs text-gray-400">{formatDate(user.created_at)}</td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEdit(user)}
                            className="btn btn-sm btn-outline"
                            title="Edit"
                            id={`btn-edit-user-${user.id}`}
                          >✏️</button>
                          <button
                            onClick={() => handleToggleActive(user)}
                            className={`btn btn-sm ${user.is_active ? 'btn-ghost' : 'btn-accent'}`}
                            title={user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                            id={`btn-toggle-user-${user.id}`}
                          >
                            {user.is_active ? '🔒' : '🔓'}
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(user)}
                            className="btn btn-sm btn-danger"
                            title="Hapus"
                            id={`btn-delete-user-${user.id}`}
                          >🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {meta && meta.last_page > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <span className="text-sm text-gray-500">{meta.from}–{meta.to} dari {meta.total} user</span>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="btn btn-sm btn-ghost disabled:opacity-40">← Prev</button>
                  <span className="btn btn-sm bg-primary/10 text-primary cursor-default">{page}/{meta.last_page}</span>
                  <button onClick={() => setPage(p => p + 1)} disabled={page === meta.last_page} className="btn btn-sm btn-ghost disabled:opacity-40">Next →</button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {users.length === 0 && (
              <div className="card card-body text-center py-12 text-gray-400">
                <div className="text-4xl mb-2">👤</div>
                Tidak ada user ditemukan
              </div>
            )}
            {users.map((user) => (
              <div key={user.id} className="card card-body">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">{getInitials(user.name)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-gray-800 truncate">{user.name}</h3>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <span className={`badge flex-shrink-0 ${user.is_active ? 'badge-accepted' : 'badge-rejected'}`}>
                        {user.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <RoleBadge role={user.role} />
                      {user.institution && (
                        <span className="text-xs text-gray-500">🏛️ {user.institution}</span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-2">📅 Bergabung {formatDate(user.created_at)}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => openEdit(user)}
                    className="btn btn-sm btn-outline flex-1 justify-center"
                    id={`btn-edit-user-m-${user.id}`}
                  >✏️ Edit</button>
                  <button
                    onClick={() => handleToggleActive(user)}
                    className={`btn btn-sm flex-1 justify-center ${user.is_active ? 'btn-ghost' : 'btn-accent'}`}
                    id={`btn-toggle-user-m-${user.id}`}
                  >
                    {user.is_active ? '🔒 Nonaktifkan' : '🔓 Aktifkan'}
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(user)}
                    className="btn btn-sm btn-danger justify-center"
                    id={`btn-delete-user-m-${user.id}`}
                  >🗑️</button>
                </div>
              </div>
            ))}

            {/* Mobile Pagination */}
            {meta && meta.last_page > 1 && (
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-500">{meta.from}–{meta.to} dari {meta.total}</span>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="btn btn-sm btn-ghost disabled:opacity-40">←</button>
                  <span className="btn btn-sm bg-primary/10 text-primary cursor-default text-xs">{page}/{meta.last_page}</span>
                  <button onClick={() => setPage(p => p + 1)} disabled={page === meta.last_page} className="btn btn-sm btn-ghost disabled:opacity-40">→</button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Form Modal */}
      <Modal isOpen={formModal} onClose={() => setFormModal(false)} title={editUser ? 'Edit User' : 'Tambah User'} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Nama Lengkap *</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="form-input" required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Password {editUser ? '(kosongkan jika tidak diubah)' : '*'}</label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="form-input" required={!editUser} minLength={8} />
            </div>
            <div className="form-group">
              <label className="form-label">Role *</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="form-select" required>
                {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Institusi</label>
            <input type="text" value={form.institution || ''} onChange={e => setForm({ ...form, institution: e.target.value })} className="form-input" />
          </div>

          {editUser && (
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                checked={form.is_active}
                onChange={e => setForm({ ...form, is_active: e.target.checked })}
                className="w-4 h-4 accent-primary"
              />
              <label htmlFor="is_active" className="text-sm text-gray-700">Akun aktif</label>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end pt-2 border-t border-gray-100">
            <button type="button" onClick={() => setFormModal(false)} className="btn-ghost w-full sm:w-auto justify-center">Batal</button>
            <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto justify-center" id="btn-submit-user">
              {submitting ? 'Menyimpan...' : editUser ? 'Perbarui' : 'Tambah User'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm)}
        title="Hapus User"
        message={`Apakah Anda yakin ingin menghapus user "${deleteConfirm?.name}"?`}
        confirmText="Hapus"
        danger
      />

      {/* Import CSV Modal */}
      <Modal isOpen={importModal} onClose={() => setImportModal(false)} title="Import User / Dosen via CSV" size="md">
        <form onSubmit={handleImportSubmit} className="space-y-4">
          <div className="bg-blue-50 border border-blue-100 p-3 sm:p-4 rounded-xl text-sm text-blue-800">
            <p className="font-semibold mb-1">Panduan Import:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Gunakan format CSV dengan pemisah koma (,).</li>
              <li>Kolom wajib: <code className="bg-white px-1 rounded text-[10px] sm:text-xs">name,email,role,institution,password</code></li>
              <li>Role yang diizinkan: <strong>author, reviewer, admin, super_admin</strong></li>
              <li>Jika email sudah ada, data user akan diperbarui (update).</li>
            </ul>
            <button 
              type="button" 
              onClick={handleDownloadTemplate} 
              className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
            >
              📄 Download Template CSV
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">Pilih File CSV *</label>
            <input 
              type="file" 
              accept=".csv,.txt"
              onChange={e => setImportFile(e.target.files[0])}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-primary/10 file:text-primary
                hover:file:bg-primary/20"
              required
            />
            {importFile && (
              <p className="text-xs text-green-600 mt-2">File terpilih: {importFile.name} ({(importFile.size / 1024).toFixed(1)} KB)</p>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end pt-4 border-t border-gray-100">
            <button type="button" onClick={() => setImportModal(false)} className="btn-ghost w-full sm:w-auto justify-center">Batal</button>
            <button type="submit" disabled={importing || !importFile} className="btn-primary w-full sm:w-auto justify-center">
              {importing ? 'Mengimpor...' : '🚀 Import Data'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
