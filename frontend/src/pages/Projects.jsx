import { useState } from 'react'
import { CtaBand } from './Home'
import { ProjectCard } from '../components/Cards'
import PageHeader from '../components/PageHeader'
import { Stagger, StaggerItem } from '../components/Reveal'
import Seo from '../components/Seo'
import { Async, Empty } from '../components/States'
import { useApi } from '../hooks/useApi'

const FILTERS = ['All', 'Ongoing', 'Completed', 'Planned']

export default function Projects() {
  const [f, setF] = useState('All')
  const q = useApi('/api/projects')
  return (
    <>
      <Seo title="Projects" description="Ongoing and completed CHIMA projects restoring ecosystems and building resilience across the drylands." />
      <PageHeader eyebrow="Projects & initiatives" title="Where our work takes root" text="Explore ongoing, completed and upcoming projects — with objectives, activities and results." variant="water" />
      <section className="section">
        <div className="container-x">
          <div className="mb-10 flex flex-wrap gap-2" role="tablist" aria-label="Filter projects">
            {FILTERS.map((x) => (
              <button key={x} role="tab" aria-selected={f === x} onClick={() => setF(x)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${f === x ? 'bg-forest text-white shadow-soft' : 'bg-white text-forest-800 ring-1 ring-sand-400 hover:bg-sand-200'}`}>{x}</button>
            ))}
          </div>
          <Async q={q}>{(list) => {
            const shown = list.filter((p) => f === 'All' || p.status === f)
            return shown.length ? (
              <Stagger key={f} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {shown.map((p) => <StaggerItem key={p.id}><ProjectCard p={p} /></StaggerItem>)}
              </Stagger>
            ) : <Empty>No {f.toLowerCase()} projects yet.</Empty>
          }}</Async>
        </div>
      </section>
      <CtaBand />
    </>
  )
}
