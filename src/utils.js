export const joinUrl = (base, path) => {
  if (!path) return base
  if (path.startsWith('http')) return path
  if (!base) return path
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const PHOTO_LIST_PATH = import.meta.env.VITE_PHOTO_LIST_PATH || '/photos'
const PHOTO_UPLOAD_PATH = import.meta.env.VITE_PHOTO_UPLOAD_PATH || '/photos'
export const LIST_ENDPOINT = joinUrl(API_BASE_URL, PHOTO_LIST_PATH)
export const UPLOAD_ENDPOINT = joinUrl(API_BASE_URL, PHOTO_UPLOAD_PATH)

export const formatBytes = (bytes) => {
  if (!Number.isFinite(bytes)) return ''
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB']
  let value = bytes / 1024
  let unitIndex = 0
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }
  return `${value.toFixed(value < 10 ? 1 : 0)} ${units[unitIndex]}`
}

export const formatTimestamp = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export const normalizePhotoList = (payload, baseUrl) => {
  if (!payload) return []
  const items = Array.isArray(payload)
    ? payload
    : payload.photos || payload.data || []
  return items
    .map((item, index) => {
      if (!item) return null
      if (typeof item === 'string') {
        const url = item.startsWith('http') ? item : joinUrl(baseUrl, item)
        return { id: `${index}-${item}`, url, title: `Photo ${index + 1}` }
      }
      const rawUrl = item.url || item.src || item.path || item.location
      if (!rawUrl) return null
      const url = rawUrl.startsWith('http') ? rawUrl : joinUrl(baseUrl, rawUrl)
      return {
        id: item.id || item._id || `${index}-${rawUrl}`,
        url,
        title: item.title || item.name || item.filename || `Photo ${index + 1}`,
        uploadedAt: item.uploadedAt || item.createdAt || item.timestamp,
      }
    })
    .filter(Boolean)
}
