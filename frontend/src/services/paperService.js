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

  async create(formData, onUploadProgress) {
    const { data } = await api.post('/papers', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    })
    return data
  },

  async update(id, formData, onUploadProgress) {
    const { data } = await api.post(`/papers/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
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

  async download(id, fileName = 'document.pdf', isPublic = false) {
    const endpoint = isPublic ? `/publications/${id}/download` : `/papers/${id}/download`;
    const response = await api.get(endpoint, {
      responseType: 'blob',
    });
    
    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  async downloadWord(id, fileName = 'document.doc', isPublic = false) {
    const endpoint = isPublic ? `/publications/${id}/download-word` : `/papers/${id}/download-word`;
    const response = await api.get(endpoint, { responseType: 'blob' });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  async exportCsv() {
    const response = await api.get('/papers/export', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Extract filename from Content-Disposition header if available
    let fileName = 'papers_export.csv';
    const disposition = response.headers['content-disposition'];
    if (disposition && disposition.indexOf('attachment') !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) { 
            fileName = matches[1].replace(/['"]/g, '');
        }
    }
    
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
}
