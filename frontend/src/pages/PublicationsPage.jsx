import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { paperService } from '../services/paperService'
import { formatDate, truncate } from '../utils/helpers'

export default function PublicationsPage() {
  const [papers, setPapers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState(null)

  const fetchPapers = useCallback(() => {
    setLoading(true)
    paperService.publicList({ page, search })
      .then(res => {
        setPapers(res.data || res)
        setMeta(res.meta || null)
      })
      .finally(() => setLoading(false))
  }, [page, search])

  useEffect(() => { fetchPapers() }, [fetchPapers])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary via-secondary to-primary-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/login" className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
              <span className="text-white font-bold text-sm">A</span>
            </Link>
            <span className="font-bold text-white/80">APMS</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">Publikasi Ilmiah</h1>
          <p className="text-white/70 text-lg mb-8">Kumpulan paper penelitian yang telah melalui proses peer review</p>

          {/* Search */}
          <div className="relative max-w-xl">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60">🔍</span>
            <input
              type="text"
              placeholder="Cari judul, abstrak, atau keyword..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="w-full bg-white/15 backdrop-blur-sm border border-white/30 rounded-xl px-12 py-3.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
              id="publication-search"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Stats bar */}
        {meta && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-500 text-sm">
              {search ? `Hasil pencarian "${search}": ` : ''}<span className="font-semibold text-gray-800">{meta.total}</span> publikasi
            </p>
            <Link to="/login" className="btn-primary btn-sm">Masuk ke APMS →</Link>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card card-body animate-pulse">
                <div className="skeleton h-5 w-3/4 mb-3" />
                <div className="skeleton h-4 w-full mb-2" />
                <div className="skeleton h-4 w-5/6" />
              </div>
            ))}
          </div>
        ) : papers.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="font-semibold text-gray-600">Tidak ada publikasi ditemukan</h3>
            {search && <p className="text-sm text-gray-400 mt-2">Coba kata kunci lain</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {papers.map((paper) => (
              <Link key={paper.id} to={`/publications/${paper.id}`} className="card card-hover group">
                <div className="card-body">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      🌐
                    </div>
                    <div>
                      <span className="badge-published text-xs">Dipublikasikan</span>
                    </div>
                  </div>
                  <h2 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {paper.title}
                  </h2>
                  <p className="text-sm text-gray-500 line-clamp-3 mb-4">{paper.abstract}</p>

                  {paper.keywords && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {paper.keywords.split(',').slice(0, 3).map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 bg-accent/20 text-amber-900 text-xs rounded-full">
                          {kw.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
                    <span>👤 {paper.author?.name}</span>
                    <span>{formatDate(paper.updated_at)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="btn btn-ghost border border-gray-200 disabled:opacity-40">← Sebelumnya</button>
            <span className="text-sm text-gray-500">Halaman {page} dari {meta.last_page}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page === meta.last_page} className="btn btn-ghost border border-gray-200 disabled:opacity-40">Berikutnya →</button>
          </div>
        )}
      </div>
    </div>
  )
}
