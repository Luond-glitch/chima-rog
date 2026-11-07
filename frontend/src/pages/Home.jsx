import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import ArtImage from '../components/ArtImage'
import { Async } from '../components/States'
import { PostCard, ProjectCard, fmtDate } from '../components/Cards'
import Icon from '../components/Icon'
import ImpactStats from '../components/ImpactStats'
import Reveal, { Stagger, StaggerItem } from '../components/Reveal'
import Scene from '../components/Scene'
import SectionHeading from '../components/SectionHeading'
import Seo from '../components/Seo'
import { useApi } from '../hooks/useApi'
import { useSettings } from '../lib/SettingsContext'

function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  return (
    <section ref={ref} className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-forest-900">
      <motion.div style={{ y }} className="absolute inset-0 -z-10 h-[115%]">
        <Scene variant="dawn" animated className="h-full w-full" />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-900/90 via-forest-900/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-forest-900/60 to-transparent" />
      <motion.div style={{ opacity: fade }} className="container-x pt-24 pb-28">
        <motion.span initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[.18em] text-sun-400 backdrop-blur">
          <Icon name="sprout" className="h-4 w-4" /> Chipukizi wa Mazingira
        </motion.span>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.8 }}
          className="mt-6 max-w-3xl font-display text-[2.6rem] font-extrabold leading-[1.05] !text-white sm:text-6xl lg:text-7xl">
          Young shoots <span className="text-sun">restoring</span> the drylands.
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.8 }}
          className="mt-6 max-w-xl text-base text-white/85 sm:text-lg">
          CHIMA is a youth-driven community organisation promoting environmental stewardship, climate resilience and self-reliance across Northern Kenya and the Upper Eastern Region.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.8 }}
          className="mt-9 flex flex-wrap gap-3">
          <Link to="/get-involved" className="btn-sun">Join the movement <Icon name="arrow" className="h-4 w-4" /></Link>
          <Link to="/projects" className="btn-ghost">Explore our projects</Link>
        </motion.div>
      </motion.div>
      <svg className="absolute bottom-0 left-0 w-full text-cream" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
        <path fill="currentColor" d="M0 50 C200 10 420 78 700 46 C980 14 1200 70 1440 30 L1440 80 L0 80Z" />
      </svg>
    </section>
  )
}

