// Thin fetch wrapper around the Flask REST API.

/**
 * Resolve the API base URL.
 * - In dev with a Vite proxy, or when Flask serves the built SPA, BASE = '' is correct.
 * - In prod with a separate API host, set VITE_API_URL=https://api.example.com (no trailing slash).
 * - A runtime override is supported via window.__API_URL__ (useful for Docker/static hosts
 *   where you can't rebuild per environment).
 */
const RAW_BASE =
  (typeof window !== 'undefined' && window.__API_URL__) ||
  import.meta.env.VITE_API_URL ||
  ''

// Strip trailing slashes so we never produce `//api/...`.
export const BASE = RAW_BASE.replace(/\/+$/, '')

// Loud warning at startup so you notice a missing env var immediately.
if (import.meta.env.DEV && !BASE) {
  // eslint-disable-next-line no-console
  console.warn(
    '[api] VITE_API_URL is not set – requests will go to the current origin. ' +
      'If your Flask backend is on a different port/host, add VITE_API_URL to .env and restart `npm run dev`.'
  )
}

/** Files saved locally by the backend come back as /uploads/…; make them absolute. */
export const mediaUrl = (u) => {
  if (!u) return ''
  if (u.startsWith('/uploads')) return BASE + u
  return u
}

export class ApiError extends Error {
  constructor(message, status, fields) {
    super(message)
    this.name = 'ApiError'
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
  // Don't set Authorization when there's no token – some servers reject `Bearer null`.
  const token = admin ? auth.get() : null
  if (token) headers.Authorization = `Bearer ${token}`

  let payload
  if (form) {
    // Let the browser set the multipart boundary.
    payload = form
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }

  // Normalise: path should start with '/'.
  const url = BASE + (path.startsWith('/') ? path : '/' + path)

  let res
  try {
    res = await fetch(url, {
      method,
      headers,
      body: payload,
      // If you switch to cookie-based auth later, add `credentials: 'include'`.
    })
  } catch {
    throw new ApiError(
      'Cannot reach the server. Please check your connection and try again.',
      0
    )
  }

  // Try JSON, fall back to text, then null.
  let data = null
  const ct = res.headers.get('content-type') || ''
  try {
    if (ct.includes('application/json')) {
      data = await res.json()
    } else {
      const text = await res.text()
      // If the server returned HTML (e.g. SPA index.html), keep it out of `data`.
      // This is a common symptom of a wrong BASE or a missing backend route.
      data = text && /^[\s]*[{[]/.test(text) ? JSON.parse(text) : { error: text || undefined }
    }
  } catch {
    /* empty or non-JSON body */
  }

  if (!res.ok) {
    if (res.status === 401 && admin) {
      auth.clear()
      window.dispatchEvent(new Event('chima-logout'))
    }
    // Surface helpful hints for the most common failure modes.
    let msg = data?.error
    if (!msg) {
      if (res.status === 404) {
        msg =
          `Request failed (404). ` +
          `Check that VITE_API_URL points to your Flask server ` +
          `(current base: "${BASE || '(same origin)'}") and that the Flask route exists.`
      } else {
        msg = `Request failed (${res.status})`
      }
    }
    throw new ApiError(msg, res.status, data?.fields)
  }

  return data
}

export const api = {
  get: (p) => request(p),
  post: (p, body) => request(p, { method: 'POST', body }),
}

export const adminApi = {
  login: (email, password) =>
    request('/api/admin/login', { method: 'POST', body: { email, password } }),
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