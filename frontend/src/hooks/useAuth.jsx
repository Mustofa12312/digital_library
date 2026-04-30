import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = authService.getCurrentUser()
    if (storedUser && authService.isAuthenticated()) {
      setUser(storedUser)
      // Refresh user data from server
      authService.getUser()
        .then(freshUser => {
          setUser(freshUser)
          localStorage.setItem('apms_user', JSON.stringify(freshUser))
        })
        .catch(() => {
          localStorage.removeItem('apms_token')
          localStorage.removeItem('apms_user')
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const data = await authService.login(email, password)
    setUser(data.user)
    return data.user
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  const isAdmin = () => user && ['admin', 'super_admin'].includes(user.role)
  const isReviewer = () => user && user.role === 'reviewer'
  const isAuthor = () => user && user.role === 'author'
  const isSuperAdmin = () => user && user.role === 'super_admin'

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isReviewer, isAuthor, isSuperAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
