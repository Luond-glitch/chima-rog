import { mediaUrl } from '../lib/api'

/** Plays a YouTube/Vimeo link in an iframe, or an uploaded video file with <video>. */
export default function Video({ url, title = 'Video' }) {
  if (!url) return null
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/)
  const vm = url.match(/vimeo\.com\/(\d+)/)
  const embed = yt ? `https://www.youtube-nocookie.com/embed/${yt[1]}` : vm ? `https://player.vimeo.com/video/${vm[1]}` : null
  return embed ? (
    <iframe title={title} src={embed} loading="lazy" allowFullScreen className="aspect-video w-full rounded-2xl" />
  ) : (
    <video src={mediaUrl(url)} controls preload="metadata" className="aspect-video w-full rounded-2xl bg-black" />
  )
}
