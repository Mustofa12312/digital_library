import { useState, useEffect } from 'react'
import { reviewService } from '../services/reviewService'
import { paperService } from '../services/paperService'
import { StatusBadge, DecisionBadge } from '../components/Badge'
import { TableSkeleton } from '../components/Loader'
import { Modal } from '../components/Modal'
import { formatDate, DECISION_LABELS } from '../utils/helpers'
import toast from 'react-hot-toast'

const DECISIONS = ['accept', 'minor_revision', 'major_revision', 'reject']

export default function ReviewQueuePage() {
  const [queue, setQueue] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewModal, setReviewModal] = useState(null)
  const [form, setForm] = useState({ comment: '', private_comment: '', decision: 'accept' })
  const [submitting, setSubmitting] = useState(false)

  const fetchQueue = () => {
    setLoading(true)
    reviewService.getMyQueue()
      .then(setQueue)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchQueue() }, [])

  const openReviewModal = (paper) => {
    setReviewModal(paper)
    setForm({ comment: '', private_comment: '', decision: 'accept' })
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!form.comment.trim()) {
      toast.error('Komentar review wajib diisi')
      return
    }
    setSubmitting(true)
    try {
      await reviewService.submit({
        paper_id: reviewModal.id,
        comment: form.comment,
        private_comment: form.private_comment,
        decision: form.decision,
      })
      toast.success('Review berhasil disubmit! 🎉')
      setReviewModal(null)
      fetchQueue()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const decisionConfig = {
    accept: { label: '✅ Diterima', class: 'border-green-300 bg-green-50 text-green-800' },
    minor_revision: { label: '✏️ Revisi Minor', class: 'border-orange-300 bg-orange-50 text-orange-800' },
    major_revision: { label: '⚠️ Revisi Mayor', class: 'border-red-300 bg-red-50 text-red-800' },
    reject: { label: '❌ Ditolak', class: 'border-gray-300 bg-gray-50 text-gray-700' },
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Antrian Review 🔍</h1>
        <p className="page-subtitle">Paper yang ditugaskan kepada Anda untuk direview</p>
      </div>

      {loading ? (
        <TableSkeleton rows={4} cols={4} />
      ) : queue.length === 0 ? (
        <div className="card card-body text-center py-16">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="font-semibold text-gray-700 mb-2">Tidak ada paper untuk direview</h3>
          <p className="text-gray-400 text-sm">Semua paper sudah direview atau belum ada penugasan baru</p>
        </div>
      ) : (
        <div className="space-y-4">
          {queue.map((paper) => (
            <div key={paper.id} className="card card-body">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl flex-shrink-0">
                  🔍
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 flex-1">{paper.title}</h3>
                    <StatusBadge status={paper.status} />
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-3 mb-3">{paper.abstract}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                    <span>👤 {paper.author?.name}</span>
                    <span>🏛️ {paper.author?.institution || '-'}</span>
                    <span>📅 {formatDate(paper.created_at)}</span>
                    {paper.keywords && <span>🏷️ {paper.keywords}</span>}
                  </div>

                  {/* Co-authors */}
                  {paper.co_authors?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {paper.co_authors.map((ca, i) => (
                        <span key={i} className="badge bg-gray-100 text-gray-600">👤 {ca.name}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  {paper.file_path && (
                    <button
                      onClick={() => paperService.download(paper.id, paper.file_name)}
                      className="btn btn-sm btn-ghost"
                    >📥 PDF</button>
                  )}
                  <button
                    onClick={() => openReviewModal(paper)}
                    className="btn btn-sm btn-primary"
                    id={`btn-review-${paper.id}`}
                  >
                    ✍️ Review
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      <Modal isOpen={!!reviewModal} onClose={() => setReviewModal(null)} title="Submit Review" size="lg">
        {reviewModal && (
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-semibold text-gray-700">{reviewModal.title}</p>
              <p className="text-xs text-gray-400 mt-1">Oleh: {reviewModal.author?.name}</p>
            </div>

            {/* Decision */}
            <div className="form-group">
              <label className="form-label">Keputusan Review *</label>
              <div className="grid grid-cols-2 gap-2">
                {DECISIONS.map(d => (
                  <label
                    key={d}
                    htmlFor={`decision-${d}`}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all
                      ${form.decision === d ? decisionConfig[d].class + ' border-opacity-100' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <input
                      id={`decision-${d}`}
                      type="radio"
                      name="decision"
                      value={d}
                      checked={form.decision === d}
                      onChange={e => setForm({ ...form, decision: e.target.value })}
                      className="hidden"
                    />
                    <span className="text-sm font-medium">{decisionConfig[d].label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="form-group">
              <label className="form-label" htmlFor="review-comment">Komentar untuk Author *</label>
              <textarea
                id="review-comment"
                value={form.comment}
                onChange={e => setForm({ ...form, comment: e.target.value })}
                className="form-textarea"
                rows={5}
                placeholder="Tulis komentar review yang akan dilihat oleh author..."
                required
              />
            </div>

            {/* Private comment */}
            <div className="form-group">
              <label className="form-label" htmlFor="review-private">Catatan Privat (hanya untuk Admin)</label>
              <textarea
                id="review-private"
                value={form.private_comment}
                onChange={e => setForm({ ...form, private_comment: e.target.value })}
                className="form-textarea"
                rows={3}
                placeholder="Catatan tambahan untuk admin (tidak terlihat oleh author)..."
              />
            </div>

            <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
              <button type="button" onClick={() => setReviewModal(null)} className="btn-ghost">Batal</button>
              <button type="submit" disabled={submitting} className="btn-primary" id="btn-submit-review">
                {submitting ? 'Menyimpan...' : '🚀 Submit Review'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}
