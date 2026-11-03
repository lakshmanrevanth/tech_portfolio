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

// Rising ember particles behind the hero.
// Glow comes from a pre-rendered sprite (canvas shadowBlur is very slow),
// and the loop stops while the hero is off-screen or the tab is hidden.
function Embers() {
  const ref = useRef(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const small = window.matchMedia('(max-width: 700px)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2)
    const color = getComputedStyle(document.documentElement).getPropertyValue('--ember').trim() || '#ff5b1f'

    const sprite = document.createElement('canvas')
    const S = 32
    sprite.width = sprite.height = S
    const sctx = sprite.getContext('2d')
    const g = sctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2)
    g.addColorStop(0, color)
    g.addColorStop(0.25, color)
    g.addColorStop(1, 'transparent')
    sctx.fillStyle = g
    sctx.fillRect(0, 0, S, S)

    let w = 0, h = 0, raf = 0, running = false, onScreen = true
    const resize = () => {
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const spawn = (y = h + Math.random() * h * 0.3) => ({
      x: Math.random() * w, y, r: Math.random() * 1.8 + 0.4,
      vy: Math.random() * 0.5 + 0.15, vx: (Math.random() - 0.5) * 0.25, life: Math.random() * Math.PI * 2,
    })
    const parts = Array.from({ length: small ? 32 : 60 }, () => spawn(Math.random() * h))
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of parts) {
        p.y -= p.vy
        p.life += 0.02
        p.x += p.vx + Math.sin(p.life) * 0.2
        if (p.y < -10) Object.assign(p, spawn())
        const a = Math.min(1, p.y / h) * (0.5 + Math.sin(p.life * 2) * 0.3)
        if (a <= 0) continue
        ctx.globalAlpha = a
        const d = p.r * 7
        ctx.drawImage(sprite, p.x - d / 2, p.y - d / 2, d, d)
      }
      raf = requestAnimationFrame(draw)
    }
    const update = () => {
      const should = onScreen && !document.hidden
      if (should && !running) { running = true; raf = requestAnimationFrame(draw) }
      else if (!should && running) { running = false; cancelAnimationFrame(raf) }
    }
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; update() })
    io.observe(canvas)
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    document.addEventListener('visibilitychange', update)
    update()
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
  }, [])
  return <canvas ref={ref} className="embers" aria-hidden />
}

// Small components so the typewriter / clock re-render only themselves, not the whole hero
function Role() {
  const role = useTypewriter(profile.roles)
  return <div className="hl">{role}<span className="caret" /></div>
}

function Clock() {
  const time = useClock(profile.timezone)
  return <span className="eyebrow"><FiClock size={12} /> {time} IST</span>
}

export default function Hero() {
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
        <Clock />
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
            <Role />
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
