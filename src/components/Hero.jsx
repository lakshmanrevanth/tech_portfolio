import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FiArrowRight, FiClock } from 'react-icons/fi'
import { profile, socials } from '../data'
import { Magnetic, SplitText, icons } from './ui'

const easeOut = [0.22, 1, 0.36, 1]

function useTypewriter(words, speed = 65, pause = 1600) {
  const [text, setText] = useState('')
  const [i, setI] = useState(0)
  const [deleting, setDeleting] = useState(false)
  useEffect(() => {
    const word = words[i % words.length]
    if (!deleting && text === word) {
      const t = setTimeout(() => setDeleting(true), pause)
      return () => clearTimeout(t)
    }
    if (deleting && text === '') {
      setDeleting(false)
      setI((n) => n + 1)
      return
    }
    const t = setTimeout(
      () => setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
      deleting ? speed / 2 : speed,
    )
    return () => clearTimeout(t)
  }, [text, deleting, i, words, speed, pause])
  return text
}

function useClock(tz) {
  const fmt = () => new Date().toLocaleTimeString('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const [time, setTime] = useState(fmt)
  useEffect(() => {
    const t = setInterval(() => setTime(fmt()), 1000)
    return () => clearInterval(t)
  }, [])
  return time
}

// Rising ember particles behind the hero
function Embers() {
  const ref = useRef(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let w, h, raf
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)
    const spawn = (y = h + Math.random() * h * 0.3) => ({
      x: Math.random() * w, y, r: Math.random() * 1.8 + 0.4,
      vy: Math.random() * 0.5 + 0.15, vx: (Math.random() - 0.5) * 0.25, life: Math.random() * Math.PI * 2,
    })
    const parts = Array.from({ length: 70 }, () => spawn(Math.random() * h))
    const color = getComputedStyle(document.documentElement).getPropertyValue('--ember').trim() || '#ff5b1f'
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of parts) {
        p.y -= p.vy
        p.life += 0.02
        p.x += p.vx + Math.sin(p.life) * 0.2
        if (p.y < -10) Object.assign(p, spawn())
        const fade = Math.min(1, p.y / h) * (0.5 + Math.sin(p.life * 2) * 0.3)
        ctx.globalAlpha = Math.max(0, fade)
        ctx.fillStyle = color
        ctx.shadowColor = color
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} className="embers" aria-hidden />
}

export default function Hero() {
  const role = useTypewriter(profile.roles)
  const time = useClock(profile.timezone)
  const first = profile.name.split(' ').pop().toLowerCase()

  return (
    <header id="home" className="hero">
      <Embers />
      <motion.div
        className="hero-top"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: easeOut }}
      >
        <span className="avail"><span className="dot-live" /> currently @ infosys · specialist programmer</span>
        <span className="eyebrow"><FiClock size={12} /> {time} IST</span>
      </motion.div>

      <SplitText
        as="h1"
        className="hero-title"
        animateNow
        delay={0.25}
        stagger={0.07}
        segments={[
          { t: "hi, i'm " }, { t: first, className: 'dbl' }, { t: '.' }, { br: true },
          { t: 'i build apps' }, { br: true },
          { t: 'people use.' },
        ]}
      />

      <div className="hero-bottom">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1, ease: easeOut }}>
          <p className="hero-bio">
            <strong>{profile.name}</strong> — {profile.bio}
          </p>
          <div className="hero-ctas">
            <Magnetic>
              <a className="btn btn-fire" href={`mailto:${profile.email}`}>
                Get in touch <FiArrowRight className="arrow" />
              </a>
            </Magnetic>
            <a className="btn btn-ghost" href="#projects"><span>See my work</span> ↓</a>
          </div>
          <div className="hero-socials">
            {socials.map((s) => {
              const Icon = icons[s.icon]
              const external = !s.href.startsWith('mailto:')
              return (
                <a
                  key={s.label}
                  className="hero-social"
                  href={s.href}
                  target={external ? '_blank' : undefined}
                  rel="noreferrer"
                  aria-label={s.label}
                >
                  <Icon size={16} /> <span>{s.label}</span>
                </a>
              )
            })}
          </div>
        </motion.div>

        <motion.div
          className="term"
          initial={{ opacity: 0, y: 30, rotate: 2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1, delay: 1.15, ease: easeOut }}
        >
          <div className="term-top"><i /><i /><i /><span>~/{first} — zsh</span></div>
          <div className="term-body">
            <div><span className="p">$</span> whoami</div>
            <div className="hl">{role}<span className="caret" /></div>
            <div><span className="p">$</span> cat highlights.txt</div>
            {profile.highlights.map((h) => (
              <div key={h}><span className="ok">✓</span> {h}</div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div className="scroll-cue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
        <span className="line" /> keep scrolling
      </motion.div>
    </header>
  )
}
