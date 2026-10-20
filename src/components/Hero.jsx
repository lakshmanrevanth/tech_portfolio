import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiMapPin, FiCalendar, FiMail, FiCheck } from 'react-icons/fi'
import { HiCheckBadge } from 'react-icons/hi2'
import { profile, socials } from '../data'
import { icons, Magnetic } from './ui'

const ease = [0.22, 1, 0.36, 1]
const item = {
  hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease } },
}

function useTypewriter(words, speed = 70, pause = 1600) {
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

function MeshBanner() {
  const blobs = [
    { c: '#7c5cff', s: 340, x: '10%', y: '20%', d: 14 },
    { c: '#22d3ee', s: 300, x: '55%', y: '10%', d: 18 },
    { c: '#f472b6', s: 280, x: '75%', y: '55%', d: 16 },
    { c: '#34d399', s: 260, x: '30%', y: '60%', d: 20 },
  ]
  return (
    <motion.div
      className="banner"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease }}
    >
      <div className="mesh">
        {blobs.map((b, i) => (
          <motion.span
            key={i}
            style={{ width: b.s, height: b.s, left: b.x, top: b.y, background: b.c }}
            animate={{ x: [0, 60, -40, 0], y: [0, -30, 40, 0], scale: [1, 1.15, 0.9, 1] }}
            transition={{ duration: b.d, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>
      <div className="banner-grid" />
      <div className="banner-text">{profile.handle || profile.name.split(' ').pop()} · portfolio</div>
    </motion.div>
  )
}

export default function Hero() {
  const role = useTypewriter(profile.roles)
  const initials = profile.name.split(' ').map((w) => w[0]).join('').slice(0, 2)

  return (
    <header id="home">
      <MeshBanner />

      <div className="hero-row">
        <motion.div
          className="avatar"
          initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 160, damping: 14, delay: 0.3 }}
        >
          <div className="avatar-inner">
            {profile.avatar ? <img src={profile.avatar} alt={profile.name} /> : initials}
          </div>
          <span className="status" title="Open to opportunities" />
        </motion.div>

        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.45 } } }}>
          <motion.h1 variants={item} className="hero-name">
            {profile.name} <HiCheckBadge className="verified" />
          </motion.h1>
          <motion.div variants={item} className="hero-meta">
            <span><FiMapPin size={13} /> {profile.location}</span>
            {profile.handle && <span>@{profile.handle}</span>}
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.09, delayChildren: 0.6 } } }}
      >
        <motion.div variants={item} className="roles">
          &gt; {role}<span className="caret" />
        </motion.div>
        <motion.p variants={item} className="bio">{profile.bio}</motion.p>
        <motion.ul variants={item} className="bio-highlights">
          {profile.highlights.map((h) => (
            <li key={h}><FiCheck size={14} /> {h}</li>
          ))}
        </motion.ul>

        <motion.div variants={item} className="cta-row">
          {profile.calLink && (
            <Magnetic>
              <a className="btn btn-primary" href={profile.calLink} target="_blank" rel="noreferrer">
                <FiCalendar size={15} /> Book an intro call
              </a>
            </Magnetic>
          )}
          <Magnetic>
            <a className={`btn ${profile.calLink ? '' : 'btn-primary'}`} href={`mailto:${profile.email}`}>
              <FiMail size={15} /> Send an email
            </a>
          </Magnetic>
        </motion.div>

        <motion.div variants={item} className="socials">
          {socials.map((s) => {
            const Icon = icons[s.icon]
            return (
              <a key={s.label} className="social" href={s.href} target={s.href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer">
                <Icon size={14} /> {s.label}
              </a>
            )
          })}
        </motion.div>
      </motion.div>
    </header>
  )
}
