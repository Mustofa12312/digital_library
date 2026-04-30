import api from './api'

export const paperService = {
  async list(params = {}) {
    const { data } = await api.get('/papers', { params })
    return data
  },

  async publicList(params = {}) {
    const { data } = await api.get('/publications', { params })
    return data
  },

  async get(id) {
    const { data } = await api.get(`/papers/${id}`)
    return data
  },

  async getPublic(id) {
    const { data } = await api.get(`/publications/${id}`)
    return data
  },

  async create(formData) {
    const { data } = await api.post('/papers', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async update(id, formData) {
    const { data } = await api.post(`/papers/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async delete(id) {
    const { data } = await api.delete(`/papers/${id}`)
    return data
  },

  async assignReviewer(paperId, reviewerId) {
    const { data } = await api.post(`/papers/${paperId}/assign-reviewer`, { reviewer_id: reviewerId })
    return data
  },
}
