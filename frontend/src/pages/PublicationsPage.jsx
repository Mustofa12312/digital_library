import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { paperService } from '../services/paperService'
import { systemService } from '../services/systemService'
import { formatDate } from '../utils/helpers'
import { useDebounce } from '../hooks/useDebounce'

const CATEGORIES = ['', 'Computer Science', 'Information Systems', 'Software Engineering', 'Artificial Intelligence', 'Networking', 'Others']

export default function PublicationsPage() {
  const [papers, setPapers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState(null)
  const [settings, setSettings] = useState(null)

  const debouncedSearch = useDebounce(search, 500)

  const fetchPapers = useCallback(() => {
    setLoading(true)
    paperService.publicList({ page, search: debouncedSearch, ...(category && { category }) })
      .then(res => {
        setPapers(res.data || res)
        setMeta(res)
      })
      .finally(() => setLoading(false))
  }, [page, debouncedSearch, category])

  useEffect(() => {
    fetchPapers()
    systemService.getSettings().then(setSettings).catch(() => {})
  }, [fetchPapers])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary via-secondary to-primary-800 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-10 gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <span className="text-white font-bold text-sm sm:text-base">A</span>
              </div>
              <span className="font-bold text-white/90 text-base sm:text-lg">{settings?.university_name || 'ABDImu'}</span>
            </div>
            <Link to="/login" className="btn bg-white/15 text-white border border-white/25 hover:bg-white/25 backdrop-blur-sm w-full sm:w-auto justify-center">
              Masuk ke ABDImu →
            </Link>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black mb-3 leading-tight">
            Publikasi Ilmiah 🌐
          </h1>
          <p className="text-white/70 text-base sm:text-lg mb-6 sm:mb-8 max-w-xl">
            {settings?.description || 'Kumpulan paper penelitian yang telah melalui proses peer review'}
          </p>

          {/* Search */}
          <div className="relative max-w-2xl">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-lg">🔍</span>
            <input
              type="text"
              placeholder="Cari judul, abstrak, atau keyword..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="w-full bg-white/15 backdrop-blur-sm border border-white/30 rounded-xl sm:rounded-2xl px-10 sm:px-12 py-3 sm:py-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all text-sm sm:text-base shadow-lg"
              id="publication-search"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Filters + stats bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setPage(1) }}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all border ${
                  category === cat
                    ? 'bg-primary text-white border-primary shadow-sm shadow-primary/25'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50 hover:text-primary'
                }`}
              >
                {cat || 'Semua Kategori'}
              </button>
            ))}
          </div>
          {meta && (
            <p className="text-sm text-gray-500 shrink-0">
              <span className="font-semibold text-gray-800">{meta.total}</span> publikasi
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card card-body animate-pulse">
                <div className="skeleton h-5 w-3/4 mb-3 rounded-xl" />
                <div className="skeleton h-4 w-full mb-2" />
                <div className="skeleton h-4 w-5/6" />
              </div>
            ))}
          </div>
        ) : papers.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl border-2 border-dashed border-gray-300 flex items-center justify-center text-4xl mx-auto mb-5">📭</div>
            <h3 className="font-semibold text-gray-600 text-lg">Tidak ada publikasi ditemukan</h3>
            {search && <p className="text-sm text-gray-400 mt-2">Coba kata kunci lain</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {papers.map((paper) => (
              <Link
                key={paper.id}
                to={`/publications/${paper.id}`}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Top accent */}
                <div className="h-1.5 bg-gradient-to-r from-primary to-secondary" />

                <div className="p-4 sm:p-6 flex-1 flex flex-col">
                  {/* Category + published badge */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="badge-published text-xs">✅ Dipublikasikan</span>
                    {paper.category && (
                      <span className="px-2.5 py-0.5 bg-primary/5 text-primary text-xs font-semibold rounded-full border border-primary/15">
                        {paper.category}
                      </span>
                    )}
                  </div>

                  <h2 className="font-bold text-gray-900 mb-2.5 line-clamp-2 group-hover:text-primary transition-colors leading-snug text-base">
                    {paper.title}
                  </h2>
                  <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1 leading-relaxed">
                    {paper.abstract}
                  </p>

                  {paper.keywords && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {paper.keywords.split(',').slice(0, 3).map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-full border border-amber-100">
                          {kw.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
                    <span className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-white text-[9px] font-bold">
                        {paper.author?.name?.[0] || '?'}
                      </div>
                      <span className="truncate max-w-[120px]">{paper.author?.name}</span>
                    </span>
                    <span>{formatDate(paper.updated_at)}</span>
                  </div>

                  {/* Download buttons */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={(e) => { e.preventDefault(); paperService.download(paper.id, `${paper.title}.pdf`, true) }}
                      className="flex-1 btn btn-sm btn-ghost border border-gray-200 hover:border-primary hover:text-primary justify-center"
                    >
                      📄 PDF
                    </button>
                    {paper.word_file_path && (
                      <button
                        onClick={(e) => { e.preventDefault(); paperService.downloadWord(paper.id, `${paper.title}.doc`, true) }}
                        className="flex-1 btn btn-sm btn-ghost border border-gray-200 hover:border-primary hover:text-primary justify-center"
                      >
                        📝 Word
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mt-8 sm:mt-12">
            <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="btn btn-ghost border border-gray-200 disabled:opacity-40 w-full sm:w-auto justify-center">← Sebelumnya</button>
            <span className="text-sm text-gray-500 bg-white border border-gray-200 px-4 py-2 rounded-xl">Halaman {page} dari {meta.last_page}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page === meta.last_page} className="btn btn-ghost border border-gray-200 disabled:opacity-40 w-full sm:w-auto justify-center">Berikutnya →</button>
          </div>
        )}
      </div>
    </div>
  )
}
