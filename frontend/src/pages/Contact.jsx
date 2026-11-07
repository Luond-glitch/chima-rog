import ContactForm from '../components/ContactForm'
import Icon from '../components/Icon'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import Seo from '../components/Seo'
import { useSettings } from '../lib/SettingsContext'

export default function Contact() {
  const s = useSettings()
  const socials = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'].filter((k) => s[k])
  const items = [
    ['mail', 'Email', s.email, `mailto:${s.email}`],
    ['phone', 'Telephone', s.phone, `tel:${s.phone.replace(/\s/g, '')}`],
    ['map-pin', 'Location', s.address, null],
  ]
  return (
    <>
      <Seo title="Contact Us" description="Get in touch with CHIMA – Chipukizi wa Mazingira." />
      <PageHeader eyebrow="Contact us" title="Let’s talk" text="Questions, ideas or collaboration proposals — we’d love to hear from you." variant="noon" />
      <section className="section"><div className="container-x grid gap-10 lg:grid-cols-5">
        <Reveal className="lg:col-span-3"><div className="card p-6 sm:p-10">
          <h2 className="mb-6 font-display text-2xl font-bold">Send us a message</h2>
          <ContactForm />
        </div></Reveal>
        <Reveal delay={0.1} className="space-y-5 lg:col-span-2">
          <div className="card space-y-5 p-6">
            {items.map(([i, l, v, href]) => (
              <div key={l} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-leaf/15 text-leaf-600"><Icon name={i} /></span>
                <div><p className="text-xs font-bold uppercase tracking-wider text-terracotta">{l}</p>
                  {href ? <a href={href} className="break-all font-medium text-forest-800 hover:text-leaf-600">{v}</a> : <p className="font-medium text-forest-800">{v}</p>}</div>
              </div>
            ))}
            <div className="flex gap-2 pt-1">
              {socials.map((k) => <a key={k} href={s[k]} target="_blank" rel="noopener noreferrer" aria-label={k} className="grid h-10 w-10 place-items-center rounded-full bg-forest text-white transition hover:-translate-y-0.5 hover:bg-leaf"><Icon name={k} className="h-4 w-4" /></a>)}
            </div>
          </div>
          <div className="card overflow-hidden">
            <iframe title="CHIMA location map" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(s.map_query || s.address)}&output=embed`}
              className="h-72 w-full border-0" />
          </div>
        </Reveal>
      </div></section>
    </>
  )
}
