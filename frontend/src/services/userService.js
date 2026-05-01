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

  async exportCsv() {
    const response = await api.get('/users/export', { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'users_export.csv')
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },

  async downloadTemplate() {
    const response = await api.get('/users/template', { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'template_import_user.csv')
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },

  async importCsv(file) {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post('/users/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data
  },
}
