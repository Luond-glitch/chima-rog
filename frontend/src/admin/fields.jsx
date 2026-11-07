import { useRef, useState } from 'react'
import ArtImage from '../components/ArtImage'
import Icon, { ICON_NAMES } from '../components/Icon'
import { adminApi, mediaUrl } from '../lib/api'

/** Upload button + preview + manual URL fallback. Files go to Supabase (or local dev storage). */
export function ImageField({ value, onChange, folder, any }) {
  const ref = useRef()
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const pick = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setBusy(true); setErr('')
    try { const r = await adminApi.upload(f, folder); onChange(r.url) } catch (x) { setErr(x.message) }
    setBusy(false); e.target.value = ''
  }
  const isImg = !value || /\.(jpe?g|png|webp|gif|svg)(\?|$)/i.test(value)
  return (
    <div className="flex flex-wrap items-start gap-4">
      {isImg ? <ArtImage src={value} seed={folder} className="h-24 w-32 shrink-0 rounded-xl" />
        : <div className="grid h-24 w-32 shrink-0 place-items-center rounded-xl bg-sand-200 text-xs font-semibold text-earth"><Icon name="file" className="mb-1 h-6 w-6" /></div>}
      <div className="min-w-0 flex-1 space-y-2">
        <input ref={ref} type="file" hidden accept={any ? 'image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx' : 'image/*'} onChange={pick} />
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => ref.current.click()} disabled={busy} className="btn-outline !px-4 !py-2">{busy ? 'Uploading…' : value ? 'Replace file' : 'Upload file'}</button>
          {value && <button type="button" onClick={() => onChange('')} className="btn !px-4 !py-2 text-terracotta hover:bg-terracotta/10">Remove</button>}
        </div>
        <input className="input !py-2 text-xs" placeholder="…or paste a file URL" value={value || ''} onChange={(e) => onChange(e.target.value)} />
        {err && <p className="text-xs font-medium text-terracotta">{err}</p>}
      </div>
    </div>
  )
}

export function ImagesField({ value = [], onChange, folder }) {
  const ref = useRef()
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const add = async (e) => {
    const files = [...(e.target.files || [])]
    if (!files.length) return
    setBusy(true); setErr('')
    const urls = []
    for (const f of files) {
      try { urls.push((await adminApi.upload(f, folder)).url) } catch (x) { setErr(x.message) }
    }
    onChange([...value, ...urls]); setBusy(false); e.target.value = ''
  }
  return (
    <div>
      <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
        {value.map((u, i) => (
          <div key={u + i} className="group relative">
            <img src={mediaUrl(u)} alt="" className="aspect-square w-full rounded-xl object-cover" />
            <button type="button" aria-label="Remove photo" onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-forest-900/80 text-white opacity-0 transition group-hover:opacity-100 focus:opacity-100"><Icon name="x" className="h-3.5 w-3.5" /></button>
          </div>
        ))}
      </div>
      <input ref={ref} type="file" multiple hidden accept="image/*" onChange={add} />
      <button type="button" onClick={() => ref.current.click()} disabled={busy} className="btn-outline !px-4 !py-2">{busy ? 'Uploading…' : '+ Add photos'}</button>
      {err && <p className="mt-2 text-xs font-medium text-terracotta">{err}</p>}
    </div>
  )
}

const toLines = (v) => (Array.isArray(v) ? v.join('\n') : '')
const fromLines = (s) => s.split('\n').map((x) => x.trim()).filter(Boolean)
const toPairs = (v) => (Array.isArray(v) ? v.map((a) => `${a.label} | ${a.value}`).join('\n') : '')
const fromPairs = (s) => fromLines(s).map((l) => { const [label, ...r] = l.split('|'); return { label: label.trim(), value: r.join('|').trim() } })

/** Textarea that keeps its own raw text (so Enter / trailing spaces work) and reports the parsed list. */
function ListField({ id, value, format, parse, onChange, placeholder }) {
  const [text, setText] = useState(() => format(value))
  return <textarea id={id} rows={4} className="input" placeholder={placeholder} value={text}
    onChange={(e) => { setText(e.target.value); onChange(parse(e.target.value)) }} />
}

export function Field({ f, value, onChange, error }) {
  const id = `f-${f.k}`
  let input
  switch (f.t) {
    case 'textarea': input = <textarea id={id} rows={f.rows || 4} className="input resize-y" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />; break
    case 'number': input = <input id={id} type="number" min="0" className="input" value={value ?? 0} onChange={(e) => onChange(e.target.value)} />; break
    case 'date': input = <input id={id} type="date" className="input" value={value || ''} onChange={(e) => onChange(e.target.value)} />; break
    case 'month': input = <input id={id} type="month" className="input" value={value || ''} onChange={(e) => onChange(e.target.value)} />; break
    case 'select': input = <select id={id} className="input" value={value || f.o[0]} onChange={(e) => onChange(e.target.value)}>{f.o.map((o) => <option key={o}>{o}</option>)}</select>; break
    case 'icon': input = <select id={id} className="input" value={value || 'leaf'} onChange={(e) => onChange(e.target.value)}>{ICON_NAMES.map((o) => <option key={o}>{o}</option>)}</select>; break
    case 'checkbox': return (
      <label className="flex items-center gap-3 text-sm font-semibold text-forest-800"><input type="checkbox" className="h-5 w-5 rounded accent-leaf" checked={!!value} onChange={(e) => onChange(e.target.checked)} />{f.l}</label>)
    case 'image': input = <ImageField value={value} onChange={onChange} folder={f.folder} any={f.any} />; break
    case 'images': input = <ImagesField value={value || []} onChange={onChange} folder={f.folder} />; break
    case 'lines': input = <ListField id={id} value={value} format={toLines} parse={fromLines} onChange={onChange} />; break
    case 'pairs': input = <ListField id={id} value={value} format={toPairs} parse={fromPairs} onChange={onChange} placeholder="Trees planted | 42,000" />; break
    default: input = <input id={id} className="input" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
  }
  return (
    <div>
      <label htmlFor={id} className="label">{f.l}{f.req && <span className="text-terracotta"> *</span>}</label>
      {input}
      {error && <p className="mt-1 text-xs font-medium text-terracotta">{error}</p>}
    </div>
  )
}
