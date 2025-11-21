import { motion } from 'framer-motion'
import { variants } from '../utils/animations'
import Layout from '../components/Layout'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
        <motion.h1 variants={variants.fadeInUp} initial="hidden" animate="show" className="text-4xl sm:text-6xl font-extrabold tracking-tight text-cyan-200 drop-shadow mb-8">
          Sam’s App
        </motion.h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
          <Tile to="/clock" title="Employee Clock In / Clock Out" color="from-cyan-500 to-emerald-500" />
          <Tile to="/closing/step-1" title="Closing Shift" color="from-emerald-500 to-cyan-500" />
        </div>
      </div>
    </Layout>
  )
}

function Tile({ to, title, color }: { to: string; title: string; color: string }) {
  return (
    <Link to={to} className="block">
      <motion.div
        variants={variants.tile}
        initial="hidden"
        animate="show"
        whileHover="hover"
        whileTap="tap"
        transition={{ duration: 0.4 }}
        className={`card-dark relative overflow-hidden p-8 sm:p-10 text-left bg-gradient-to-br ${color}/10 hover:${color}/20 border-cyan-500/20`}
      >
        <div className="absolute -inset-1 bg-gradient-to-tr from-cyan-500/10 to-emerald-500/10 rounded-2xl blur-lg pointer-events-none" />
        <div className="relative">
          <h3 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-2">{title}</h3>
          <p className="text-slate-300 text-sm">Tap to continue</p>
        </div>
      </motion.div>
    </Link>
  )
}
