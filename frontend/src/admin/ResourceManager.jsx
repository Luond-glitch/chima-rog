import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import Icon from '../components/Icon'
import { Empty, ErrorBox, Loading } from '../components/States'
import { adminApi } from '../lib/api'
import { RESOURCES } from './config'
import { Field } from './fields'

const initial = (cfg) => Object.fromEntries(cfg.fields.map((f) => [f.k, f.def !== undefined ? f.def : f.t === 'checkbox' ? false : f.t === 'select' ? f.o[0] : f.t === 'icon' ? 'leaf' : ['lines', 'pairs', 'images'].includes(f.t) ? [] : f.t === 'number' ? 0 : '']))

function Editor({ cfg, item, onClose, onSaved }) {
  const [v, setV] = useState(() => (item ? { ...initial(cfg), ...item } : initial(cfg)))
  const [errors, setErrors] = useState({})
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  const save = async (e) => {
    e.preventDefault()
    const missing = Object.fromEntries(cfg.fields.filter((f) => f.req && !String(v[f.k] ?? '').trim()).map((f) => [f.k, 'This field is required.']))
    setErrors(missing)
    if (Object.keys(missing).length) { setMsg('Please fill in the required fields.'); return }
    setBusy(true); setMsg('')
    try {
      const saved = item ? await adminApi.put(`/${cfg.key}/${item.id}`, v) : await adminApi.post(`/${cfg.key}`, v)
      onSaved(saved)
    } catch (x) { setErrors(x.fields || {}); setMsg(x.message) }
    setBusy(false)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex justify-end bg-forest-900/60 backdrop-blur-sm" onClick={onClose}>
      <motion.form initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }}
        onClick={(e) => e.stopPropagation()} onSubmit={save} className="flex h-full w-full max-w-2xl flex-col bg-cream shadow-lift">
        <div className="flex items-center justify-between border-b border-sand px-6 py-4">
          <h2 className="font-display text-xl font-bold">{item ? 'Edit' : 'Add'} {cfg.single}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-2 hover:bg-sand"><Icon name="x" /></button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
          {cfg.fields.map((f) => <Field key={f.k} f={f} value={v[f.k]} error={errors[f.k]} onChange={(val) => { setV((p) => ({ ...p, [f.k]: val })); setErrors((p) => ({ ...p, [f.k]: undefined })) }} />)}
        </div>
        <div className="flex items-center gap-3 border-t border-sand bg-white px-6 py-4">
          <button className="btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
          <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
          {msg && <p className="text-sm font-medium text-terracotta" role="alert">{msg}</p>}
        </div>
      </motion.form>
    </motion.div>
  )
}

export default function ResourceManager({ resource }) {
  const cfg = { ...RESOURCES[resource], key: resource }
  const [items, setItems] = useState(null)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null) // null | 'new' | item
  const [notice, setNotice] = useState('')

  const load = useCallback(() => {
    setError('')
    adminApi.get(`/${resource}`).then(setItems).catch((e) => setError(e.message))
  }, [resource])
  useEffect(() => { setItems(null); load() }, [load])

  const remove = async (it) => {
    if (!window.confirm(`Delete “${it[cfg.columns[0][0]]}”? This cannot be undone.`)) return
    try { await adminApi.del(`/${resource}/${it.id}`); setNotice('Deleted.'); load() } catch (e) { setNotice(e.message) }
  }

  const cell = (it, k) => {
    const v = it[k]
    if (typeof v === 'boolean') return v ? <span className="rounded-full bg-leaf/15 px-2 py-0.5 text-xs font-bold text-leaf-600">Yes</span> : <span className="rounded-full bg-sand px-2 py-0.5 text-xs font-bold text-earth">Draft</span>
    return String(v ?? '')
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">{cfg.title}</h1>
          {cfg.hint && <p className="mt-1 max-w-2xl text-sm text-earth">{cfg.hint}</p>}
        </div>
        <button className="btn-primary" onClick={() => setEditing('new')}>+ Add {cfg.single}</button>
      </div>
      {notice && <p className="mb-4 rounded-xl bg-leaf/10 px-4 py-2 text-sm font-medium text-leaf-600" role="status">{notice}</p>}
      {error ? <ErrorBox message={error} onRetry={load} /> : !items ? <Loading /> : !items.length ? <Empty>Nothing here yet — add your first {cfg.single}.</Empty> : (
        <div className="overflow-x-auto rounded-2xl border border-sand bg-white shadow-soft">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-sand-200 text-xs uppercase tracking-wider text-earth-800">
              <tr>{cfg.columns.map(([, l]) => <th key={l} className="px-4 py-3 font-bold">{l}</th>)}<th className="px-4 py-3 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-t border-sand transition hover:bg-cream">
                  {cfg.columns.map(([k], i) => <td key={k} className={`px-4 py-3 ${i === 0 ? 'font-semibold text-forest-800' : 'text-earth'}`}>{cell(it, k)}</td>)}
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <button onClick={() => setEditing(it)} className="rounded-lg px-3 py-1.5 text-xs font-bold text-leaf-600 hover:bg-leaf/10">Edit</button>
                    <button onClick={() => remove(it)} className="rounded-lg px-3 py-1.5 text-xs font-bold text-terracotta hover:bg-terracotta/10">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <AnimatePresence>
        {editing && <Editor key={editing === 'new' ? 'new' : editing.id} cfg={cfg} item={editing === 'new' ? null : editing} onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); setNotice('Saved successfully.'); load() }} />}
      </AnimatePresence>
    </div>
  )
}
