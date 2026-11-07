import { useCallback, useEffect, useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { ErrorBox, Loading } from '../components/States'
import { adminApi, auth } from '../lib/api'
import { RESOURCES, SETTINGS_FIELDS } from './config'
import ResourceManager from './ResourceManager'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr('')
    try { const r = await adminApi.login(email, password); auth.set(r.token); onLogin() } catch (x) { setErr(x.message) }
    setBusy(false)
  }
  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-forest-900 to-forest px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-cream p-8 shadow-lift">
        <img src="/chima-logo.jpeg" alt="CHIMA" className="mx-auto h-20 w-20 rounded-full object-cover ring-4 ring-sun/60" />
        <h1 className="mt-4 text-center font-display text-2xl font-bold">Admin sign in</h1>
        <p className="mb-6 text-center text-sm text-earth">CHIMA content dashboard</p>
        <label className="label" htmlFor="em">Email</label>
        <input id="em" type="email" required autoComplete="username" className="input mb-4" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="label" htmlFor="pw">Password</label>
        <input id="pw" type="password" required autoComplete="current-password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
        {err && <p className="mt-3 text-sm font-medium text-terracotta" role="alert">{err}</p>}
        <button className="btn-primary mt-6 w-full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <Link to="/" className="mt-4 block text-center text-sm text-earth hover:text-leaf-600">← Back to website</Link>
      </form>
    </div>
  )
}

function Dashboard() {
  const [d, setD] = useState(null)
  const [err, setErr] = useState('')
  useEffect(() => { adminApi.get('/summary').then(setD).catch((e) => setErr(e.message)) }, [])
  if (err) return <ErrorBox message={err} />
  if (!d) return <Loading />
  const tiles = [...Object.entries(RESOURCES).map(([k, c]) => [k, c.title, d[k], c.icon, `/admin/${k}`]), ['messages', 'Messages', d.messages, 'mail', '/admin/messages']]
  return (
    <div>
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Dashboard</h1>
      <p className="mt-1 text-earth">Manage everything that appears on the CHIMA website.</p>
      <div className={`mt-5 rounded-2xl border p-4 text-sm ${d.storage === 'supabase' ? 'border-leaf/30 bg-leaf/10' : 'border-sun/50 bg-sun/15'}`}>
        <b>File storage:</b> {d.storage === 'supabase' ? 'Connected to Supabase ✔' : 'Using local dev storage — add your real Supabase URL and service key in backend/.env to store files in Supabase.'}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map(([k, l, n, i, to]) => (
          <Link key={k} to={to} className="card card-hover flex items-center gap-4 p-5">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-forest text-sun"><Icon name={i} className="h-6 w-6" /></span>
            <span><span className="block font-display text-2xl font-bold">{n}</span><span className="text-sm text-earth">{l}{k === 'messages' && d.unread ? ` · ${d.unread} new` : ''}{k === 'posts' && d.drafts ? ` · ${d.drafts} drafts` : ''}</span></span>
          </Link>
        ))}
      </div>
    </div>
  )
}

