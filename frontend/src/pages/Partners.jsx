import { CtaBand } from './Home'
import PageHeader from '../components/PageHeader'
import { Stagger, StaggerItem } from '../components/Reveal'
import Seo from '../components/Seo'
import { Async } from '../components/States'
import Icon from '../components/Icon'
import { useApi } from '../hooks/useApi'
import { mediaUrl } from '../lib/api'
import { Link } from 'react-router-dom'

export default function Partners() {
  const q = useApi('/api/partners')
  return (
    <>
      <Seo title="Partners" description="CHIMA works with government, development partners, research institutions and community networks." />
      <PageHeader eyebrow="Partnerships & collaboration" title="Stronger together" text="Government, funders, researchers and community networks walk this journey with us." variant="noon" />
      <section className="section"><div className="container-x">
        <Async q={q}>{(list) => (
          <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <StaggerItem key={p.id}><div className="card card-hover flex h-full flex-col p-7">
                <div className="mb-5 grid h-20 place-items-center rounded-2xl bg-cream">
                  {p.logo_url ? <img src={mediaUrl(p.logo_url)} alt={`${p.name} logo`} loading="lazy" className="max-h-14 object-contain" />
                    : <Icon name="handshake" className="h-9 w-9 text-leaf" />}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-terracotta">{p.category}</span>
                <h3 className="mt-1 font-display text-xl font-bold">{p.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-earth">{p.description}</p>
                {p.collaboration && p.collaboration !== p.description && <p className="mt-3 rounded-xl bg-sand-200 p-3 text-xs text-earth-800"><b>Collaboration:</b> {p.collaboration}</p>}
                {p.website && <a href={p.website} target="_blank" rel="noopener noreferrer" className="mt-4 text-sm font-bold text-leaf-600 hover:underline">Visit website →</a>}
              </div></StaggerItem>
            ))}
          </Stagger>
        )}</Async>
        <div className="mt-14 rounded-3xl bg-forest p-8 text-center sm:p-12">
          <h2 className="font-display text-2xl font-bold !text-white sm:text-3xl">Interested in partnering with CHIMA?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">We welcome institutions, businesses and community groups who share our commitment to the drylands.</p>
          <Link to="/get-involved" className="btn-sun mt-6">Become a partner</Link>
        </div>
      </div></section>
    </>
  )
}
