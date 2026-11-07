import { motion } from 'framer-motion'
import Scene from './Scene'

export default function PageHeader({ eyebrow, title, text, variant = 'green' }) {
  return (
    <header className="relative isolate overflow-hidden bg-forest-900 pt-32 pb-16 sm:pt-40 sm:pb-24">
      <Scene variant={variant} className="absolute inset-0 -z-10 h-full w-full opacity-60" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-900 via-forest-900/70 to-forest-900/40" />
      <div className="container-x">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          {eyebrow && <span className="eyebrow !text-sun">{eyebrow}</span>}
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold !text-white sm:text-5xl lg:text-6xl">{title}</h1>
          {text && <p className="mt-5 max-w-2xl text-base text-white/80 sm:text-lg">{text}</p>}
        </motion.div>
      </div>
      <svg className="absolute bottom-0 left-0 w-full text-cream" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
        <path fill="currentColor" d="M0 40 C240 5 480 60 720 35 C960 10 1200 55 1440 25 L1440 60 L0 60Z" />
      </svg>
    </header>
  )
}
