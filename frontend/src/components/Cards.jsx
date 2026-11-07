import { Link } from 'react-router-dom'
import ArtImage from './ArtImage'
import Icon from './Icon'

export const fmtDate = (d) => {
  if (!d) return ''
  const dt = new Date(d.length === 7 ? `${d}-01` : d)
  return isNaN(dt) ? d : dt.toLocaleDateString('en-GB', { day: d.length === 7 ? undefined : 'numeric', month: 'short', year: 'numeric' })
}

const STATUS = {
  Ongoing: 'bg-leaf/15 text-leaf-600',
  Completed: 'bg-olive/15 text-olive-700',
  Planned: 'bg-sun/25 text-earth-800',
}
export const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${STATUS[status] || STATUS.Planned}`}>
    <span className="h-1.5 w-1.5 rounded-full bg-current" />{status}
  </span>
)

export function ProjectCard({ p }) {
  return (
    <Link to={`/projects/${p.slug}`} className="group card card-hover flex h-full flex-col">
      <div className="relative">
        <ArtImage src={p.cover_url} seed={p.title} alt={p.title} className="aspect-[16/10]" />
        <div className="absolute left-4 top-4"><StatusBadge status={p.status} /></div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-terracotta"><Icon name="map-pin" className="h-3.5 w-3.5" />{p.location}</p>
        <h3 className="font-display text-xl font-bold leading-snug transition group-hover:text-leaf-600">{p.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-earth">{p.summary}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-leaf-600">View project <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" /></span>
      </div>
    </Link>
  )
}

export function PostCard({ p }) {
  return (
    <Link to={`/news/${p.slug}`} className="group card card-hover flex h-full flex-col">
      <div className="relative">
        <ArtImage src={p.cover_url} seed={p.title} alt={p.title} className="aspect-[16/10]" />
        <span className="absolute left-4 top-4 rounded-full bg-cream/95 px-3 py-1 text-xs font-bold text-forest-800">{p.category}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="mb-2 flex items-center gap-1.5 text-xs text-earth/80"><Icon name="calendar" className="h-3.5 w-3.5" />{fmtDate(p.event_date || p.created_at)}</p>
        <h3 className="font-display text-xl font-bold leading-snug transition group-hover:text-leaf-600">{p.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-earth">{p.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-leaf-600">Read more <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" /></span>
      </div>
    </Link>
  )
}
