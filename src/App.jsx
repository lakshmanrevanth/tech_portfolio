import { useCallback, useEffect, useState } from 'react'
import { motion, useScroll, useSpring, useMotionValue } from 'framer-motion'
import { FiCommand, FiSun, FiMoon } from 'react-icons/fi'
import { profile, skills, hackathons, dsa, interests, highlights } from './data'
import Hero from './components/Hero'
import CommandPalette from './components/CommandPalette'
import { Marquee } from './components/ui'
import {
  Experience, Projects, Hackathons, GitHubActivity, DSA, Skills, Education, Interests, Highlights, Guestbook, Contact, Footer,
} from './components/Sections'

function CursorGlow() {
  const x = useMotionValue(-1000)
  const y = useMotionValue(-1000)
  const sx = useSpring(x, { stiffness: 90, damping: 20 })
  const sy = useSpring(y, { stiffness: 90, damping: 20 })
  useEffect(() => {
    const move = (e) => { x.set(e.clientX); y.set(e.clientY) }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [x, y])
  return <motion.div className="cursor-glow" style={{ left: sx, top: sy }} />
}

const navLinks = [
  { href: '#experience', label: 'experience' },
  { href: '#projects', label: 'work' },
  { href: '#skills', label: 'skills' },
  { href: '#education', label: 'education' },
  { href: '#contact', label: 'contact' },
]

export default function App() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark')
  const [cmdOpen, setCmdOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })
  const first = profile.name.split(' ').pop().toLowerCase()

  const toggleTheme = useCallback(() => {
    const apply = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
    if (document.startViewTransition) document.startViewTransition(apply)
    else apply()
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('theme', theme) } catch {}
  }, [theme])

  useEffect(() => {
    document.title = `${profile.name} — Software Engineer`
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCmdOpen((o) => !o) }
    }
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('scroll', onScroll) }
  }, [])

  // Number only the sections that actually render
  const sections = [
    Experience,
    Projects,
    hackathons.length > 0 && Hackathons,
    profile.github && GitHubActivity,
    dsa.length > 0 && DSA,
    Skills,
    Education,
    interests.watching.length > 0 && Interests,
    highlights.length > 0 && Highlights,
    Guestbook,
  ].filter(Boolean)

  return (
    <>
      <CursorGlow />
      <div className="grain" />
      <motion.div className="progress" style={{ scaleX: progress }} />

      <motion.nav
        className={`nav ${scrolled ? 'scrolled' : ''}`}
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="wrap nav-inner">
          <a href="#home" className="logo"><span className="spark">✺</span>{first}</a>
          <div className="nav-links">
            {navLinks.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
          </div>
          <div className="nav-actions">
            <button className="icon-btn" onClick={() => setCmdOpen(true)} aria-label="Open command palette">
              <FiCommand size={13} /><span className="kbd-label">K</span>
            </button>
            <motion.button className="icon-btn" onClick={toggleTheme} whileTap={{ rotate: 180, scale: 0.9 }} aria-label="Toggle theme">
              {theme === 'dark' ? <FiSun size={14} /> : <FiMoon size={14} />}
            </motion.button>
            <a className="btn btn-fire btn-sm" href={`mailto:${profile.email}`}>hire me</a>
          </div>
        </div>
      </motion.nav>

      <main>
        <div className="wrap"><Hero /></div>
        <Marquee
          className="tilt"
          items={['infosys', 'agentic ai', 'flutter apps', 'full-stack', 'samsung prism', 'computer vision', 'rest apis', 'supabase']}
        />
        {sections.map((S, i) => (
          <S key={i} n={i + 1} />
        ))}
        <div style={{ marginTop: 120 }}>
          <Marquee className="rev" items={Object.values(skills).flat()} />
        </div>
        <Contact />
      </main>
      <Footer />

      <CommandPalette open={cmdOpen} setOpen={setCmdOpen} theme={theme} toggleTheme={toggleTheme} />
    </>
  )
}
