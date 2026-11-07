import Reveal from './Reveal'

export default function SectionHeading({ eyebrow, title, text, center = false, light = false }) {
  return (
    <Reveal className={`mb-12 max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && <span className={`eyebrow ${light ? '!text-sun' : ''}`}>{eyebrow}</span>}
      <h2 className={`mt-3 font-display text-3xl font-bold sm:text-4xl lg:text-[2.6rem] lg:leading-tight ${light ? '!text-white' : ''}`}>{title}</h2>
      {text && <p className={`mt-4 text-base leading-relaxed sm:text-lg ${light ? 'text-white/80' : 'text-earth'}`}>{text}</p>}
    </Reveal>
  )
}
