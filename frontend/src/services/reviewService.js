import api from './api'

export const reviewService = {
  async getForPaper(paperId) {
    const { data } = await api.get(`/papers/${paperId}/reviews`)
    return data
  },

  async submit(reviewData) {
    const { data } = await api.post('/reviews', reviewData)
    return data
  },

  async update(id, reviewData) {
    const { data } = await api.put(`/reviews/${id}`, reviewData)
    return data
  },

  async getMyQueue() {
    const { data } = await api.get('/my-review-queue')
    return data
  },
}
