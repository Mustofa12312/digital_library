import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { PageLoader } from './components/Loader'
import AppLayout from './layouts/AppLayout'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import PaperManagementPage from './pages/PaperManagementPage'
import UserManagementPage from './pages/UserManagementPage'
import MyPapersPage from './pages/MyPapersPage'
import SubmitPaperPage from './pages/SubmitPaperPage'
import EditPaperPage from './pages/EditPaperPage'
import SystemSettingsPage from './pages/SystemSettingsPage'
import ReviewQueuePage from './pages/ReviewQueuePage'
import PublicationsPage from './pages/PublicationsPage'
import PublicationDetailPage from './pages/PublicationDetailPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()

  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />

  return <AppLayout>{children}</AppLayout>
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Guest routes */}
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
      <Route path="/reset-password" element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />

      {/* Public routes (no auth required) */}
      <Route path="/" element={<GuestRoute><LandingPage /></GuestRoute>} />

      {/* Protected routes */}
      <Route path="/publications" element={
        <ProtectedRoute>
          <PublicationsPage />
        </ProtectedRoute>
      } />
      <Route path="/publications/:id" element={
        <ProtectedRoute>
          <PublicationDetailPage />
        </ProtectedRoute>
      } />

      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />

      {/* Admin only routes */}
      <Route path="/papers" element={
        <ProtectedRoute roles={['super_admin', 'admin']}>
          <PaperManagementPage />
        </ProtectedRoute>
      } />

      <Route path="/users" element={
        <ProtectedRoute roles={['super_admin', 'admin']}>
          <UserManagementPage />
        </ProtectedRoute>
      } />

      <Route path="/settings" element={
        <ProtectedRoute roles={['super_admin']}>
          <SystemSettingsPage />
        </ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />

      {/* Author routes */}
      <Route path="/my-papers" element={
        <ProtectedRoute roles={['author']}>
          <MyPapersPage />
        </ProtectedRoute>
      } />

      <Route path="/submit-paper" element={
        <ProtectedRoute roles={['author']}>
          <SubmitPaperPage />
        </ProtectedRoute>
      } />

      <Route path="/my-papers/:id/edit" element={
        <ProtectedRoute roles={['author']}>
          <EditPaperPage />
        </ProtectedRoute>
      } />

      {/* Reviewer routes */}
      <Route path="/review-queue" element={
        <ProtectedRoute roles={['reviewer']}>
          <ReviewQueuePage />
        </ProtectedRoute>
      } />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#1f2937',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#005F02', secondary: '#fff' },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  )
}
