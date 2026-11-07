import { Link } from 'react-router-dom'
import { CtaBand } from './Home'
import ArtImage from '../components/ArtImage'
import { Async } from '../components/States'
import Icon from '../components/Icon'
import PageHeader from '../components/PageHeader'
import Reveal, { Stagger, StaggerItem } from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import Seo from '../components/Seo'
import { useApi } from '../hooks/useApi'
import { mediaUrl } from '../lib/api'
import { parseLines, parsePairs, useSettings } from '../lib/SettingsContext'

const initials = (n) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()

export function LeaderCard({ l }) {
  return (
    <div className="group card card-hover flex h-full flex-col items-center p-7 text-center">
      {l.photo_url ? (
        <img src={mediaUrl(l.photo_url)} alt={l.name} loading="lazy" className="h-32 w-32 rounded-full object-cover ring-4 ring-sun/60 transition duration-500 group-hover:scale-105" />
      ) : (
        <div className="grid h-32 w-32 place-items-center rounded-full bg-gradient-to-br from-forest to-leaf font-display text-3xl font-bold text-sun ring-4 ring-sun/60">{initials(l.name)}</div>
      )}
      <h3 className="mt-5 font-display text-xl font-bold">{l.name}</h3>
      <p className="text-sm font-semibold text-terracotta">{l.role}</p>
      {l.bio && <p className="mt-3 flex-1 text-sm leading-relaxed text-earth">{l.bio}</p>}
      <div className="mt-4 flex gap-2">
        {l.email && <a href={`mailto:${l.email}`} aria-label={`Email ${l.name}`} className="grid h-9 w-9 place-items-center rounded-full bg-sand-200 text-forest transition hover:bg-leaf hover:text-white"><Icon name="mail" className="h-4 w-4" /></a>}
        {l.linkedin && <a href={l.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${l.name} on LinkedIn`} className="grid h-9 w-9 place-items-center rounded-full bg-sand-200 text-forest transition hover:bg-leaf hover:text-white"><Icon name="linkedin" className="h-4 w-4" /></a>}
      </div>
    </div>
  )
}

function Leadership() {
  const q = useApi('/api/leaders')
  return (
    <section id="leadership" className="section">
      <div className="container-x">
        <SectionHeading eyebrow="Leadership & governance" title="The people steering CHIMA" text="CHIMA is governed by an elected executive committee accountable to its members, supported by an advisory board and programme staff." center />
        <Async q={q}>{(all) => {
          const groups = ['Executive', 'Board', 'Advisor', 'Staff'].map((g) => [g, all.filter((l) => l.group === g)]).filter(([, a]) => a.length)
          const titles = { Executive: 'Executive Committee', Board: 'Board Members', Advisor: 'Advisors', Staff: 'Programme Team' }
          return groups.map(([g, list]) => (
            <div key={g} className="mb-12 last:mb-0">
              <h3 className="mb-6 text-center font-display text-2xl font-bold">{titles[g]}</h3>
              <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((l) => <StaggerItem key={l.id}><LeaderCard l={l} /></StaggerItem>)}
              </Stagger>
            </div>
          ))
        }}</Async>
      </div>
    </section>
  )
}

function Governance() {
  const s = useSettings()
  const roles = parsePairs(s.roles)
  const members = parsePairs(s.membership)
  const icons = ['award', 'handshake', 'file', 'shield', 'users']
  return (
    <>
      <section className="section texture bg-sand-200/60">
        <div className="container-x">
          <SectionHeading eyebrow="Governance structure" title="How CHIMA is governed" center
            text="The General Assembly is CHIMA’s supreme organ. It elects an Executive Committee of five office bearers that manages day-to-day affairs, oversees programmes, finances and partnerships, and ensures legal compliance." />
          <Reveal className="mx-auto mb-10 flex max-w-xl flex-col items-center gap-2 text-center" >
            <span className="rounded-full bg-forest px-6 py-2 font-display font-bold text-white">General Assembly</span>
            <Icon name="chevron" className="h-5 w-5 text-terracotta" />
            <span className="rounded-full bg-leaf px-6 py-2 font-display font-bold text-white">Executive Committee</span>
            <Icon name="chevron" className="h-5 w-5 text-terracotta" />
            <span className="text-sm font-semibold text-earth">Chairperson · Vice Chairperson · Secretary · Treasurer · Member at Large</span>
          </Reveal>
          <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {roles.map((r, i) => (
              <StaggerItem key={r.title}><div className="card card-hover h-full p-7">
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-forest text-sun"><Icon name={icons[i % icons.length]} className="h-6 w-6" /></div>
                <h3 className="font-display text-xl font-bold">{r.title}</h3><p className="mt-2 text-sm leading-relaxed text-earth">{r.text}</p>
              </div></StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid items-start gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Where we work" title="Northern Kenya and the Upper Eastern Region" text={s.area} />
            <p className="flex items-center gap-2 font-semibold text-forest-800"><Icon name="map-pin" className="h-5 w-5 text-terracotta" />{s.address}</p>
            <p className="mt-8 text-earth">{s.eligibility}</p>
            <Link to="/get-involved" className="btn-primary mt-6">Become a member <Icon name="arrow" className="h-4 w-4" /></Link>
          </div>
          <Reveal>
            <div className="card p-6 sm:p-8">
              <h3 className="font-display text-2xl font-bold">Membership categories</h3>
              <ul className="mt-4 divide-y divide-sand">
                {members.map((m) => (
                  <li key={m.title} className="flex items-center justify-between gap-4 py-3"><span className="font-semibold text-forest-800">{m.title}</span><span className="whitespace-nowrap rounded-full bg-sun/25 px-3 py-1 text-xs font-bold text-earth-800">{m.text}</span></li>
                ))}
              </ul>
              {s.membership_note && <p className="mt-4 text-xs leading-relaxed text-earth">{s.membership_note}</p>}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

function Documents() {
  const q = useApi('/api/media?kind=document')
  return (
    <section className="section bg-white">
      <div className="container-x">
        <SectionHeading eyebrow="Documents" title="Organisational profile & resources" text="Download our profile, annual reports and policies." />
        <Async q={q}>{(docs) => (
          <div className="grid gap-4 md:grid-cols-2">
            {docs.map((d) => (
              <a key={d.id} href={d.url ? mediaUrl(d.url) : undefined} target="_blank" rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-sand bg-cream p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-terracotta/15 text-terracotta"><Icon name="file" className="h-6 w-6" /></span>
                <span className="flex-1"><span className="block font-semibold text-forest-800">{d.title}</span><span className="text-xs text-earth">{d.url ? 'Download' : 'Upload a file in admin to enable download'}</span></span>
                <Icon name="arrow" className="h-5 w-5 text-leaf transition group-hover:translate-x-1" />
              </a>
            ))}
          </div>
        )}</Async>
      </div>
    </section>
  )
}

export default function About() {
  const s = useSettings()
  const values = parsePairs(s.values)
  const approach = parsePairs(s.approach)
  const objectives = parseLines(s.objectives)
  const valueIcons = ['leaf', 'megaphone', 'users', 'shield', 'sun', 'handshake']
  return (
    <>
      <Seo title="About" description="Learn about CHIMA – Chipukizi wa Mazingira: our history, mission, vision, values and leadership." />
      <PageHeader eyebrow="About CHIMA" title="A youth-led movement for a climate-resilient North" text="Our story, what we believe, and the people behind the work." variant="dawn" />

      <section className="section">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="eyebrow">Our story</span>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Chipukizi: the custodians of tomorrow’s environment</h2>
            <div className="prose-chima mt-5 text-earth">{s.history.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}</div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative">
              <ArtImage seed="about-story" alt="Northern Kenya dryland landscape" className="aspect-[4/3] rounded-[2rem] shadow-lift" />
              <div className="absolute -bottom-5 -left-3 rounded-2xl bg-sun px-5 py-4 shadow-soft sm:-left-6">
                <p className="font-display text-xl font-bold text-forest-900">Chipukizi</p><p className="text-xs font-semibold text-forest-900/80">“Young shoots” in Kiswahili</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section texture bg-sand-200/60">
        <div className="container-x grid gap-6 md:grid-cols-2">
          {[['target', 'Mission', s.mission, 'bg-leaf'], ['eye', 'Vision', s.vision, 'bg-terracotta']].map(([i, t, text, bg]) => (
            <Reveal key={t}><div className="card h-full p-8 sm:p-10">
              <div className={`mb-5 grid h-14 w-14 place-items-center rounded-2xl text-white ${bg}`}><Icon name={i} className="h-7 w-7" /></div>
              <h3 className="font-display text-2xl font-bold">{t}</h3><p className="mt-3 text-lg leading-relaxed text-earth">{text}</p>
            </div></Reveal>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <SectionHeading eyebrow="Core values" title="What guides everything we do" center />
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <StaggerItem key={v.title}><div className="card card-hover h-full p-7">
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-forest text-sun"><Icon name={valueIcons[i % valueIcons.length]} className="h-6 w-6" /></div>
                <h3 className="font-display text-xl font-bold">{v.title}</h3><p className="mt-2 text-sm leading-relaxed text-earth">{v.text}</p>
              </div></StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section bg-forest-900 text-white">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Strategic priorities" title="Our objectives" light />
            <ol className="space-y-4">
              {objectives.map((o, i) => (
                <Reveal key={i} delay={i * 0.05} as="li" className="flex gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sun font-display font-bold text-forest-900">{i + 1}</span>
                  <p className="pt-1 text-white/85">{o}</p>
                </Reveal>
              ))}
            </ol>
          </div>
          <div>
            <SectionHeading eyebrow="How we work" title="Our approach" light />
            <div className="grid gap-4 sm:grid-cols-2">
              {approach.map((a) => (
                <Reveal key={a.title}><div className="h-full rounded-2xl border border-white/15 bg-white/10 p-5">
                  <h3 className="font-display text-lg font-bold !text-sun-400">{a.title}</h3><p className="mt-1 text-sm text-white/80">{a.text}</p>
                </div></Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Leadership />
      <Governance />
      <Documents />
      <div className="pt-16"><CtaBand /></div>
    </>
  )
}