function Messages() {
  const [items, setItems] = useState(null)
  const [err, setErr] = useState('')
  const [open, setOpen] = useState(null)
  const load = useCallback(() => adminApi.get('/messages').then(setItems).catch((e) => setErr(e.message)), [])
  useEffect(() => { load() }, [load])
  const toggle = async (m) => { await adminApi.patch(`/messages/${m.id}`, { is_read: !m.is_read }); load() }
  const del = async (m) => { if (window.confirm('Delete this message?')) { await adminApi.del(`/messages/${m.id}`); load() } }
  if (err) return <ErrorBox message={err} />
  if (!items) return <Loading />
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold sm:text-3xl">Messages & submissions</h1>
      {!items.length && <p className="rounded-2xl border border-dashed border-sand-400 p-10 text-center text-sm text-earth">No messages yet.</p>}
      <div className="space-y-3">
        {items.map((m) => (
          <div key={m.id} className={`rounded-2xl border bg-white p-5 shadow-soft ${m.is_read ? 'border-sand' : 'border-leaf/50'}`}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <button className="text-left" onClick={() => { setOpen(open === m.id ? null : m.id); if (!m.is_read) toggle(m) }}>
                <p className="font-semibold text-forest-800">{!m.is_read && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-leaf" />}{m.name} <span className="font-normal text-earth">· {m.email}</span></p>
                <p className="text-xs text-earth"><span className="mr-2 rounded-full bg-sun/25 px-2 py-0.5 font-bold uppercase">{m.kind}</span>{m.subject || '(no subject)'} · {new Date(m.created_at).toLocaleString()}</p>
              </button>
              <div className="flex gap-1">
                <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || 'Your message to CHIMA')}`} className="rounded-lg px-3 py-1.5 text-xs font-bold text-leaf-600 hover:bg-leaf/10">Reply</a>
                <button onClick={() => toggle(m)} className="rounded-lg px-3 py-1.5 text-xs font-bold text-earth hover:bg-sand">{m.is_read ? 'Mark unread' : 'Mark read'}</button>
                <button onClick={() => del(m)} className="rounded-lg px-3 py-1.5 text-xs font-bold text-terracotta hover:bg-terracotta/10">Delete</button>
              </div>
            </div>
            {open === m.id && <p className="mt-3 whitespace-pre-wrap border-t border-sand pt-3 text-sm text-earth-800">{m.message}{m.phone && `\n\nPhone: ${m.phone}`}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

function Settings() {
  const [v, setV] = useState(null)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  useEffect(() => { adminApi.get('/settings').then(setV).catch((e) => setErr(e.message)) }, [])
  if (err) return <ErrorBox message={err} />
  if (!v) return <Loading />
  const save = async (e) => {
    e.preventDefault(); setMsg('')
    try { await adminApi.put('/settings', v); setMsg('Saved. Changes are live on the website.') } catch (x) { setMsg(x.message) }
  }
  return (
    <form onSubmit={save} className="max-w-3xl space-y-8">
      <div><h1 className="font-display text-2xl font-bold sm:text-3xl">Organisation info</h1><p className="mt-1 text-earth">Contact details, social links and the About page text.</p></div>
      {SETTINGS_FIELDS.map(([group, fields]) => (
        <fieldset key={group} className="card space-y-4 p-6"><legend className="px-2 font-display text-lg font-bold">{group}</legend>
          {fields.map(([k, l, t]) => (
            <div key={k}><label className="label" htmlFor={k}>{l}</label>
              {t === 'text' ? <input id={k} className="input" value={v[k] || ''} onChange={(e) => setV({ ...v, [k]: e.target.value })} />
                : <textarea id={k} rows={t === 'area6' ? 6 : 3} className="input" value={v[k] || ''} onChange={(e) => setV({ ...v, [k]: e.target.value })} />}
            </div>
          ))}
        </fieldset>
      ))}
      <div className="flex items-center gap-4"><button className="btn-primary">Save changes</button>{msg && <p className="text-sm font-medium text-leaf-600" role="status">{msg}</p>}</div>
    </form>
  )
}

function Account() {
  const [f, setF] = useState({ current: '', new: '' })
  const [msg, setMsg] = useState({ ok: true, t: '' })
  const submit = async (e) => {
    e.preventDefault()
    try { await adminApi.post('/password', f); setMsg({ ok: true, t: 'Password updated.' }); setF({ current: '', new: '' }) } catch (x) { setMsg({ ok: false, t: x.message }) }
  }
  return (
    <form onSubmit={submit} className="card max-w-md space-y-4 p-6">
      <h1 className="font-display text-2xl font-bold">Change password</h1>
      <div><label className="label" htmlFor="cur">Current password</label><input id="cur" type="password" className="input" value={f.current} onChange={(e) => setF({ ...f, current: e.target.value })} required /></div>
      <div><label className="label" htmlFor="new">New password (10+ characters)</label><input id="new" type="password" minLength={10} className="input" value={f.new} onChange={(e) => setF({ ...f, new: e.target.value })} required /></div>
      <button className="btn-primary">Update password</button>
      {msg.t && <p className={`text-sm font-medium ${msg.ok ? 'text-leaf-600' : 'text-terracotta'}`} role="status">{msg.t}</p>}
    </form>
  )
}

const NAV = [
  ['/admin', 'Dashboard', 'sun', true],
  ...Object.entries(RESOURCES).map(([k, c]) => [`/admin/${k}`, c.title, c.icon]),
  ['/admin/messages', 'Messages', 'mail'],
  ['/admin/settings', 'Organisation info', 'globe'],
  ['/admin/account', 'Password', 'shield'],
]

export default function AdminApp() {
  const [authed, setAuthed] = useState(!!auth.get())
  const [menu, setMenu] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    const out = () => setAuthed(false)
    window.addEventListener('chima-logout', out)
    return () => window.removeEventListener('chima-logout', out)
  }, [])
  useEffect(() => { document.title = 'Admin | CHIMA' }, [])

  if (!authed) return <Login onLogin={() => setAuthed(true)} />
  const logout = () => { auth.clear(); setAuthed(false); navigate('/admin') }

  return (
    <div className="min-h-screen bg-sand-200/50 lg:flex">
      <aside className={`${menu ? 'block' : 'hidden'} bg-forest-900 text-white lg:sticky lg:top-0 lg:block lg:h-screen lg:w-64 lg:shrink-0 lg:overflow-y-auto`}>
        <div className="flex items-center gap-3 px-5 py-5"><img src="/chima-logo.jpeg" alt="" className="h-10 w-10 rounded-full object-cover" /><div><p className="font-display text-lg font-bold leading-none text-white">CHIMA</p><p className="text-xs text-white/60">Admin</p></div></div>
        <nav className="space-y-1 px-3 pb-6" aria-label="Admin">
          {NAV.map(([to, l, i, end]) => (
            <NavLink key={to} to={to} end={end} onClick={() => setMenu(false)}
              className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive ? 'bg-sun text-forest-900' : 'text-white/80 hover:bg-white/10'}`}>
              <Icon name={i} className="h-4 w-4" />{l}
            </NavLink>
          ))}
          <a href="/" target="_blank" rel="noreferrer" className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/70 hover:bg-white/10"><Icon name="globe" className="h-4 w-4" />View website</a>
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/70 hover:bg-white/10"><Icon name="x" className="h-4 w-4" />Sign out</button>
        </nav>
      </aside>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between bg-forest-900 px-4 py-3 text-white lg:hidden">
          <span className="font-display font-bold">CHIMA Admin</span>
          <button onClick={() => setMenu(!menu)} aria-label="Toggle menu"><Icon name={menu ? 'x' : 'menu'} /></button>
        </div>
        <main className="mx-auto max-w-6xl p-4 sm:p-8">
          <Routes>
            <Route index element={<Dashboard />} />
            {Object.keys(RESOURCES).map((k) => <Route key={k} path={k} element={<ResourceManager key={k} resource={k} />} />)}
            <Route path="messages" element={<Messages />} />
            <Route path="settings" element={<Settings />} />
            <Route path="account" element={<Account />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
