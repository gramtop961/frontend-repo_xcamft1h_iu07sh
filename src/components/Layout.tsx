import { motion, AnimatePresence } from 'framer-motion'
import { variants, transitions } from '../utils/animations'
import { Link, useLocation } from 'react-router-dom'
import Spline from '@splinetool/react-spline'
import '../styles/theme.css'

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  return (
    <div className="min-h-screen neon-dark relative overflow-x-hidden">
      <div className="absolute inset-0 opacity-60 pointer-events-none">
        <Spline scene="https://prod.spline.design/41MGRk-UDPKO-l6W/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10">
        <header className="flex items-center justify-between px-4 sm:px-8 py-4">
          <Link to="/" className="text-2xl font-semibold tracking-tight text-cyan-200 drop-shadow">Sam’s App</Link>
          <nav className="flex items-center gap-2 sm:gap-4 text-sm">
            <Link className="hover:text-cyan-300 transition-colors" to="/clock">Clock</Link>
            <Link className="hover:text-cyan-300 transition-colors" to="/admin">Admin</Link>
            <Link className="hover:text-cyan-300 transition-colors" to="/closing/step-1">Closing</Link>
          </nav>
        </header>
        <main className="px-4 sm:px-8 py-6">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} variants={variants.page} initial="hidden" animate="show" exit="exit" transition={transitions.page}>
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
