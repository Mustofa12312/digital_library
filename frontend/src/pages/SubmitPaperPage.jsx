import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { paperService } from '../services/paperService'
import { Spinner } from '../components/Loader'
import toast from 'react-hot-toast'

export default function SubmitPaperPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [form, setForm] = useState({
    title: '',
    abstract: '',
    category: '',
    keywords: '',
  })
  const [file, setFile] = useState(null)
  const [wordFile, setWordFile] = useState(null)
  const [coAuthors, setCoAuthors] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const [wordDragOver, setWordDragOver] = useState(false)

  const addCoAuthor = () => setCoAuthors([...coAuthors, { name: '', email: '', institution: '' }])
  const removeCoAuthor = (i) => setCoAuthors(coAuthors.filter((_, idx) => idx !== i))
  const updateCoAuthor = (i, field, value) => {
    const updated = [...coAuthors]
    updated[i][field] = value
    setCoAuthors(updated)
  }

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
      formData.append('title', form.title)
      formData.append('abstract', form.abstract)
      if (form.category) formData.append('category', form.category)
      formData.append('keywords', form.keywords)
      if (file) formData.append('file', file)
      if (wordFile) formData.append('word_file', wordFile)
      coAuthors.forEach((author, i) => {
        if (author.name) {
          formData.append(`co_authors[${i}][name]`, author.name)
          formData.append(`co_authors[${i}][email]`, author.email)
          formData.append(`co_authors[${i}][institution]`, author.institution)
        }
      })

      await paperService.create(formData, (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        setUploadProgress(percent)
      })
      toast.success('Paper berhasil disubmit! 🎉')
      navigate('/my-papers')
    } catch (err) {
      const errors = err.response?.data?.errors
      const msg = errors
        ? Object.values(errors).flat()[0]
        : err.response?.data?.message || 'Gagal submit paper'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">Submit Paper 📝</h1>
        <p className="page-subtitle">Isi informasi paper penelitian Anda</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Paper Info Card */}
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
              placeholder="Masukkan judul paper penelitian..."
              required
              maxLength={500}
            />
            <div className="text-right text-xs text-gray-400 mt-1">{form.title.length}/500</div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="paper-abstract">Abstrak *</label>
            <textarea
              id="paper-abstract"
              value={form.abstract}
              onChange={e => setForm({ ...form, abstract: e.target.value })}
              className="form-textarea"
              placeholder="Tuliskan abstrak penelitian Anda (minimal 100 karakter)..."
              rows={6}
              required
            />
            <div className="text-right text-xs text-gray-400 mt-1">{form.abstract.length} karakter</div>
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
              placeholder="keyword1, keyword2, keyword3..."
            />
            <p className="text-xs text-gray-400 mt-1">Pisahkan keyword dengan tanda koma</p>
          </div>
        </div>

        {/* Upload PDF Card */}
        <div className="card card-body">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-sm">2</span>
            Upload Naskah (PDF)
          </h2>

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
                <p className="text-gray-600 font-medium">Drop file PDF di sini atau</p>
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
                <p className="text-xs text-gray-400 mt-2">Maksimal 20MB · Hanya format PDF</p>
              </>
            )}
          </div>

          <h2 className="font-semibold text-gray-800 mb-4 mt-6 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-sm">2b</span>
            Upload Naskah (Word) - Opsional
          </h2>

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
                <p className="text-xs text-gray-400 mt-2">Maksimal 20MB · Hanya format DOC/DOCX</p>
              </>
            )}
          </div>
        </div>

        {/* Co-Authors Card */}
        <div className="card card-body">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-sm">3</span>
              Co-Author (Opsional)
            </h2>
            <button type="button" onClick={addCoAuthor} className="btn-outline btn-sm" id="btn-add-coauthor">
              + Tambah Co-Author
            </button>
          </div>

          {coAuthors.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">Belum ada co-author ditambahkan</p>
          )}

          <div className="space-y-4">
            {coAuthors.map((author, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-xl relative">
                <button
                  type="button"
                  onClick={() => removeCoAuthor(i)}
                  className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                >✕</button>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="form-group mb-0">
                    <label className="form-label">Nama *</label>
                    <input
                      type="text"
                      value={author.name}
                      onChange={e => updateCoAuthor(i, 'name', e.target.value)}
                      className="form-input"
                      placeholder="Nama lengkap"
                    />
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      value={author.email}
                      onChange={e => updateCoAuthor(i, 'email', e.target.value)}
                      className="form-input"
                      placeholder="email@domain.com"
                    />
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label">Institusi</label>
                    <input
                      type="text"
                      value={author.institution}
                      onChange={e => updateCoAuthor(i, 'institution', e.target.value)}
                      className="form-input"
                      placeholder="Nama institusi"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
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
            <button type="submit" disabled={loading} className="btn-primary btn-lg" id="btn-submit-paper">
              {loading ? (
                <><Spinner size="sm" /> {uploadProgress === 100 ? 'Menyimpan...' : 'Mengunggah...'}</>
              ) : '🚀 Submit Paper'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
