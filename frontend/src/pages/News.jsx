import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CtaBand } from './Home'
import ArtImage from '../components/ArtImage'
import { PostCard, fmtDate } from '../components/Cards'
import Icon from '../components/Icon'
import PageHeader from '../components/PageHeader'
import { Stagger, StaggerItem } from '../components/Reveal'
import Seo from '../components/Seo'
import { Async, Empty } from '../components/States'
import { useApi } from '../hooks/useApi'

const CATS = ['All', 'News', 'Project Update', 'Article', 'Success Story', 'Event', 'Field Report']

export default function News() {
  const [cat, setCat] = useState('All')
  const q = useApi(cat === 'All' ? '/api/posts' : `/api/posts?category=${encodeURIComponent(cat)}`)
  return (
    <>
      <Seo title="News & Stories" description="News, project updates, articles, success stories, events and field reports from CHIMA." />
      <PageHeader eyebrow="News, stories & updates" title="Stories from the field" text="Updates, ideas and success stories from CHIMA and the communities we serve." variant="dawn" />
      <section className="section"><div className="container-x">
        <div className="mb-10 flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
          {CATS.map((c) => (
            <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${cat === c ? 'bg-forest text-white shadow-soft' : 'bg-white text-forest-800 ring-1 ring-sand-400 hover:bg-sand-200'}`}>{c}</button>
          ))}
        </div>
        <Async q={q}>{(list) => list.length ? (
          <Stagger key={cat} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => <StaggerItem key={p.id}><PostCard p={p} /></StaggerItem>)}
          </Stagger>
        ) : <Empty>Nothing published in this category yet.</Empty>}</Async>
      </div></section>
    </>
  )
}

export function PostDetail() {
  const { slug } = useParams()
  const q = useApi(`/api/posts/${slug}`)
  return (
    <Async q={q}>{(p) => (
      <>
        <Seo title={p.title} description={p.excerpt} />
        <PageHeader eyebrow={p.category} title={p.title} variant="green" />
        <article className="section !pt-6"><div className="container-x max-w-3xl">
          <p className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-earth">
            <span className="flex items-center gap-1.5"><Icon name="calendar" className="h-4 w-4" />{fmtDate(p.event_date || p.created_at)}</span>
            <span>By {p.author}</span>
            {p.location && <span className="flex items-center gap-1.5"><Icon name="map-pin" className="h-4 w-4" />{p.location}</span>}
          </p>
          <ArtImage src={p.cover_url} seed={p.title} alt={p.title} className="mb-8 aspect-[16/9] rounded-[2rem] shadow-lift" />
          <p className="mb-6 text-xl font-medium leading-relaxed text-forest-800">{p.excerpt}</p>
          <div className="prose-chima text-lg text-earth">{p.body.split(/\n\n+/).map((para, i) => <p key={i}>{para}</p>)}</div>
          {p.gallery?.length > 0 && (
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {p.gallery.map((g, i) => <ArtImage key={i} src={g} alt={`Gallery ${i + 1}`} seed={p.title + i} className="group aspect-square rounded-2xl" />)}
            </div>
          )}
          <Link to="/news" className="btn-outline mt-10">← Back to stories</Link>
        </div></article>
        <CtaBand />
      </>
    )}</Async>
  )
}
