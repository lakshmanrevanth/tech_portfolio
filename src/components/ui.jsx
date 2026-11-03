import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { FiGithub, FiLinkedin, FiFileText, FiMail } from 'react-icons/fi'
import { FaXTwitter } from 'react-icons/fa6'
import { SiLeetcode, SiCodeforces, SiCodechef } from 'react-icons/si'

export const icons = {
  github: FiGithub,
  x: FaXTwitter,
  linkedin: FiLinkedin,
  leetcode: SiLeetcode,
  codeforces: SiCodeforces,
  codechef: SiCodechef,
  resume: FiFileText,
  mail: FiMail,
}

export const ease = [0.7, 0, 0.2, 1]
const easeOut = [0.22, 1, 0.36, 1]

// Fade + rise into view on scroll
export function Reveal({ children, delay = 0, y = 30, className, style }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  )
}

// Words slide up out of a mask, one after another.
// segments: [{ t: 'text' }, { t: 'word', className: 'dbl' }, { br: true }]
export function SplitText({ segments, as = 'h2', className, delay = 0, stagger = 0.06, animateNow = false }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const show = animateNow || inView
  const Tag = as
  let i = 0
  return (
    <Tag ref={ref} className={className}>
      {segments.map((seg, si) => {
        if (seg.br) return <br key={si} />
        const words = seg.t.split(/(\s+)/)
        const inner = words.map((w, wi) => {
          if (/^\s+$/.test(w) || !w) return w
          const d = delay + i++ * stagger
          return (
            <span className="w-mask" key={wi}>
              <motion.span
                initial={{ y: '110%' }}
                animate={show ? { y: '0%' } : { y: '110%' }}
                transition={{ duration: 0.9, delay: d, ease }}
              >
                {w}
              </motion.span>
            </span>
          )
        })
        return seg.className
          ? <span key={si} className={`${seg.className} ${show ? 'on' : ''}`}>{inner}</span>
          : <span key={si}>{inner}</span>
      })}
    </Tag>
  )
}

// Text that resolves out of random glyphs when it scrolls into view
const glyphs = '!<>-_\\/[]{}=+*^?#01'
export function Scramble({ text, className, duration = 700 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [out, setOut] = useState(text)
  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    let raf
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1)
      const solved = Math.floor(p * text.length)
      setOut(
        text.split('').map((c, i) => (i < solved || c === ' ' ? c : glyphs[Math.floor(Math.random() * glyphs.length)])).join(''),
      )
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, text, duration])
  return <span ref={ref} className={className}>{out}</span>
}

export function SectionHead({ n, label, title, note }) {
  return (
    <div className="sec-head">
      <div>
        <div className="eyebrow">
          <b>({String(n).padStart(2, '0')})</b> <Scramble text={label} />
        </div>
        <SplitText as="h2" className="sec-title" segments={title} />
      </div>
      {note && <Reveal className="sec-note" delay={0.3}>{note}</Reveal>}
    </div>
  )
}

// Element that leans toward the cursor
export function Magnetic({ children, strength = 0.25 }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15 })
  const sy = useSpring(y, { stiffness: 200, damping: 15 })
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * strength)
    y.set((e.clientY - r.top - r.height / 2) * strength)
  }
  const reset = () => { x.set(0); y.set(0) }
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={reset} style={{ x: sx, y: sy, display: 'inline-flex' }}>
      {children}
    </motion.div>
  )
}

// Writes the cursor position into --x/--y for spotlight hover effects
export function useSpotlight() {
  const ref = useRef(null)
  const onMouseMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--x', `${e.clientX - r.left}px`)
    ref.current.style.setProperty('--y', `${e.clientY - r.top}px`)
  }
  return { ref, onMouseMove }
}

export function Chips({ items }) {
  return <div className="chips">{items.map((t) => <span key={t} className="chip">{t}</span>)}</div>
}

export function Marquee({ items, className = '' }) {
  const row = items.map((t, i) => (
    <span className="mq-item" key={i}>{t}<span className="star">✺</span></span>
  ))
  return (
    <div className={`marquee ${className}`}>
      <div className="mq-track">{row}{row}</div>
    </div>
  )
}
