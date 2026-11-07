import { CtaBand } from './Home'
import ImpactStats from '../components/ImpactStats'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import Seo from '../components/Seo'
import { Async } from '../components/States'
import { useApi } from '../hooks/useApi'

function Bars({ stats }) {
  const max = Math.max(...stats.map((s) => s.value), 1)
  return (
    <div className="space-y-5">
      {stats.map((s, i) => (
        <Reveal key={s.id} delay={i * 0.04}>
          <div className="mb-1.5 flex justify-between text-sm font-semibold text-forest-800"><span>{s.label}</span><span>{s.value.toLocaleString()}{s.suffix}</span></div>
          <div className="h-3 overflow-hidden rounded-full bg-sand">
            <div className="h-full rounded-full bg-gradient-to-r from-leaf to-sun transition-[width] duration-1000"
              style={{ width: `${Math.max((Math.log10(s.value + 1) / Math.log10(max + 1)) * 100, 6)}%` }} />
          </div>
        </Reveal>
      ))}
    </div>
  )
}

export default function Impact() {
  const q = useApi('/api/stats')
  return (
    <>
      <Seo title="Our Impact" description="Measured results of CHIMA’s environmental and community development work." />
      <PageHeader eyebrow="Our impact" title="Results we can count — and communities we can name" text="Sample figures are shown until CHIMA’s verified data is entered through the admin dashboard." variant="dusk" />
      <Async q={q}>{(stats) => (<>
        <section className="section"><div className="container-x">
          <ImpactStats stats={stats} dark={false} />
        </div></section>
        <section className="section texture bg-sand-200/60"><div className="container-x grid gap-12 lg:grid-cols-2">
          <SectionHeading eyebrow="At a glance" title="Scale of our reach" text="Bars use a logarithmic scale so large numbers (like trees) and smaller ones (like partnerships) can be compared on one chart." />
          <Bars stats={stats} />
        </div></section>
      </>)}</Async>
      <div className="pt-16"><CtaBand /></div>
    </>
  )
}
