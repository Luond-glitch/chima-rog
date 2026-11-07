import { Link, useParams } from 'react-router-dom'
import { CtaBand } from './Home'
import ArtImage from '../components/ArtImage'
import { StatusBadge, fmtDate } from '../components/Cards'
import Icon from '../components/Icon'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import Seo from '../components/Seo'
import { Async } from '../components/States'
import Video from '../components/Video'
import { useApi } from '../hooks/useApi'

const List = ({ items, icon = 'check' }) => (
  <ul className="space-y-2.5">
    {items.map((x) => <li key={x} className="flex items-start gap-3 text-earth"><Icon name={icon} className="mt-1 h-4 w-4 shrink-0 text-leaf" />{x}</li>)}
  </ul>
)

export default function ProjectDetail() {
  const { slug } = useParams()
  const q = useApi(`/api/projects/${slug}`)
  return (
    <Async q={q}>{(p) => (
      <>
        <Seo title={p.title} description={p.summary} />
        <PageHeader eyebrow={p.program || 'Project'} title={p.title} text={p.summary} variant="green" />
        <section className="section !pt-8">
          <div className="container-x grid gap-10 lg:grid-cols-3">
            <div className="space-y-12 lg:col-span-2">
              <Reveal><ArtImage src={p.cover_url} seed={p.title} alt={p.title} className="aspect-[16/9] rounded-[2rem] shadow-lift" /></Reveal>
              <Reveal><h2 className="font-display text-2xl font-bold">Project overview</h2><p className="mt-3 leading-relaxed text-earth">{p.overview}</p></Reveal>
              {p.objectives?.length > 0 && <Reveal><h2 className="mb-4 font-display text-2xl font-bold">Objectives</h2><List items={p.objectives} icon="target" /></Reveal>}
              {p.activities?.length > 0 && <Reveal><h2 className="mb-4 font-display text-2xl font-bold">Activities & interventions</h2><List items={p.activities} /></Reveal>}
              {p.video_url && <Reveal><h2 className="mb-4 font-display text-2xl font-bold">Video</h2><Video url={p.video_url} title={p.title} /></Reveal>}
              {p.gallery?.length > 0 && (
                <Reveal><h2 className="mb-4 font-display text-2xl font-bold">Photo gallery</h2>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{p.gallery.map((g, i) => <ArtImage key={i} src={g} seed={`${p.title}${i}`} alt={`${p.title} photo ${i + 1}`} className="group aspect-square rounded-2xl" />)}</div>
                </Reveal>
              )}
              {p.achievements?.length > 0 && (
                <Reveal><h2 className="mb-4 font-display text-2xl font-bold">Achievements & impact</h2>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {p.achievements.map((a) => (
                      <div key={a.label} className="rounded-2xl bg-forest p-6 text-center">
                        <p className="font-display text-3xl font-extrabold text-sun">{a.value}</p><p className="mt-1 text-sm text-white/80">{a.label}</p>
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}
            </div>
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="card space-y-5 p-6">
                <div><p className="mb-1 text-xs font-bold uppercase tracking-wider text-terracotta">Status</p><StatusBadge status={p.status} /></div>
                {[['Location', p.location, 'map-pin'], ['Beneficiaries', p.beneficiaries, 'users'], ['Focus area', p.program, 'leaf'],
                  ['Timeline', [fmtDate(p.start_date), p.end_date ? fmtDate(p.end_date) : 'Ongoing'].filter(Boolean).join(' – '), 'calendar']]
                  .filter(([, v]) => v).map(([l, v, i]) => (
                    <div key={l} className="flex gap-3"><Icon name={i} className="mt-0.5 h-5 w-5 shrink-0 text-leaf" />
                      <div><p className="text-xs font-bold uppercase tracking-wider text-terracotta">{l}</p><p className="text-sm text-earth-800">{v}</p></div></div>
                  ))}
                <Link to="/get-involved" className="btn-primary w-full">Support this project</Link>
                <Link to="/projects" className="btn-outline w-full">← All projects</Link>
              </div>
            </aside>
          </div>
        </section>
        <CtaBand />
      </>
    )}</Async>
  )
}
