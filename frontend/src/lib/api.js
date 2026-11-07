// Thin fetch wrapper around the Flask REST API.
const BASE = import.meta.env.VITE_API_URL || ''

/** Files saved locally by the backend come back as /uploads/…; make them absolute. */
export const mediaUrl = (u) => (!u ? '' : u.startsWith('/uploads') ? BASE + u : u)

export class ApiError extends Error {
  constructor(message, status, fields) {
    super(message)
    this.status = status
    this.fields = fields || {}
  }
}

const TOKEN_KEY = 'chima_admin_token'
export const auth = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

async function request(path, { method = 'GET', body, form, admin = false } = {}) {
  const headers = {}
  if (admin && auth.get()) headers.Authorization = `Bearer ${auth.get()}`
  let payload
  if (form) payload = form
  else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }
  let res
  try {
    res = await fetch(BASE + path, { method, headers, body: payload })
  } catch {
    throw new ApiError('Cannot reach the server. Please check your connection and try again.', 0)
  }
  let data = null
  try { data = await res.json() } catch { /* empty body */ }
  if (!res.ok) {
    if (res.status === 401 && admin) { auth.clear(); window.dispatchEvent(new Event('chima-logout')) }
    throw new ApiError(data?.error || `Request failed (${res.status})`, res.status, data?.fields)
  }
  return data
}

export const api = {
  get: (p) => request(p),
  post: (p, body) => request(p, { method: 'POST', body }),
}

export const adminApi = {
  login: (email, password) => request('/api/admin/login', { method: 'POST', body: { email, password } }),
  get: (p) => request('/api/admin' + p, { admin: true }),
  post: (p, body) => request('/api/admin' + p, { method: 'POST', body, admin: true }),
  put: (p, body) => request('/api/admin' + p, { method: 'PUT', body, admin: true }),
  patch: (p, body) => request('/api/admin' + p, { method: 'PATCH', body, admin: true }),
  del: (p) => request('/api/admin' + p, { method: 'DELETE', admin: true }),
  upload: (file, folder = 'general') => {
    const form = new FormData()
    form.append('file', file)
    form.append('folder', folder)
    return request('/api/admin/upload', { method: 'POST', form, admin: true })
  },
}
