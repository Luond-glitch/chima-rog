import { useState } from 'react'
import { mediaUrl } from '../lib/api'
import Scene, { variantFor } from './Scene'

/** Shows the uploaded photo when available; otherwise a themed ASAL illustration. */
export default function ArtImage({ src, alt = '', seed, className = '', imgClass = 'object-cover' }) {
  const [failed, setFailed] = useState(false)
  const url = mediaUrl(src)
  return (
    <div className={`relative overflow-hidden bg-sand ${className}`}>
      {url && !failed ? (
        <img src={url} alt={alt} loading="lazy" onError={() => setFailed(true)}
          className={`h-full w-full transition duration-700 group-hover:scale-105 ${imgClass}`} />
      ) : (
        <Scene variant={variantFor(seed || alt)} className="h-full w-full transition duration-700 group-hover:scale-105" />
      )}
    </div>
  )
}