function Intro() {
  const s = useSettings()
  return (
    <section className="section">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <span className="eyebrow">Who we are</span>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl lg:text-[2.6rem] lg:leading-tight">Rooted in the land. Led by the young.</h2>
          <p className="mt-5 text-lg leading-relaxed text-earth">{s.history.split('\n')[0]}</p>
          <Link to="/about" className="btn-outline mt-7">Our story <Icon name="arrow" className="h-4 w-4" /></Link>
        </Reveal>
        <Stagger className="grid gap-5 sm:grid-cols-2">
          {[['target', 'Our mission', s.mission, 'bg-leaf'], ['eye', 'Our vision', s.vision, 'bg-terracotta']].map(([icon, t, text, bg]) => (
            <StaggerItem key={t}>
              <div className="card card-hover h-full p-7">
                <div className={`mb-4 grid h-12 w-12 place-items-center rounded-2xl text-white ${bg}`}><Icon name={icon} className="h-6 w-6" /></div>
                <h3 className="font-display text-xl font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-earth">{text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

function Programs({ programs }) {
  return (
    <section className="section texture bg-sand-200/60">
      <div className="container-x">
        <SectionHeading eyebrow="What we do" title="Focus areas that build resilient communities." center />
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {programs.map((p) => (
            <StaggerItem key={p.id}>
              <Link to="/programs" className="group card card-hover flex h-full flex-col p-6">
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-forest text-sun transition group-hover:rotate-6 group-hover:bg-leaf group-hover:text-white"><Icon name={p.icon} className="h-6 w-6" /></div>
                <h3 className="font-display text-lg font-bold leading-snug">{p.title}</h3>
                <p className="mt-2 flex-1 text-sm text-earth">{p.summary}</p>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

function Impact({ stats }) {
  return (
    <section className="relative isolate overflow-hidden bg-forest py-20 sm:py-24">
      <Scene variant="green" trees={false} className="absolute inset-0 -z-10 h-full w-full opacity-[.15]" />
      <div className="container-x">
        <SectionHeading eyebrow="Our impact" title="Real change, counted and shared." text="Figures shown are sample data until CHIMA’s verified numbers are entered from the admin dashboard." center light />
        <ImpactStats stats={stats} limit={4} />
        <Reveal className="mt-10 text-center"><Link to="/impact" className="btn-sun">See full impact <Icon name="arrow" className="h-4 w-4" /></Link></Reveal>
      </div>
    </section>
  )
}

function Engagement() {
  const q = useApi('/api/activities?limit=4')
  return (
    <section className="section">
      <div className="container-x grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <SectionHeading eyebrow="In the community" title="Hands in the soil, voices in the room." text="Planting days, trainings, school clubs and dialogues — here’s what the community has been up to lately." />
          <Reveal><Link to="/get-involved" className="btn-primary">Take part <Icon name="arrow" className="h-4 w-4" /></Link></Reveal>
        </div>
        <div className="lg:col-span-3">
          <Async q={q}>{(items) => (
            <Stagger className="grid gap-4 sm:grid-cols-2">
              {items.map((a) => (
                <StaggerItem key={a.id}>
                  <div className="group card card-hover h-full">
                    <ArtImage src={a.image_url} seed={a.title} alt={a.title} className="aspect-[16/9]" />
                    <div className="p-5">
                      <p className="text-xs font-bold text-terracotta">{a.category} · {fmtDate(a.activity_date)}</p>
                      <h3 className="mt-1 font-display text-lg font-bold leading-snug">{a.title}</h3>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-earth"><Icon name="map-pin" className="h-3.5 w-3.5" />{a.location}{a.participants > 0 && ` · ${a.participants} participants`}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          )}</Async>
        </div>
      </div>
    </section>
  )
}

function Partners({ partners }) {
  return (
    <section className="section bg-white">
      <div className="container-x">
        <SectionHeading eyebrow="Together we grow" title="Our partners and collaborators" center />
        <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {partners.slice(0, 6).map((p) => (
            <StaggerItem key={p.id}>
              <div className="grid h-28 place-items-center rounded-2xl border border-sand bg-cream p-4 text-center transition hover:-translate-y-1 hover:shadow-soft">
                {p.logo_url ? <img src={p.logo_url} alt={p.name} loading="lazy" className="max-h-16 object-contain" />
                  : <span className="font-display text-sm font-bold leading-tight text-forest-800">{p.name.replace(' (Sample)', '')}</span>}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mt-8 text-center"><Link to="/partners" className="text-sm font-bold text-leaf-600 hover:underline">All partners →</Link></Reveal>
      </div>
    </section>
  )
}

export default function Home() {
  const q = useApi('/api/home')
  return (
    <>
      <Seo />
      <Hero />
      <Intro />
      <Async q={q}>{(d) => (<>
        <Programs programs={d.programs} />
        <section className="section">
          <div className="container-x">
            <SectionHeading eyebrow="Featured projects" title="Work on the ground, built with communities." />
            <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {d.projects.map((p) => <StaggerItem key={p.id}><ProjectCard p={p} /></StaggerItem>)}
            </Stagger>
            <Reveal className="mt-10 text-center"><Link to="/projects" className="btn-outline">All projects <Icon name="arrow" className="h-4 w-4" /></Link></Reveal>
          </div>
        </section>
        <Impact stats={d.stats} />
        <Engagement />
        <Partners partners={d.partners} />
        <section className="section">
          <div className="container-x">
            <SectionHeading eyebrow="Latest updates" title="News, stories and field reports" />
            <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {d.posts.map((p) => <StaggerItem key={p.id}><PostCard p={p} /></StaggerItem>)}
            </Stagger>
            <Reveal className="mt-10 text-center"><Link to="/news" className="btn-outline">More stories <Icon name="arrow" className="h-4 w-4" /></Link></Reveal>
          </div>
        </section>
      </>)}</Async>
      <CtaBand />
    </>
  )
}

export function CtaBand() {
  return (
    <section className="px-4 pb-16 sm:px-6 lg:px-8">
      <Reveal className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-forest-900 px-6 py-14 text-center sm:py-20">
        <Scene variant="dusk" animated className="absolute inset-0 -z-10 h-full w-full opacity-50" />
        <div className="absolute inset-0 -z-10 bg-forest-900/55" />
        <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold !text-white sm:text-4xl">Be part of the next generation of dryland champions.</h2>
        <p className="mx-auto mt-4 max-w-xl text-white/80">Volunteer, partner with us, or support a project — every contribution helps a seedling become a forest.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/get-involved" className="btn-sun">Get involved</Link>
          <Link to="/contact" className="btn-ghost">Contact us</Link>
        </div>
      </Reveal>
    </section>
  )
}
