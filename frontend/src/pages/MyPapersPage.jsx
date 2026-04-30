import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { paperService } from '../services/paperService'
import { StatusBadge } from '../components/Badge'
import { TableSkeleton } from '../components/Loader'
import { formatDate, STATUS_LABELS, STATUS_ICONS } from '../utils/helpers'

export default function MyPapersPage() {
  const [papers, setPapers] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState(null)

  const fetchPapers = useCallback(() => {
    setLoading(true)
    paperService.list({ page, ...(statusFilter && { status: statusFilter }) })
      .then(res => {
        setPapers(res.data || res)
        setMeta(res.meta || null)
      })
      .finally(() => setLoading(false))
  }, [page, statusFilter])

  useEffect(() => { fetchPapers() }, [fetchPapers])

  const STATUSES = ['', 'pending', 'under_review', 'accepted', 'revision', 'rejected', 'published']

  return (
    <div className="animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">Paper Saya 📚</h1>
          <p className="page-subtitle">Daftar semua paper yang telah Anda submit</p>
        </div>
        <Link to="/submit-paper" className="btn-primary" id="btn-new-paper">
          <span>✍️</span> Submit Paper Baru
        </Link>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1) }}
            className={`btn btn-sm flex-shrink-0 ${statusFilter === s ? 'btn-primary' : 'btn-ghost border border-gray-200'}`}
          >
            {s ? `${STATUS_ICONS[s]} ${STATUS_LABELS[s]}` : 'Semua'}
          </button>
        ))}
      </div>

      {loading ? (
        <TableSkeleton rows={5} cols={4} />
      ) : papers.length === 0 ? (
        <div className="card card-body text-center py-16">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="font-semibold text-gray-700 mb-2">Belum ada paper</h3>
          <p className="text-gray-400 text-sm mb-6">Mulai submit paper penelitian pertama Anda</p>
          <Link to="/submit-paper" className="btn-primary mx-auto">✍️ Submit Sekarang</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {papers.map((paper) => (
            <div key={paper.id} className="card card-body hover:shadow-card-hover transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">
                  {STATUS_ICONS[paper.status]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 flex-1 min-w-0">{paper.title}</h3>
                    <StatusBadge status={paper.status} />
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{paper.abstract}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                    <span>📅 {formatDate(paper.created_at)}</span>
                    <span>🔢 Versi {paper.version}</span>
                    {paper.keywords && <span>🏷️ {paper.keywords}</span>}
                    {paper.assigned_reviewer && <span>👤 Reviewer: {paper.assigned_reviewer.name}</span>}
                  </div>

                  {/* Review result */}
                  {paper.latest_review && (
                    <div className="mt-3 p-3 bg-background rounded-lg border border-accent/30">
                      <p className="text-xs font-semibold text-gray-600 mb-1">💬 Komentar Reviewer:</p>
                      <p className="text-xs text-gray-600 line-clamp-2">{paper.latest_review.comment}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  {paper.file_path && (
                    <a
                      href={`/storage/${paper.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-ghost"
                      title="Download PDF"
                    >📥 PDF</a>
                  )}
                  {['pending', 'revision'].includes(paper.status) && (
                    <Link to={`/my-papers/${paper.id}/edit`} className="btn btn-sm btn-outline">
                      ✏️ Edit
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}

          {meta && meta.last_page > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="btn btn-sm btn-ghost disabled:opacity-40">← Prev</button>
              <span className="text-sm text-gray-600">{page} / {meta.last_page}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={page === meta.last_page} className="btn btn-sm btn-ghost disabled:opacity-40">Next →</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
