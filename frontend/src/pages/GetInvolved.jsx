import { useState } from 'react'
import ContactForm from '../components/ContactForm'
import Icon from '../components/Icon'
import PageHeader from '../components/PageHeader'
import Reveal, { Stagger, StaggerItem } from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import Seo from '../components/Seo'

const WAYS = [
  { kind: 'volunteer', icon: 'sprout', title: 'Volunteer', text: 'Give your time and skills — planting days, trainings, communications, data and more.', subject: 'I would like to volunteer', ph: 'Tell us about your skills, availability and where you would like to help…', cta: 'Offer to volunteer' },
  { kind: 'partner', icon: 'handshake', title: 'Partner with CHIMA', text: 'Institutions, businesses and community groups: let’s design something together.', subject: 'Partnership enquiry', ph: 'Tell us about your organisation and the kind of collaboration you have in mind…', cta: 'Start a partnership' },
  { kind: 'support', icon: 'heart', title: 'Support our work', text: 'Fund seedlings, water tanks or youth training. Every contribution is reported transparently.', subject: 'I would like to support CHIMA', ph: 'How would you like to support (funding, in-kind, sponsorship)?', cta: 'Talk about support' },
  { kind: 'contact', icon: 'users', title: 'Become a member', text: 'Join CHIMA as a youth, adult, group or institutional member and take part in activities and the AGM.', subject: 'Membership application', ph: 'Tell us which membership category fits you and where you are based…', cta: 'Apply for membership' },
]

export default function GetInvolved() {
  const [sel, setSel] = useState(WAYS[0])
  return (
    <>
      <Seo title="Get Involved" description="Volunteer, partner, support CHIMA or join community activities." />
      <PageHeader eyebrow="Get involved" title="Plant something that lasts" text="There is a place for everyone in the CHIMA family." variant="dawn" />
      <section className="section"><div className="container-x">
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WAYS.map((w) => (
            <StaggerItem key={w.title}>
              <button onClick={() => { setSel(w); document.getElementById('involve-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }}
                aria-pressed={sel.title === w.title}
                className={`card card-hover h-full w-full p-7 text-left ${sel.title === w.title ? '!border-leaf ring-2 ring-leaf/40' : ''}`}>
                <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-forest text-sun"><Icon name={w.icon} className="h-7 w-7" /></div>
                <h3 className="font-display text-xl font-bold">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-earth">{w.text}</p>
              </button>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mx-auto mt-16 max-w-3xl">
          <div id="involve-form" className="card scroll-mt-28 p-6 sm:p-10">
            <SectionHeading eyebrow={sel.title} title={sel.cta} text="Fill in the form and a member of the CHIMA team will get back to you." />
            <ContactForm key={sel.kind + sel.title} kind={sel.kind} subject={sel.subject} placeholder={sel.ph} cta="Send" />
          </div>
        </Reveal>
      </div></section>
    </>
  )
}
