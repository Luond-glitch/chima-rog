import { createContext, useContext, useEffect, useState } from 'react'
import { api } from './api'

const DEFAULTS = {
  org_name: 'CHIMA – Chipukizi wa Mazingira', tagline: 'Youth-led action for resilient drylands',
  email: 'info@chima.or.ke', phone: '+254 700 000 000', address: 'Kenya', map_query: 'Kenya',
  mission: '', vision: '', history: '', approach: '', values: '', objectives: '', roles: '', membership: '', membership_note: '', eligibility: '', area: '',
}
const Ctx = createContext(DEFAULTS)
export const useSettings = () => useContext(Ctx)

/** Parses "Title|Description" lines stored in settings into [{title, text}]. */
export const parsePairs = (s = '') =>
  s.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
    const [title, ...rest] = l.split('|')
    return { title: title.trim(), text: rest.join('|').trim() }
  })
export const parseLines = (s = '') => s.split('\n').map((l) => l.trim()).filter(Boolean)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS)
  useEffect(() => {
    api.get('/api/settings').then((s) => setSettings({ ...DEFAULTS, ...s })).catch(() => {})
  }, [])
  return <Ctx.Provider value={settings}>{children}</Ctx.Provider>
}
