import { motion, useReducedMotion } from 'framer-motion'

/** Scroll-triggered fade + slide-up. Plays once and respects reduced-motion. */
export default function Reveal({ children, delay = 0, y = 28, className = '', as = 'div' }) {
  const reduce = useReducedMotion()
  const M = motion[as] || motion.div
  return (
    <M className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </M>
  )
}

export const Stagger = ({ children, className = '' }) => (
  <motion.div className={className} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}>
    {children}
  </motion.div>
)
export const StaggerItem = ({ children, className = '' }) => (
  <motion.div className={className}
    variants={{ hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}>
    {children}
  </motion.div>
)
