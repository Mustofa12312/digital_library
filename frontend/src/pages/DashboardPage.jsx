import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { userService } from '../services/userService'
import { formatDate, formatDateTime, STATUS_LABELS, STATUS_ICONS } from '../utils/helpers'
import { StatusBadge } from '../components/Badge'
import { CardSkeleton } from '../components/Loader'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

const STATUS_COLORS = {
  pending: '#f59e0b',
  under_review: '#3b82f6',
  accepted: '#10b981',
  revision: '#f97316',
  rejected: '#ef4444',
  published: '#005F02',
}

export default function DashboardPage() {
  const { user, isAdmin, isReviewer } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    userService.getDashboard()
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <div className="skeleton h-8 w-48 mb-2" />
          <div className="skeleton h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  const pieData = data?.status_counts
    ? Object.entries(data.status_counts).map(([key, value]) => ({
        name: STATUS_LABELS[key] || key,
        value,
        color: STATUS_COLORS[key] || '#888',
      }))
    : []

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard 📊</h1>
        <p className="page-subtitle">
          {isAdmin() ? 'Ringkasan sistem publikasi akademik' : `Halo, ${user?.name}! Berikut status terbaru Anda`}
        </p>
      </div>

      {/* Admin Dashboard */}
      {isAdmin() && data && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard icon="📄" label="Total Paper" value={data.total_papers} color="bg-primary/10 text-primary" />
            <StatCard icon="👥" label="Total User" value={data.total_users} color="bg-blue-100 text-blue-800" />
            <StatCard icon="🔍" label="Total Reviewer" value={data.total_reviewers} color="bg-purple-100 text-purple-800" />
            <StatCard icon="✅" label="Acceptance Rate" value={`${data.acceptance_rate}%`} color="bg-green-100 text-green-800" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Submission Trend */}
            <div className="card card-body lg:col-span-2">
              <h3 className="font-semibold text-gray-800 mb-4">📈 Tren Submisi (6 Bulan Terakhir)</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data.submission_trend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                    cursor={{ fill: '#f1f5f9' }}
                  />
                  <Bar dataKey="count" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Status breakdown */}
            <div className="card card-body">
              <h3 className="font-semibold text-gray-800 mb-4">🥧 Status Paper</h3>
              {pieData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        dataKey="value"
                        paddingAngle={5}
                        stroke="none"
                      >
                        {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1.5 mt-2">
                    {pieData.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                          <span className="text-gray-600">{item.name}</span>
                        </div>
                        <span className="font-semibold text-gray-800">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-400 text-center py-8">Belum ada data</p>
              )}
            </div>
          </div>

          {/* Recent Papers */}
          <div className="card card-body">
            <h3 className="font-semibold text-gray-800 mb-4">📋 Paper Terbaru</h3>
            <div className="space-y-3">
              {data.recent_papers?.map((paper) => (
                <div key={paper.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-lg">
                    {STATUS_ICONS[paper.status] || '📄'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate">{paper.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {paper.author?.name} · {formatDate(paper.created_at)}
                    </div>
                  </div>
                  <StatusBadge status={paper.status} />
                </div>
              ))}
            </div>
          </div>

          {/* Category Distribution */}
          {data.category_distribution?.length > 0 && (
            <div className="card card-body">
              <h3 className="font-semibold text-gray-800 mb-4">🏷️ Distribusi Kategori Paper</h3>
              <div className="space-y-3">
                {data.category_distribution.map((item, i) => {
                  const max = data.category_distribution[0]?.count || 1
                  const pct = Math.round((item.count / max) * 100)
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600 font-medium">{item.category}</span>
                        <span className="text-gray-400">{item.count} paper</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Reviewer Dashboard */}
      {isReviewer() && data && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard icon="📋" label="Total Ditugaskan" value={data.total_assigned} color="bg-blue-100 text-blue-800" />
            <StatCard icon="⏳" label="Pending Review" value={data.pending_reviews} color="bg-yellow-100 text-yellow-800" />
            <StatCard icon="✅" label="Selesai Direview" value={data.total_reviewed} color="bg-green-100 text-green-800" />
          </div>

          <div className="card card-body">
            <h3 className="font-semibold text-gray-800 mb-4">🔍 Antrian Review Terbaru</h3>
            {data.recent_assignments?.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">Tidak ada antrian review aktif.</p>
            ) : (
              <div className="space-y-3">
                {data.recent_assignments.map((paper) => (
                  <div key={paper.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-50">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 text-lg">
                      🔍
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-gray-800 truncate">{paper.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">Author: {paper.author?.name} · {formatDate(paper.created_at)}</div>
                    </div>
                    <Link to="/review-queue" className="btn btn-sm btn-ghost text-primary hidden sm:inline-flex">Review →</Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Author Dashboard */}
      {!isAdmin() && !isReviewer() && data && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {Object.entries(data.status_counts || {}).map(([status, count]) => (
              <div key={status} className="card card-body text-center">
                <div className="text-3xl mb-2">{STATUS_ICONS[status]}</div>
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-500 mt-1">{STATUS_LABELS[status]}</div>
              </div>
            ))}
          </div>
          <div className="card card-body">
            <h3 className="font-semibold text-gray-800 mb-4">📋 Paper Terbaru Saya</h3>
            {data.recent_papers?.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">Belum ada paper. Yuk submit paper pertama Anda!</p>
            )}
            <div className="space-y-3">
              {data.recent_papers?.map((paper) => (
                <div key={paper.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="text-xl">{STATUS_ICONS[paper.status]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate">{paper.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">Versi {paper.version} · {formatDate(paper.created_at)}</div>
                  </div>
                  <StatusBadge status={paper.status} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>{icon}</div>
      <div>
        <div className="text-xl sm:text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-xs sm:text-sm text-gray-500 mt-0.5">{label}</div>
      </div>
    </div>
  )
}
