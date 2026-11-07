import { AnimatePresence, motion } from 'framer-motion'
import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { Loading } from './components/States'
import About from './pages/About'
import Contact from './pages/Contact'
import GetInvolved from './pages/GetInvolved'
import Home from './pages/Home'
import Impact from './pages/Impact'
import Media from './pages/Media'
import News, { PostDetail } from './pages/News'
import NotFound from './pages/NotFound'
import Partners from './pages/Partners'
import Programs from './pages/Programs'
import ProjectDetail from './pages/ProjectDetail'
import Projects from './pages/Projects'

// The admin dashboard is code-split so public visitors never download it.
const AdminApp = lazy(() => import('./admin/AdminApp'))

function PublicSite() {
  const location = useLocation()
  useEffect(() => {
    if (!location.hash) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname, location.hash])
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-sun focus:px-4 focus:py-2">Skip to content</a>
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main id="main" key={location.pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:slug" element={<PostDetail />} />
            <Route path="/media" element={<Media />} />
            <Route path="/get-involved" element={<GetInvolved />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <Footer />
    </>
  )
}

export default function App() {
  const { pathname } = useLocation()
  if (pathname.startsWith('/admin'))
    return (
      <Suspense fallback={<Loading />}>
        <Routes><Route path="/admin/*" element={<AdminApp />} /></Routes>
      </Suspense>
    )
  return <PublicSite />
}
