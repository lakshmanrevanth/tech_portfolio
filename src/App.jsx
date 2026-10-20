import { useCallback, useEffect, useState } from 'react'
import { motion, useScroll, useSpring, useMotionValue } from 'framer-motion'
import { FiCommand, FiSun, FiMoon, FiHome, FiBriefcase, FiFolder, FiCode, FiMessageSquare, FiMail } from 'react-icons/fi'
import { profile, hackathons, dsa, interests, highlights } from './data'
import Hero from './components/Hero'
import CommandPalette from './components/CommandPalette'
import {
  Experience, Projects, Hackathons, GitHubActivity, DSA, Skills, Education, Interests, Highlights, Guestbook, Quote, Footer,
} from './components/Sections'

function useClock(tz) {
  const fmt = () => new Date().toLocaleTimeString('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
  const [time, setTime] = useState(fmt)
  useEffect(() => {
    const t = setInterval(() => setTime(fmt()), 1000)
    return () => clearInterval(t)
  }, [])
  return time
}

const dockItems = [
  { id: 'home', label: 'Home', icon: FiHome },
  { id: 'experience', label: 'Experience', icon: FiBriefcase },
  { id: 'projects', label: 'Projects', icon: FiFolder },
  { id: 'skills', label: 'Skills', icon: FiCode },
  { id: 'guestbook', label: 'Guestbook', icon: FiMessageSquare },
]

function Dock({ onCmd }) {
  const [active, setActive] = useState('home')
  const [hover, setHover] = useState(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    dockItems.forEach((d) => { const el = document.getElementById(d.id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])

  const renderItem = ({ id, label, icon: Icon, onClick, href }) => (
    <motion.a
      key={id}
      href={href || `#${id}`}
      onClick={onClick}
      className={`dock-item ${active === id ? 'active' : ''}`}
      onMouseEnter={() => setHover(label)}
      onMouseLeave={() => setHover(null)}
      whileHover={{ scale: 1.15, y: -3 }}
      whileTap={{ scale: 0.92 }}
      aria-label={label}
    >
      {active === id && <motion.span layoutId="dock-pill" className="pill" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
      <Icon size={17} />
      {hover === label && (
        <motion.span className="tip" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>{label}</motion.span>
      )}
    </motion.a>
  )

  return (
    <motion.nav
      className="dock"
      initial={{ y: 80, opacity: 0, x: '-50%' }}
      animate={{ y: 0, opacity: 1, x: '-50%' }}
      transition={{ delay: 1, type: 'spring', stiffness: 200, damping: 20 }}
    >
      {dockItems.map(renderItem)}
      <span className="dock-sep" />
      {renderItem({ id: 'mail', label: 'Email', icon: FiMail, href: `mailto:${profile.email}` })}
      {renderItem({ id: 'cmd', label: 'Search ⌘K', icon: FiCommand, href: '#', onClick: (e) => { e.preventDefault(); onCmd() } })}
    </motion.nav>
  )
}

function Background() {
  const x = useMotionValue(-1000)
  const y = useMotionValue(-1000)
  const sx = useSpring(x, { stiffness: 80, damping: 20 })
  const sy = useSpring(y, { stiffness: 80, damping: 20 })
  useEffect(() => {
    const move = (e) => { x.set(e.clientX); y.set(e.clientY) }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [x, y])

  return (
    <>
      <div className="bg-grid" />
      <motion.div
        className="bg-blob"
        style={{ width: 500, height: 500, background: 'var(--accent)', top: -200, left: '10%' }}
        animate={{ x: [0, 80, 0], y: [0, 40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="bg-blob"
        style={{ width: 400, height: 400, background: 'var(--accent-2)', top: -100, right: '5%' }}
        animate={{ x: [0, -60, 0], y: [0, 60, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div className="cursor-glow" style={{ left: sx, top: sy }} />
      <div className="noise" />
    </>
  )
}

export default function App() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark')
  const [cmdOpen, setCmdOpen] = useState(false)
  const time = useClock(profile.timezone)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })

  const toggleTheme = useCallback(() => {
    const apply = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
    // Smooth cross-fade where the View Transitions API is supported
    if (document.startViewTransition) document.startViewTransition(apply)
    else apply()
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('theme', theme) } catch {}
  }, [theme])

  useEffect(() => {
    document.title = `${profile.name} — Portfolio`
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCmdOpen((o) => !o) }
      const typing = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)
      if (!typing && !e.metaKey && !e.ctrlKey && e.key.toLowerCase() === 't') toggleTheme()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggleTheme])

  return (
    <>
      <Background />
      <motion.div className="progress" style={{ scaleX: progress }} />

      <main className="container">
        <motion.div className="topbar" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
          <div className="clock"><span className="live-dot" /> {time} · IST</div>
          <div className="topbar-actions">
            <button className="kbd-btn" onClick={() => setCmdOpen(true)}>
              <FiCommand size={13} /> <span className="kbd-label">Command Palette</span> <kbd>⌘K</kbd>
            </button>
            <motion.button className="icon-btn" onClick={toggleTheme} whileTap={{ rotate: 180, scale: 0.9 }} aria-label="Toggle theme">
              {theme === 'dark' ? <FiSun size={15} /> : <FiMoon size={15} />}
            </motion.button>
          </div>
        </motion.div>

        <Hero />
        <Experience />
        <Projects />
        {hackathons.length > 0 && <Hackathons />}
        {profile.github && <GitHubActivity />}
        {dsa.length > 0 && <DSA />}
        <Skills />
        <Education />
        {interests.watching.length > 0 && <Interests />}
        {highlights.length > 0 && <Highlights />}
        <Guestbook />
        <Quote />
        <Footer />
      </main>

      <Dock onCmd={() => setCmdOpen(true)} />
      <CommandPalette open={cmdOpen} setOpen={setCmdOpen} theme={theme} toggleTheme={toggleTheme} />
    </>
  )
}
