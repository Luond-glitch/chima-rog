import { animate, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

/** Counts up from 0 when scrolled into view. */
export default function Counter({ value = 0, suffix = '', duration = 2 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    if (reduce) { setN(value); return }
    const c = animate(0, value, { duration, ease: 'easeOut', onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [inView, value, duration, reduce])
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>
}
