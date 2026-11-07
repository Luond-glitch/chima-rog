import { Link } from 'react-router-dom'
import { useSettings } from '../lib/SettingsContext'
import Icon from './Icon'
import Scene from './Scene'

export default function Footer() {
  const s = useSettings()
  const socials = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'].filter((k) => s[k])
  return (
    <footer className="relative isolate overflow-hidden bg-forest-900 text-white/80">
      <Scene variant="dusk" trees={false} className="absolute inset-x-0 bottom-0 -z-10 h-72 w-full opacity-[.12]" />
      <div className="container-x grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <img src="/chima-logo.jpeg" alt="CHIMA" className="h-14 w-14 rounded-full bg-cream object-cover" />
            <div><p className="font-display text-2xl font-extrabold text-white">CHIMA</p><p className="text-xs text-white/70">Chipukizi wa Mazingira</p></div>
          </Link>
          <p className="mt-4 text-sm leading-relaxed">{s.tagline}. Restoring ecosystems and building climate resilience with dryland communities.</p>
          <div className="mt-5 flex gap-2">
            {socials.map((k) => (
              <a key={k} href={s[k]} target="_blank" rel="noopener noreferrer" aria-label={k}
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:-translate-y-0.5 hover:bg-sun hover:text-forest-900"><Icon name={k} /></a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-display text-lg !text-white">Explore</h3>
          <ul className="space-y-2 text-sm">
            {[['/about', 'About CHIMA'], ['/programs', 'Our Programs'], ['/projects', 'Projects'], ['/impact', 'Our Impact'], ['/partners', 'Partners']].map(([to, l]) => (
              <li key={to}><Link to={to} className="transition hover:text-sun">{l}</Link></li>))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-display text-lg !text-white">Get involved</h3>
          <ul className="space-y-2 text-sm">
            {[['/get-involved', 'Volunteer'], ['/get-involved', 'Partner with us'], ['/get-involved', 'Support our work'], ['/news', 'News & Stories'], ['/media', 'Media Gallery']].map(([to, l]) => (
              <li key={l}><Link to={to} className="transition hover:text-sun">{l}</Link></li>))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-display text-lg !text-white">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3"><Icon name="map-pin" className="mt-0.5 h-4 w-4 shrink-0 text-sun" />{s.address}</li>
            <li className="flex gap-3"><Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-sun" /><a href={`tel:${s.phone.replace(/\s/g, '')}`} className="hover:text-sun">{s.phone}</a></li>
            <li className="flex gap-3"><Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0 text-sun" /><a href={`mailto:${s.email}`} className="break-all hover:text-sun">{s.email}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/60 sm:flex-row">
          <p>© {new Date().getFullYear()} CHIMA – Chipukizi wa Mazingira. All rights reserved.</p>
          <Link to="/admin" className="hover:text-sun">Admin</Link>
        </div>
      </div>
    </footer>
  )
}
