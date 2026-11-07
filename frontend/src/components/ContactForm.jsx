import { useState } from 'react'
import { api } from '../lib/api'
import Icon from './Icon'

const empty = { name: '', email: '', phone: '', subject: '', message: '', website: '' }

/** Validated form → POST /api/contact. `kind` tags the submission (contact / volunteer / partner / support). */
export default function ContactForm({ kind = 'contact', subject = '', cta = 'Send message', placeholder = 'How can we help?' }) {
  const [v, setV] = useState({ ...empty, subject })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ state: 'idle', message: '' })

  const set = (k) => (e) => { setV({ ...v, [k]: e.target.value }); if (errors[k]) setErrors({ ...errors, [k]: undefined }) }

  const validate = () => {
    const e = {}
    if (v.name.trim().length < 2) e.name = 'Please enter your name.'
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email)) e.email = 'Please enter a valid email address.'
    if (v.message.trim().length < 10) e.message = 'Please write at least 10 characters.'
    return e
  }

  const submit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return
    setStatus({ state: 'sending', message: '' })
    try {
      const res = await api.post('/api/contact', { ...v, kind })
      setStatus({ state: 'done', message: res?.message || 'Thank you! We will be in touch soon.' })
      setV({ ...empty, subject })
    } catch (err) {
      setErrors(err.fields || {})
      setStatus({ state: 'error', message: err.message })
    }
  }

  if (status.state === 'done')
    return (
      <div className="rounded-3xl border border-leaf/30 bg-leaf/10 p-8 text-center" role="status">
        <Icon name="check" className="mx-auto h-10 w-10 text-leaf" />
        <p className="mt-3 font-display text-xl font-bold">Asante sana!</p>
        <p className="mt-1 text-sm text-earth">{status.message}</p>
        <button className="btn-outline mt-5" onClick={() => setStatus({ state: 'idle', message: '' })}>Send another</button>
      </div>
    )

  const Field = ({ id, label, type = 'text', req, area }) => (
    <div className={area ? 'sm:col-span-2' : ''}>
      <label htmlFor={`${kind}-${id}`} className="label">{label}{req && <span className="text-terracotta"> *</span>}</label>
      {area ? (
        <textarea id={`${kind}-${id}`} rows={5} value={v[id]} onChange={set(id)} placeholder={placeholder} className="input resize-y" aria-invalid={!!errors[id]} />
      ) : (
        <input id={`${kind}-${id}`} type={type} value={v[id]} onChange={set(id)} className="input" aria-invalid={!!errors[id]} autoComplete={id} />
      )}
      {errors[id] && <p className="mt-1 text-xs font-medium text-terracotta">{errors[id]}</p>}
    </div>
  )

  return (
    <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
      <Field id="name" label="Full name" req />
      <Field id="email" label="Email" type="email" req />
      <Field id="phone" label="Phone (optional)" type="tel" />
      <Field id="subject" label="Subject" />
      <Field id="message" label="Message" req area />
      {/* honeypot – hidden from people, bots fill it */}
      <input tabIndex={-1} autoComplete="off" value={v.website} onChange={set('website')} className="hidden" aria-hidden="true" name="website" />
      {status.state === 'error' && <p className="text-sm font-medium text-terracotta sm:col-span-2" role="alert">{status.message}</p>}
      <div className="sm:col-span-2">
        <button className="btn-primary" disabled={status.state === 'sending'}>
          {status.state === 'sending' ? 'Sending…' : cta}<Icon name="arrow" className="h-4 w-4" />
        </button>
      </div>
    </form>
  )
}
