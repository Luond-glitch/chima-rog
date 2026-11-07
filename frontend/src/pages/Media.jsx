import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import ArtImage from '../components/ArtImage'
import Icon from '../components/Icon'
import PageHeader from '../components/PageHeader'
import { Stagger, StaggerItem } from '../components/Reveal'
import Seo from '../components/Seo'
import { Async, Empty } from '../components/States'
import Video from '../components/Video'
import { useApi } from '../hooks/useApi'
import { mediaUrl } from '../lib/api'

const TABS = [['all', 'All'], ['image', 'Photos'], ['video', 'Videos'], ['document', 'Documents']]

function Lightbox({ item, onClose }) {
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [onClose])
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
      className="fixed inset-0 z-[60] grid place-items-center bg-forest-900/90 p-4 backdrop-blur" role="dialog" aria-modal="true" aria-label={item.title}>
      <motion.div initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-4xl">
        {item.kind === 'video'
          ? (item.url ? <Video url={item.url} title={item.title} /> : <div className="grid aspect-video place-items-center rounded-2xl bg-forest text-center text-white/80"><div><Icon name="play" className="mx-auto mb-2 h-10 w-10 text-sun" />Sample video — upload a file or paste a YouTube link in the admin dashboard.</div></div>)
          : <ArtImage src={item.url} seed={item.title} alt={item.title} className="aspect-[16/10] rounded-2xl" imgClass="object-contain bg-black" />}
        <p className="mt-3 text-center font-semibold text-white">{item.title}</p>
        {item.caption && <p className="text-center text-sm text-white/70">{item.caption}</p>}
      </motion.div>
      <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 rounded-full bg-white/15 p-2 text-white hover:bg-white/25"><Icon name="x" className="h-6 w-6" /></button>
    </motion.div>
  )
}

export default function Media() {
  const [tab, setTab] = useState('all')
  const [open, setOpen] = useState(null)
  const q = useApi('/api/media')
  return (
    <>
      <Seo title="Media Gallery" description="Photos, videos and documents from CHIMA’s work in the field." />
      <PageHeader eyebrow="Media" title="Photos, videos & field reports" text="Placeholder media is shown until CHIMA uploads real files from the admin dashboard." variant="noon" />
      <section className="section"><div className="container-x">
        <div className="mb-10 flex flex-wrap gap-2" role="tablist">
          {TABS.map(([k, l]) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${tab === k ? 'bg-forest text-white shadow-soft' : 'bg-white text-forest-800 ring-1 ring-sand-400 hover:bg-sand-200'}`}>{l}</button>
          ))}
        </div>
        <Async q={q}>{(all) => {
          const list = all.filter((m) => tab === 'all' || m.kind === tab)
          if (!list.length) return <Empty>No media here yet.</Empty>
          return (
            <Stagger key={tab} className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
              {list.map((m, i) => (
                <StaggerItem key={m.id} className="break-inside-avoid">
                  {m.kind === 'document' ? (
                    <a href={m.url ? mediaUrl(m.url) : undefined} target="_blank" rel="noopener noreferrer" className="card card-hover flex items-center gap-4 p-5">
                      <span className="grid h-12 w-12 place-items-center rounded-xl bg-terracotta/15 text-terracotta"><Icon name="file" className="h-6 w-6" /></span>
                      <span className="font-semibold text-forest-800">{m.title}</span>
                    </a>
                  ) : (
                    <button onClick={() => setOpen(m)} className="group card card-hover relative block w-full text-left">
                      <ArtImage src={m.kind === 'video' ? m.thumbnail_url : m.url} seed={m.title} alt={m.title} className={i % 3 === 0 ? 'aspect-[4/5]' : 'aspect-[4/3]'} />
                      {m.kind === 'video' && <span className="absolute inset-0 grid place-items-center"><span className="grid h-16 w-16 place-items-center rounded-full bg-sun text-forest-900 shadow-lift transition group-hover:scale-110"><Icon name="play" className="h-7 w-7" /></span></span>}
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-900/85 to-transparent p-4 pt-12 text-sm font-semibold text-white">{m.title}</span>
                    </button>
                  )}
                </StaggerItem>
              ))}
            </Stagger>
          )
        }}</Async>
      </div></section>
      <AnimatePresence>{open && <Lightbox item={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </>
  )
}
