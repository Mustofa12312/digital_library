import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-6">
      <div className="text-center max-w-md animate-fade-in">
        {/* Big 404 */}
        <div className="relative mb-8 select-none">
          <div className="text-[10rem] font-black text-gray-100 leading-none tracking-tighter">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl animate-bounce">🔍</div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">Halaman Tidak Ditemukan</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Halaman yang Anda cari tidak ada atau telah dipindahkan. 
          Mungkin ada kesalahan pada URL yang Anda masukkan.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/dashboard"
            className="btn-primary shadow-lg shadow-primary/20"
          >
            🏠 Ke Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-ghost border border-gray-200"
          >
            ← Kembali
          </button>
        </div>
      </div>
    </div>
  )
}
