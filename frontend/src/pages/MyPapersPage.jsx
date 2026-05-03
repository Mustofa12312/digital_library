import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { paperService } from '../services/paperService'
import { StatusBadge } from '../components/Badge'
import { formatDate, STATUS_LABELS, STATUS_ICONS } from '../utils/helpers'

const STATUS_COLORS = {
  pending:      { bg: 'bg-amber-50', border: 'border-amber-200', accent: 'bg-amber-400', icon: 'bg-amber-100 text-amber-600' },
  under_review: { bg: 'bg-blue-50',  border: 'border-blue-200',  accent: 'bg-blue-500',  icon: 'bg-blue-100 text-blue-600'  },
  accepted:     { bg: 'bg-emerald-50', border: 'border-emerald-200', accent: 'bg-emerald-500', icon: 'bg-emerald-100 text-emerald-600' },
  revision:     { bg: 'bg-orange-50', border: 'border-orange-200', accent: 'bg-orange-400', icon: 'bg-orange-100 text-orange-600' },
  rejected:     { bg: 'bg-red-50',  border: 'border-red-200',  accent: 'bg-red-400',  icon: 'bg-red-100 text-red-600'  },
  published:    { bg: 'bg-primary/5', border: 'border-primary/20', accent: 'bg-primary', icon: 'bg-primary/10 text-primary' },
}

const STATUSES = ['', 'pending', 'under_review', 'accepted', 'revision', 'rejected', 'published']

const STATUS_COUNTS_LABELS = {
  '': 'Semua',
  pending: 'Menunggu',
  under_review: 'Direview',
  accepted: 'Diterima',
  revision: 'Revisi',
  rejected: 'Ditolak',
  published: 'Terbit',
}

export default function MyPapersPage() {
  const [papers, setPapers] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  const fetchPapers = useCallback(() => {
    setLoading(true)
    paperService.list({ page, ...(statusFilter && { status: statusFilter }) })
      .then(res => {
        setPapers(res.data || res)
        setMeta(res)
      })
      .finally(() => setLoading(false))
  }, [page, statusFilter])

  useEffect(() => { fetchPapers() }, [fetchPapers])

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-xl">📚</div>
            <h1 className="text-2xl font-bold text-gray-900">Paper Saya</h1>
          </div>
          <p className="text-sm text-gray-500 ml-13 pl-0.5">Daftar semua paper penelitian yang telah Anda submit</p>
        </div>
        <Link
          to="/submit-paper"
          id="btn-new-paper"
          className="btn-primary gap-2 shrink-0 shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-transform"
        >
          ✍️ Submit Paper Baru
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 mb-6 flex flex-wrap gap-1">
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1) }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex-shrink-0
              ${statusFilter === s
                ? 'bg-primary text-white shadow-sm shadow-primary/30'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
          >
            {s ? (
              <>
                <span className="text-base leading-none">{STATUS_ICONS[s]}</span>
                {STATUS_COUNTS_LABELS[s]}
              </>
            ) : 'Semua'}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="card card-body animate-pulse">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gray-200 flex-shrink-0" />
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
                  <div className="h-3 bg-gray-100 rounded-lg w-1/2" />
                  <div className="h-3 bg-gray-100 rounded-lg w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : papers.length === 0 ? (
        <div className="card card-body text-center py-20">
          <div className="w-20 h-20 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-4xl mx-auto mb-5">
            📭
          </div>
          <h3 className="font-semibold text-gray-700 mb-2 text-lg">Belum ada paper ditemukan</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
            {statusFilter
              ? `Tidak ada paper dengan status "${STATUS_COUNTS_LABELS[statusFilter]}"`
              : 'Mulai submit paper penelitian pertama Anda sekarang'}
          </p>
          <Link to="/submit-paper" className="btn-primary mx-auto shadow-lg shadow-primary/20">
            ✍️ Submit Sekarang
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {papers.map((paper) => {
            const colors = STATUS_COLORS[paper.status] || STATUS_COLORS.pending
            const isExpanded = expandedId === paper.id

            return (
              <div
                key={paper.id}
                className={`group relative bg-white rounded-2xl border transition-all duration-300 hover:shadow-lg overflow-hidden
                  ${colors.border}`}
              >
                {/* Left accent bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${colors.accent}`} />

                <div className="pl-5 pr-6 py-5">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${colors.icon}`}>
                      {STATUS_ICONS[paper.status]}
                    </div>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      {/* Title row */}
                      <div className="flex flex-wrap items-start gap-2 mb-1.5">
                        <h3 className="font-bold text-gray-900 text-base leading-snug flex-1 min-w-0 group-hover:text-primary transition-colors">
                          {paper.title}
                        </h3>
                        <StatusBadge status={paper.status} />
                      </div>

                      {/* Category & keywords chips */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {paper.category && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-primary/5 text-primary text-xs font-semibold rounded-full border border-primary/15">
                            🏷️ {paper.category}
                          </span>
                        )}
                        {paper.keywords && paper.keywords.split(',').slice(0, 3).map((kw, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                            {kw.trim()}
                          </span>
                        ))}
                      </div>

                      {/* Abstract */}
                      <p className={`text-sm text-gray-500 leading-relaxed mb-3 ${isExpanded ? '' : 'line-clamp-2'}`}>
                        {paper.abstract}
                      </p>

                      {/* Review comment */}
                      {paper.latest_review && (
                        <div className={`mb-3 p-3.5 rounded-xl border text-sm ${colors.bg} ${colors.border}`}>
                          <p className="font-semibold text-gray-700 mb-1 text-xs uppercase tracking-wide">💬 Komentar Reviewer</p>
                          <p className="text-gray-600 leading-relaxed">{paper.latest_review.comment}</p>
                        </div>
                      )}

                      {/* Meta info */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <span>📅</span> {formatDate(paper.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>🔢</span> Versi {paper.version}
                        </span>
                        {paper.assigned_reviewer && (
                          <span className="flex items-center gap-1">
                            <span>👤</span> Reviewer: {paper.assigned_reviewer.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons column */}
                    <div className="flex sm:flex-col gap-2 flex-shrink-0 sm:min-w-[110px]">
                      {['pending', 'revision'].includes(paper.status) && (
                        <Link
                          to={`/my-papers/${paper.id}/edit`}
                          className="btn btn-sm btn-outline w-full justify-center"
                        >
                          ✏️ Edit
                        </Link>
                      )}
                      {paper.file_path && (
                        <button
                          onClick={() => paperService.download(paper.id, paper.file_name)}
                          className="btn btn-sm btn-ghost w-full justify-center"
                          title="Download PDF"
                        >
                          📄 PDF
                        </button>
                      )}
                      {paper.word_file_path && (
                        <button
                          onClick={() => paperService.downloadWord(paper.id, paper.word_file_name)}
                          className="btn btn-sm btn-ghost text-primary w-full justify-center"
                          title="Download Word"
                        >
                          📝 Word
                        </button>
                      )}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : paper.id)}
                        className="btn btn-sm btn-ghost w-full justify-center text-gray-400"
                      >
                        {isExpanded ? '▲ Tutup' : '▼ Detail'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-gray-500">
                {meta.from}–{meta.to} dari {meta.total} paper
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => p - 1)}
                  disabled={page === 1}
                  className="btn btn-sm btn-ghost disabled:opacity-40"
                >
                  ← Prev
                </button>
                <span className="btn btn-sm bg-primary/10 text-primary cursor-default font-semibold">
                  {page} / {meta.last_page}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page === meta.last_page}
                  className="btn btn-sm btn-ghost disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
