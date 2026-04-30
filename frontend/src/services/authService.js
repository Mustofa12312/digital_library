import api from './api'

export const authService = {
  async login(email, password) {
    const { data } = await api.post('/login', { email, password })
    localStorage.setItem('apms_token', data.token)
    localStorage.setItem('apms_user', JSON.stringify(data.user))
    return data
  },

  async logout() {
    await api.post('/logout')
    localStorage.removeItem('apms_token')
    localStorage.removeItem('apms_user')
  },

  async getUser() {
    const { data } = await api.get('/user')
    return data
  },

  getCurrentUser() {
    const user = localStorage.getItem('apms_user')
    return user ? JSON.parse(user) : null
  },

  isAuthenticated() {
    return !!localStorage.getItem('apms_token')
  },
}
