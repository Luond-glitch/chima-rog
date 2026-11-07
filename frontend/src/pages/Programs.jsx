import { CtaBand } from './Home'
import ArtImage from '../components/ArtImage'
import Icon from '../components/Icon'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import Seo from '../components/Seo'
import { Async } from '../components/States'
import { useApi } from '../hooks/useApi'

export default function Programs() {
  const q = useApi('/api/programs')
  return (
    <>
      <Seo title="Our Programs" description="CHIMA’s focus areas: conservation, climate resilience, sustainable agriculture, gender inclusion, youth empowerment and more." />
      <PageHeader eyebrow="Our programs" title="Focus areas that grow resilience" text="Eight connected thematic areas that tackle drylands challenges from every angle." variant="green" />
      <section className="section">
        <div className="container-x">
          <nav aria-label="Programs" className="mb-12 flex flex-wrap gap-2">
            <Async q={q}>{(list) => list.map((p) => (
              <a key={p.id} href={`#${p.slug}`} className="rounded-full border border-sand-400 bg-white px-4 py-2 text-xs font-semibold text-forest-800 transition hover:bg-forest hover:text-white">{p.title.split(' & ')[0]}</a>
            ))}</Async>
          </nav>
          <Async q={q}>{(list) => (
            <div className="space-y-16 sm:space-y-24">
              {list.map((p, i) => (
                <Reveal key={p.id}>
                  <article id={p.slug} className="grid scroll-mt-28 items-center gap-8 lg:grid-cols-2 lg:gap-14">
                    <div className={i % 2 ? 'lg:order-2' : ''}>
                      <div className="group relative">
                        <ArtImage src={p.image_url} seed={p.title} alt={p.title} className="aspect-[4/3] rounded-[2rem] shadow-lift" />
                        <div className="absolute -bottom-5 right-6 grid h-16 w-16 place-items-center rounded-2xl bg-sun text-forest-900 shadow-soft"><Icon name={p.icon} className="h-8 w-8" /></div>
                      </div>
                    </div>
                    <div>
                      <span className="eyebrow">Focus area {String(i + 1).padStart(2, '0')}</span>
                      <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">{p.title}</h2>
                      <p className="mt-4 text-lg font-medium text-leaf-600">{p.summary}</p>
                      <p className="mt-3 leading-relaxed text-earth">{p.description}</p>
                      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                        {(p.highlights || []).map((h) => (
                          <li key={h} className="flex items-start gap-2 text-sm font-medium text-forest-800"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-leaf" />{h}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}</Async>
        </div>
      </section>
      <CtaBand />
    </>
  )
}
