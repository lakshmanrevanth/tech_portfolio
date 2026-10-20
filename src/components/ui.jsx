import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
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

const ease = [0.22, 1, 0.36, 1]

// Fade + blur + rise into view on scroll
export function Reveal({ children, delay = 0, y = 24, className, as = 'div' }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </Tag>
  )
}

export function Section({ id, label, title, action, children }) {
  return (
    <section id={id}>
      <Reveal className="section-head">
        <div>
          <div className="section-title">{label}</div>
          <h2 className="section-heading">{title}</h2>
        </div>
        {action}
      </Reveal>
      {children}
    </section>
  )
}

// Card with a cursor-following spotlight and gradient border
export function Card({ children, className = '', as = 'div', delay = 0, ...rest }) {
  const ref = useRef(null)
  const Tag = motion[as]
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--x', `${e.clientX - r.left}px`)
    ref.current.style.setProperty('--y', `${e.clientY - r.top}px`)
  }
  return (
    <Tag
      ref={ref}
      onMouseMove={onMove}
      className={`card ${className}`}
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay, ease }}
      whileHover={{ y: -4 }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

// Element that leans toward the cursor
export function Magnetic({ children, strength = 0.3 }) {
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

const statusClass = { Live: 'badge-live', Completed: 'badge-live', Building: 'badge-building', Research: 'badge-research', Archived: 'badge-archived' }

export function StatusBadge({ status }) {
  return (
    <span className={`badge ${statusClass[status] || ''}`}>
      <span className="dot" />
      {status}
    </span>
  )
}

export function Tags({ items }) {
  return (
    <div className="tags">
      {items.map((t) => <span key={t} className="tag">{t}</span>)}
    </div>
  )
}

export function Stats({ items }) {
  if (!items?.length) return null
  return (
    <div className="stats">
      {items.map((s) => (
        <div key={s.label} className="stat">
          <strong>{s.value}</strong>
          <span>{s.label}</span>
        </div>
      ))}
    </div>
  )
}
