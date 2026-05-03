import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'
import { paperService } from '../services/paperService'
import { userService } from '../services/userService'
import { StatusBadge } from '../components/Badge'
import { TableSkeleton } from '../components/Loader'
import { Modal, ConfirmModal } from '../components/Modal'
import { formatDate, STATUS_LABELS, truncate } from '../utils/helpers'
import toast from 'react-hot-toast'
import { useDebounce } from '../hooks/useDebounce'

const STATUSES = ['', 'pending', 'under_review', 'accepted', 'revision', 'rejected', 'published']

export default function PaperManagementPage() {
  const { user, isAdmin } = useAuth()
  const [papers, setPapers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState(null)
  const [selectedPaper, setSelectedPaper] = useState(null)
  const [assignModal, setAssignModal] = useState(false)
  const [reviewers, setReviewers] = useState([])
  const [selectedReviewer, setSelectedReviewer] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [detailModal, setDetailModal] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('')

  const CATEGORIES = ['', 'Computer Science', 'Information Systems', 'Software Engineering', 'Artificial Intelligence', 'Networking', 'Others']

  const debouncedSearch = useDebounce(search, 500)

  const fetchPapers = useCallback(() => {
    setLoading(true)
    const params = { page, search: debouncedSearch, ...(statusFilter && { status: statusFilter }), ...(categoryFilter && { category: categoryFilter }) }
    paperService.list(params)
      .then(res => {
        setPapers(res.data || res)
        setMeta(res) // res directly contains pagination data in Laravel
      })
      .finally(() => setLoading(false))
  }, [page, debouncedSearch, statusFilter, categoryFilter])

  useEffect(() => { fetchPapers() }, [fetchPapers])

  const handleAssignReviewer = async () => {
    if (!selectedReviewer || !selectedPaper) return
    try {
      await paperService.assignReviewer(selectedPaper.id, selectedReviewer)
      toast.success('Reviewer berhasil ditetapkan')
      setAssignModal(false)
      fetchPapers()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menetapkan reviewer')
    }
  }

  const handleStatusChange = async (paperId, newStatus) => {
    try {
      const formData = new FormData()
      formData.append('status', newStatus)
      await paperService.update(paperId, formData)
      toast.success('Status paper berhasil diubah')
      fetchPapers()
    } catch {
      toast.error('Gagal mengubah status')
    }
  }

  const handleDelete = async (paper) => {
    try {
      await paperService.delete(paper.id)
      toast.success('Paper berhasil dihapus')
      fetchPapers()
    } catch {
      toast.error('Gagal menghapus paper')
    }
  }

  const openAssignModal = async (paper) => {
    setSelectedPaper(paper)
    const list = await userService.getReviewers()
    setReviewers(list)
    setSelectedReviewer(paper.assigned_reviewer_id?.toString() || '')
    setAssignModal(true)
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">Manajemen Paper 📄</h1>
          <p className="page-subtitle">Kelola semua submission paper penelitian</p>
        </div>
        {isAdmin() && (
          <button 
            onClick={() => {
              toast.promise(paperService.exportCsv(), {
                loading: 'Mengekspor data...',
                success: 'Data berhasil diekspor!',
                error: 'Gagal mengekspor data',
              })
            }} 
            className="btn-outline shrink-0"
          >
            📥 Export CSV
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card card-body mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Cari judul, abstrak, keyword..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="form-input pl-8"
              id="paper-search"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            className="form-select w-full sm:w-48"
            id="paper-status-filter"
          >
            <option value="">Semua Status</option>
            {STATUSES.filter(Boolean).map(s => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }}
            className="form-select w-full sm:w-52"
            id="paper-category-filter"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat || 'Semua Kategori'}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton rows={6} cols={5} />
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Judul Paper</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Reviewer</th>
                  <th>Tanggal</th>
                  {isAdmin() && <th>Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {papers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-gray-400">
                      <div className="text-4xl mb-2">📭</div>
                      Belum ada paper ditemukan
                    </td>
                  </tr>
                )}
                {papers.map((paper) => (
                  <tr key={paper.id}>
                    <td>
                      <button
                        onClick={() => setDetailModal(paper)}
                        className="text-left hover:text-primary transition-colors"
                      >
                        <div className="font-medium text-gray-800 line-clamp-2 max-w-xs">{paper.title}</div>
                        <div className="text-xs text-gray-400 mt-0.5">v{paper.version} · {paper.keywords}</div>
                      </button>
                    </td>
                    <td>
                      <div className="text-sm font-medium">{paper.author?.name}</div>
                      <div className="text-xs text-gray-400">{paper.author?.institution}</div>
                    </td>
                    <td>
                      {isAdmin() ? (
                        <select
                          value={paper.status}
                          onChange={(e) => handleStatusChange(paper.id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                          id={`status-select-${paper.id}`}
                        >
                          {STATUSES.filter(Boolean).map(s => (
                            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                          ))}
                        </select>
                      ) : (
                        <StatusBadge status={paper.status} />
                      )}
                    </td>
                    <td>
                      <div className="text-sm text-gray-600">
                        {paper.assigned_reviewer?.name || <span className="text-gray-300">-</span>}
                      </div>
                    </td>
                    <td className="text-xs text-gray-400">{formatDate(paper.created_at)}</td>
                    {isAdmin() && (
                      <td>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openAssignModal(paper)}
                            className="btn btn-sm btn-outline"
                            title="Tetapkan reviewer"
                          >
                            👤
                          </button>
                          {paper.file_path && (
                            <button
                              onClick={() => paperService.download(paper.id, paper.file_name)}
                              className="btn btn-sm btn-ghost"
                              title="Download PDF"
                            >
                              📥
                            </button>
                          )}
                          {paper.word_file_path && (
                            <button
                              onClick={() => paperService.downloadWord(paper.id, paper.word_file_name)}
                              className="btn btn-sm btn-ghost text-primary"
                              title="Download Word"
                            >
                              📝
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteConfirm(paper)}
                            className="btn btn-sm btn-danger"
                            title="Hapus"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <span className="text-sm text-gray-500">
                Menampilkan {meta.from}–{meta.to} dari {meta.total} paper
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => p - 1)}
                  disabled={page === 1}
                  className="btn btn-sm btn-ghost disabled:opacity-40"
                >← Prev</button>
                <span className="btn btn-sm bg-primary/10 text-primary cursor-default">{page}/{meta.last_page}</span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page === meta.last_page}
                  className="btn btn-sm btn-ghost disabled:opacity-40"
                >Next →</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Assign Reviewer Modal */}
      <Modal isOpen={assignModal} onClose={() => setAssignModal(false)} title="Tetapkan Reviewer">
        <div className="form-group">
          <label className="form-label">Paper</label>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedPaper?.title}</p>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="reviewer-select">Pilih Reviewer</label>
          <select
            id="reviewer-select"
            value={selectedReviewer}
            onChange={(e) => setSelectedReviewer(e.target.value)}
            className="form-select"
          >
            <option value="">-- Pilih Reviewer --</option>
            {reviewers.map(r => (
              <option key={r.id} value={r.id}>{r.name} ({r.institution || 'No institution'})</option>
            ))}
          </select>
        </div>
        <div className="flex gap-3 justify-end mt-4">
          <button onClick={() => setAssignModal(false)} className="btn-ghost">Batal</button>
          <button onClick={handleAssignReviewer} className="btn-primary" disabled={!selectedReviewer}>
            Tetapkan Reviewer
          </button>
        </div>
      </Modal>

      {/* Paper Detail Modal */}
      <Modal isOpen={!!detailModal} onClose={() => setDetailModal(null)} title="Detail Paper" size="lg">
        {detailModal && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{detailModal.title}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <StatusBadge status={detailModal.status} />
                <span className="badge bg-gray-100 text-gray-600">v{detailModal.version}</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Abstrak</p>
              <p className="text-sm text-gray-600 leading-relaxed">{detailModal.abstract}</p>
            </div>
            {detailModal.keywords && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Keywords</p>
                <div className="flex flex-wrap gap-1">
                  {detailModal.keywords.split(',').map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 bg-accent/20 text-amber-900 text-xs rounded-full">{kw.trim()}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Author Utama</p>
                <p className="text-gray-700">{detailModal.author?.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Reviewer</p>
                <p className="text-gray-700">{detailModal.assigned_reviewer?.name || '-'}</p>
              </div>
            </div>
            <div className="flex gap-3">
              {detailModal.file_path && (
                <button
                  onClick={() => paperService.download(detailModal.id, detailModal.file_name)}
                  className="btn-primary inline-flex"
                >
                  📥 Download PDF
                </button>
              )}
              {detailModal.word_file_path && (
                <button
                  onClick={() => paperService.downloadWord(detailModal.id, detailModal.word_file_name)}
                  className="btn-outline border-primary text-primary hover:bg-primary hover:text-white inline-flex"
                >
                  📝 Download Word
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm)}
        title="Hapus Paper"
        message={`Apakah Anda yakin ingin menghapus paper "${deleteConfirm?.title}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Paper"
        danger
      />
    </div>
  )
}
