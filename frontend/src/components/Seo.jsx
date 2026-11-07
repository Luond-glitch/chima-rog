import { useEffect } from 'react'

/** Sets document title + meta description per page (no extra dependency needed). */
export default function Seo({ title, description }) {
  useEffect(() => {
    document.title = title ? `${title} | CHIMA – Chipukizi wa Mazingira` : 'CHIMA – Chipukizi wa Mazingira | Youth-led action for resilient drylands'
    if (description) {
      let m = document.querySelector('meta[name="description"]')
      if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m) }
      m.content = description
    }
  }, [title, description])
  return null
}
