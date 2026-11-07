import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Icon from './Icon'

const LINKS = [
  { to: '/about', label: 'About' },
  { to: '/programs', label: 'Programs' },
  { to: '/projects', label: 'Projects' },
  { to: '/impact', label: 'Impact' },
  { to: '/news', label: 'News & Stories' },
  { to: '/media', label: 'Media' },
  { to: '/partners', label: 'Partners' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const solid = scrolled || open

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${solid ? 'bg-cream/95 shadow-soft backdrop-blur' : 'bg-transparent'}`}>
      <nav className="container-x flex h-[72px] items-center justify-between" aria-label="Main">
        <Link to="/" className="flex items-center gap-3" aria-label="CHIMA home">
          <img src="/chima-logo.jpeg" alt="CHIMA logo" className="h-12 w-12 rounded-full bg-cream object-cover ring-2 ring-sun/70" />
          <span className="hidden leading-tight sm:block">
            <span className={`block font-display text-xl font-extrabold ${solid ? 'text-olive' : 'text-white'}`}>CHIMA</span>
            <span className={`block text-[11px] font-medium tracking-wide ${solid ? 'text-earth' : 'text-white/80'}`}>Chipukizi wa Mazingira</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} className={({ isActive }) =>
                `group relative rounded-full px-3 py-2 text-sm font-semibold transition ${solid ? 'text-forest-800 hover:text-leaf-600' : 'text-white/90 hover:text-white'} ${isActive ? (solid ? '!text-leaf-600' : '!text-sun') : ''}`}>
                {({ isActive }) => (<>
                  {l.label}
                  <span className={`absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded bg-sun transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                </>)}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link to="/get-involved" className="btn-sun hidden !px-5 !py-2.5 sm:inline-flex">Get involved</Link>
          <Link to="/contact" className={`hidden text-sm font-semibold xl:block ${solid ? 'text-forest-800' : 'text-white'}`}>Contact</Link>
          <button onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'}
            className={`rounded-full p-2 lg:hidden ${solid ? 'text-forest-800' : 'text-white'}`}>
            <Icon name={open ? 'x' : 'menu'} className="h-6 w-6" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-sand bg-cream lg:hidden">
            <ul className="container-x space-y-1 py-4">
              {[...LINKS, { to: '/get-involved', label: 'Get Involved' }, { to: '/contact', label: 'Contact' }].map((l) => (
                <li key={l.to}>
                  <NavLink to={l.to} className={({ isActive }) => `block rounded-xl px-4 py-3 text-base font-semibold ${isActive ? 'bg-leaf/10 text-leaf-600' : 'text-forest-800 hover:bg-sand-200'}`}>{l.label}</NavLink>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
