import api from './api'

export const userService = {
  async list(params = {}) {
    const { data } = await api.get('/users', { params })
    return data
  },

  async get(id) {
    const { data } = await api.get(`/users/${id}`)
    return data
  },

  async create(userData) {
    const { data } = await api.post('/users', userData)
    return data
  },

  async update(id, userData) {
    const { data } = await api.put(`/users/${id}`, userData)
    return data
  },

  async delete(id) {
    const { data } = await api.delete(`/users/${id}`)
    return data
  },

  async toggleActive(id) {
    const { data } = await api.patch(`/users/${id}/toggle-active`)
    return data
  },

  async getReviewers() {
    const { data } = await api.get('/reviewers')
    return data
  },

  async getDashboard() {
    const { data } = await api.get('/dashboard')
    return data
  },
}
