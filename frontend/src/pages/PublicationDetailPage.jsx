import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { paperService } from '../services/paperService'
import { formatDate } from '../utils/helpers'

export default function PublicationDetailPage() {
  const { id } = useParams()
  const [paper, setPaper] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    paperService.getPublic(id)
      .then(setPaper)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Memuat...</p>
      </div>
    </div>
  )

  if (!paper) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">❌</div>
        <h2 className="font-semibold text-gray-700">Paper tidak ditemukan</h2>
        <Link to="/publications" className="btn-primary mt-4 inline-flex">← Kembali</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-secondary to-primary-800 text-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Link to="/publications" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            ← Kembali ke Publikasi
          </Link>
          <div className="flex items-start gap-3 mb-4">
            <span className="badge bg-white/20 text-white border border-white/30">Dipublikasikan</span>
            <span className="badge bg-white/20 text-white border border-white/30">Versi {paper.version}</span>
          </div>
          <h1 className="text-3xl font-bold leading-tight mb-4">{paper.title}</h1>
          <div className="flex flex-wrap gap-4 text-white/70 text-sm">
            <span>👤 {paper.author?.name}</span>
            <span>🏛️ {paper.author?.institution || '-'}</span>
            <span>📅 {formatDate(paper.updated_at)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card card-body">
              <h2 className="font-semibold text-gray-800 mb-3 text-lg">Abstrak</h2>
              <p className="text-gray-600 leading-relaxed text-justify">{paper.abstract}</p>
            </div>

            {paper.keywords && (
              <div className="card card-body">
                <h2 className="font-semibold text-gray-800 mb-3">Keywords</h2>
                <div className="flex flex-wrap gap-2">
                  {paper.keywords.split(',').map((kw, i) => (
                    <span key={i} className="px-3 py-1 bg-accent/20 text-amber-900 text-sm rounded-full font-medium">
                      {kw.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Co-authors */}
            {paper.co_authors?.length > 0 && (
              <div className="card card-body">
                <h2 className="font-semibold text-gray-800 mb-3">Penulis</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {paper.author?.name?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 text-sm">{paper.author?.name}</div>
                      <div className="text-xs text-gray-400">{paper.author?.institution}</div>
                      <span className="badge bg-primary/10 text-primary text-xs">Penulis Utama</span>
                    </div>
                  </div>
                  {paper.co_authors.map((ca, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold flex-shrink-0">
                        {ca.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 text-sm">{ca.name}</div>
                        <div className="text-xs text-gray-400">{ca.institution || ca.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {paper.file_path && (
              <a
                href={import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/publications/${paper.id}/download` : `/api/publications/${paper.id}/download`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full justify-center"
              >
                📥 Download PDF
              </a>
            )}

            {paper.word_file_path && (
              <a
                href={import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/publications/${paper.id}/download-word` : `/api/publications/${paper.id}/download-word`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full justify-center border-primary text-primary hover:bg-primary hover:text-white"
              >
                📝 Download Word
              </a>
            )}

            <div className="card card-body text-sm space-y-3">
              <h3 className="font-semibold text-gray-800">Informasi</h3>
              <div className="flex justify-between text-gray-500">
                <span>Status</span>
                <span className="badge-published">Dipublikasikan</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Versi</span>
                <span className="font-medium text-gray-800">{paper.version}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Diterbitkan</span>
                <span className="font-medium text-gray-800">{formatDate(paper.updated_at)}</span>
              </div>
            </div>

            <Link to="/login" className="block card card-body text-center hover:shadow-card-hover transition-all">
              <div className="text-2xl mb-2">🔐</div>
              <p className="text-sm font-medium text-gray-700">Submit penelitian Anda</p>
              <p className="text-xs text-gray-400 mt-1">Masuk sebagai author</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
