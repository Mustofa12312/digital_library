import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { paperService } from '../services/paperService'
import { Spinner, PageLoader } from '../components/Loader'
import toast from 'react-hot-toast'

export default function EditPaperPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [paper, setPaper] = useState(null)
  
  const [form, setForm] = useState({
    title: '',
    abstract: '',
    category: '',
    keywords: '',
  })
  const [file, setFile] = useState(null)
  const [wordFile, setWordFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [wordDragOver, setWordDragOver] = useState(false)

  useEffect(() => {
    paperService.get(id).then(res => {
      if (!['pending', 'revision'].includes(res.status)) {
        toast.error('Paper ini tidak dapat diedit saat ini.')
        navigate('/my-papers')
        return
      }
      setPaper(res)
      setForm({
        title: res.title,
        abstract: res.abstract,
        category: res.category || '',
        keywords: res.keywords || '',
      })
    }).catch(() => {
      toast.error('Gagal memuat paper')
      navigate('/my-papers')
    }).finally(() => setFetching(false))
  }, [id, navigate])

  const handleFileDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile?.type === 'application/pdf') {
      setFile(droppedFile)
    } else {
      toast.error('Hanya file PDF yang diizinkan')
    }
  }

  const handleWordFileDrop = (e) => {
    e.preventDefault()
    setWordDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile?.name.match(/\.(doc|docx)$/i) || droppedFile?.type.includes('word')) {
      setWordFile(droppedFile)
    } else {
      toast.error('Hanya file Word (.doc, .docx) yang diizinkan')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.abstract.trim()) {
      toast.error('Judul dan abstrak wajib diisi')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      // Laravel requires _method=PUT for multipart/form-data update, but we defined Route::post('/papers/{paper}') in api.php
      // Wait, we defined Route::post('/papers/{paper}', [PaperController::class, 'update'])!
      formData.append('title', form.title)
      formData.append('abstract', form.abstract)
      if (form.category) formData.append('category', form.category)
      formData.append('keywords', form.keywords)
      if (file) formData.append('file', file)
      if (wordFile) formData.append('word_file', wordFile)

      await paperService.update(id, formData, (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        setUploadProgress(percent)
      })
      toast.success('Paper berhasil diupdate! 🎉')
      navigate('/my-papers')
    } catch (err) {
      toast.error('Gagal update paper')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <PageLoader />

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">Edit/Revisi Paper ✏️</h1>
        <p className="page-subtitle">Perbarui informasi atau unggah naskah revisi terbaru</p>
      </div>

      {paper?.latest_review && paper.status === 'revision' && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
          <h3 className="font-semibold text-orange-800 mb-2">⚠️ Catatan Revisi dari Reviewer:</h3>
          <p className="text-orange-900 text-sm whitespace-pre-wrap">{paper.latest_review.comment}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card card-body">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-sm">1</span>
            Informasi Paper
          </h2>

          <div className="form-group">
            <label className="form-label" htmlFor="paper-title">Judul Paper *</label>
            <input
              id="paper-title"
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="form-input"
              required
              maxLength={500}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="paper-abstract">Abstrak *</label>
            <textarea
              id="paper-abstract"
              value={form.abstract}
              onChange={e => setForm({ ...form, abstract: e.target.value })}
              className="form-textarea"
              rows={6}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="paper-category">Kategori / Bidang Ilmu *</label>
            <select
              id="paper-category"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="form-input"
              required
            >
              <option value="">-- Pilih Kategori --</option>
              {['Computer Science', 'Information Systems', 'Software Engineering', 'Artificial Intelligence', 'Networking', 'Others'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="paper-keywords">Keywords</label>
            <input
              id="paper-keywords"
              type="text"
              value={form.keywords}
              onChange={e => setForm({ ...form, keywords: e.target.value })}
              className="form-input"
            />
          </div>
        </div>

        <div className="card card-body">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-sm">2</span>
            Upload Naskah Baru (Opsional)
          </h2>
          <p className="text-sm text-gray-500 mb-4">Abaikan jika Anda tidak ingin mengubah file PDF sebelumnya. Versi saat ini: v{paper?.version}</p>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer
              ${dragOver ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'}`}
          >
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl">📄</span>
                <div className="text-left">
                  <div className="font-medium text-gray-800">{file.name}</div>
                  <div className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="ml-4 text-red-400 hover:text-red-600 transition-colors"
                >✕</button>
              </div>
            ) : (
              <>
                <div className="text-4xl mb-3">📁</div>
                <p className="text-gray-600 font-medium">Drop file revisi PDF di sini atau</p>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-primary hover:underline font-semibold">pilih file</span>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf"
                    onChange={e => setFile(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </>
            )}
          </div>

          <h2 className="font-semibold text-gray-800 mb-4 mt-6 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-sm">2b</span>
            Upload Naskah Word Baru (Opsional)
          </h2>
          <p className="text-sm text-gray-500 mb-4">Abaikan jika tidak ada perubahan pada file Word.</p>

          <div
            onDragOver={(e) => { e.preventDefault(); setWordDragOver(true) }}
            onDragLeave={() => setWordDragOver(false)}
            onDrop={handleWordFileDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer
              ${wordDragOver ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'}`}
          >
            {wordFile ? (
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl">📝</span>
                <div className="text-left">
                  <div className="font-medium text-gray-800">{wordFile.name}</div>
                  <div className="text-sm text-gray-400">{(wordFile.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
                <button
                  type="button"
                  onClick={() => setWordFile(null)}
                  className="ml-4 text-red-400 hover:text-red-600 transition-colors"
                >✕</button>
              </div>
            ) : (
              <>
                <div className="text-4xl mb-3">📁</div>
                <p className="text-gray-600 font-medium">Drop file Word di sini atau</p>
                <label htmlFor="word-file-upload" className="cursor-pointer">
                  <span className="text-primary hover:underline font-semibold">pilih file</span>
                  <input
                    id="word-file-upload"
                    type="file"
                    accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={e => setWordFile(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {loading && uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
              <div className="text-xs text-center mt-1 text-gray-500">Mengunggah... {uploadProgress}%</div>
            </div>
          )}
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => navigate(-1)} className="btn-ghost">
              Batal
            </button>
            <button type="submit" disabled={loading} className="btn-primary btn-lg">
              {loading ? (
                <><Spinner size="sm" /> {uploadProgress === 100 ? 'Menyimpan...' : 'Mengunggah...'}</>
              ) : '🚀 Simpan Revisi'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
