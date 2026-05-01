import api from './api'

export const systemService = {
  async getSettings() {
    const { data } = await api.get('/settings')
    return data
  },

  async updateSettings(settingsData) {
    const { data } = await api.post('/settings', settingsData)
    return data
  },

  async downloadBackup() {
    const response = await api.get('/system/backup', {
      responseType: 'blob',
    })
    
    // Extract filename from header if possible, or use default
    let filename = 'backup_apms.sqlite'
    const disposition = response.headers['content-disposition']
    if (disposition && disposition.indexOf('attachment') !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
      const matches = filenameRegex.exec(disposition)
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, '')
      }
    }

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  }
}
