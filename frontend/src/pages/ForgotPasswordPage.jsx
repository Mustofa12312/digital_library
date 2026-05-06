import { Link } from 'react-router-dom'

export default function ForgotPasswordPage() {
  const contacts = [
    {
      name: 'Mustofa (Lead Developer)',
      role: 'Sistem & Database',
      phone: '+62 813-5908-8246',
      wa: '6281359088246',
      icon: '👨‍💻'
    },
    {
      name: 'Pak Ziyadan (Tim Support)',
      role: 'UI/UX & Troubleshooting',
      phone: '+62 878-5024-5888',
      wa: '6287850245888',
      icon: '🛡️'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 selection:bg-primary/20 overflow-hidden relative">
      {/* Background Decorative Circles */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-emerald-400/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

      <div className="w-full max-w-lg animate-fade-in relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-xl group-hover:scale-105 transition-all duration-300">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="font-bold text-2xl tracking-tight text-gray-900">ABDImu</span>
          </Link>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Lupa Kata Sandi? 🔑</h1>
          <p className="text-gray-500 mt-3 text-lg">Jangan panik! Hubungi tim pengembang kami untuk mendapatkan akses kembali ke akun Anda.</p>
        </div>

        <div className="grid gap-4">
          {contacts.map((contact, i) => (
            <div
              key={i}
              className="group bg-white rounded-[2rem] p-6 shadow-xl shadow-gray-200/50 border border-white hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl shadow-inner group-hover:bg-primary/5 transition-colors">
                  {contact.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">{contact.name}</h3>
                  <p className="text-sm text-primary font-semibold uppercase tracking-wider">{contact.role}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/${contact.wa}?text=Halo%20${contact.name},%20saya%20lupa%20kata%20sandi%20sistem%20ABDImu.%20Mohon%20bantuannya.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 px-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-200"
                >
                  <span>💬</span> WhatsApp
                </a>
                <a
                  href={`tel:${contact.phone}`}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-gray-200"
                >
                  <span>📞</span> Hubungi
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors font-medium px-6 py-2 rounded-full border border-gray-100 bg-white shadow-sm"
          >
            ← Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  )
}
