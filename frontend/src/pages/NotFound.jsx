import { Link } from 'react-router-dom'
import Scene from '../components/Scene'
import Seo from '../components/Seo'

export default function NotFound() {
  return (
    <section className="relative isolate grid min-h-screen place-items-center overflow-hidden bg-forest-900 px-4 text-center">
      <Seo title="Page not found" />
      <Scene variant="dusk" className="absolute inset-0 -z-10 h-full w-full opacity-60" />
      <div>
        <p className="font-display text-8xl font-extrabold text-sun">404</p>
        <h1 className="mt-2 font-display text-3xl font-bold !text-white">This path has dried up</h1>
        <p className="mt-2 text-white/80">The page you’re looking for doesn’t exist or has moved.</p>
        <Link to="/" className="btn-sun mt-6">Back to home</Link>
      </div>
    </section>
  )
}
