import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowUpRight, FiChevronDown, FiAward, FiExternalLink, FiSend, FiMusic } from 'react-icons/fi'
import {
  profile, experiences, projects, hackathons, dsa, skills, education, certifications, interests, highlights, quote,
} from '../data'
import { Section, Card, Reveal, StatusBadge, Tags, Stats, icons } from './ui'

const ease = [0.22, 1, 0.36, 1]

/* ---------------- Experience ---------------- */
function ExperienceCard({ exp, i }) {
  const [open, setOpen] = useState(i === 0)
  return (
    <Card delay={i * 0.06}>
      <div className="exp-head">
        <div className="logo-tile">{exp.logo}</div>
        <div className="exp-title">
          <h3>{exp.company} <span className="badge">{exp.mode}</span></h3>
          <p>{exp.role}</p>
        </div>
        <div className="exp-period">{exp.period}</div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            style={{ overflow: 'hidden' }}
          >
            <ul className="points">{exp.points.map((p) => <li key={p}>{p}</li>)}</ul>
            <Tags items={exp.tags} />
            <Stats items={exp.stats} />
          </motion.div>
        )}
      </AnimatePresence>
      <button className="expand-btn" onClick={() => setOpen((o) => !o)}>
        {open ? 'Show less' : 'Show details'}
        <motion.span animate={{ rotate: open ? 180 : 0 }} style={{ display: 'inline-flex' }}><FiChevronDown /></motion.span>
      </button>
    </Card>
  )
}

export function Experience() {
  return (
    <Section id="experience" label="Experience" title={<>Where I've <em>worked</em></>}>
      <div className="stack">
        {experiences.map((exp, i) => <ExperienceCard key={exp.company} exp={exp} i={i} />)}
      </div>
    </Section>
  )
}

/* ---------------- Projects ---------------- */
export function Projects() {
  return (
    <Section
      id="projects"
      label="Projects"
      title={<>Things I've <em>built</em></>}
      action={profile.github && <a className="view-all" href={`https://github.com/${profile.github}?tab=repositories`} target="_blank" rel="noreferrer">View all <FiArrowUpRight /></a>}
    >
      <div className="grid-2">
        {projects.map((p, i) => (
          <Card
            key={p.title}
            {...(p.href ? { as: 'a', href: p.href, target: '_blank', rel: 'noreferrer' } : {})}
            className="project"
            delay={(i % 2) * 0.08}
          >
            <div className="project-preview">
              <div
                className="pv-bg"
                style={{
                  background: `radial-gradient(circle at 20% 20%, hsl(${p.hue} 90% 65% / .55), transparent 55%),
                               radial-gradient(circle at 80% 80%, hsl(${(p.hue + 60) % 360} 90% 60% / .45), transparent 55%)`,
                }}
              />
              <div className="pv-window">
                <div className="dots"><i /><i /><i /></div>
                <div className="lines">
                  <b style={{ width: '55%', background: `hsl(${p.hue} 80% 65% / .6)` }} />
                  <b style={{ width: '85%' }} />
                  <b style={{ width: '70%' }} />
                </div>
              </div>
            </div>
            <div className="project-body">
              <h3>{p.title} <StatusBadge status={p.status} /></h3>
              <p>{p.description}</p>
              <Tags items={p.tags} />
              {p.href && <span className="project-link">View project <FiArrowUpRight /></span>}
            </div>
          </Card>
        ))}
      </div>
    </Section>
  )
}

/* ---------------- Hackathons ---------------- */
export function Hackathons() {
  return (
    <Section id="hackathons" label="Hackathons" title={<>Built under <em>pressure</em></>}>
      <div className="stack">
        {hackathons.map((h, i) => (
          <Card key={h.name} delay={i * 0.06}>
            <div className="exp-head">
              <div className="logo-tile"><FiAward size={20} /></div>
              <div className="exp-title">
                <h3>{h.name}</h3>
                <p><span className={`badge ${h.place === 'Winner' ? 'badge-gold' : 'badge-silver'}`}>🏆 {h.place}</span></p>
              </div>
              <a className="view-all" href={h.href} target="_blank" rel="noreferrer">Repo <FiArrowUpRight /></a>
            </div>
            <Stats items={h.stats} />
            <ul className="points">{h.points.map((p) => <li key={p}>{p}</li>)}</ul>
            <Tags items={h.tags} />
          </Card>
        ))}
      </div>
    </Section>
  )
}

/* ---------------- GitHub heatmap ---------------- */
// Deterministic fallback so the grid still renders offline or without a username
function fakeContributions() {
  let seed = 42
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  const days = []
  const today = new Date()
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const r = rand()
    days.push({ date: d.toISOString().slice(0, 10), count: r < 0.3 ? 0 : Math.floor(r * r * 14) })
  }
  return days
}

function level(count) {
  if (count === 0) return 0
  if (count < 3) return 1
  if (count < 6) return 2
  if (count < 10) return 3
  return 4
}

const heatColor = (l) => (l === 0 ? 'var(--heat-0)' : `color-mix(in srgb, var(--accent) ${[0, 30, 55, 80, 100][l]}%, transparent)`)

export function GitHubActivity() {
  const [days, setDays] = useState(fakeContributions)
  const [live, setLive] = useState(false)

  useEffect(() => {
    if (!profile.github) return
    fetch(`https://github-contributions-api.jogruber.de/v4/${profile.github}?y=last`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => { if (d.contributions?.length) { setDays(d.contributions); setLive(true) } })
      .catch(() => {})
  }, [])

  const total = useMemo(() => days.reduce((s, d) => s + d.count, 0), [days])
  // Pad the start so the first column aligns with the correct weekday
  const pad = new Date(days[0].date).getDay()

  return (
    <Section id="github" label="GitHub Activity" title={<>Shipping <em>consistently</em></>}>
      <Card>
        <div className="heatmap-wrap">
          <div className="heatmap">
            {Array.from({ length: pad }).map((_, i) => <span key={`p${i}`} />)}
            {days.map((d, i) => (
              <motion.span
                key={d.date}
                className="heat"
                title={`${d.count} contributions on ${d.date}`}
                style={{ background: heatColor(level(d.count)) }}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: Math.floor(i / 7) * 0.012, duration: 0.3 }}
              />
            ))}
          </div>
        </div>
        <div className="heat-legend">
          <span>{total.toLocaleString()} contributions in the last year{!live && ' (sample data)'}</span>
          <span className="scale">
            Less {[0, 1, 2, 3, 4].map((l) => <span key={l} className="heat" style={{ background: heatColor(l) }} />)} More
          </span>
        </div>
      </Card>
    </Section>
  )
}

/* ---------------- DSA ---------------- */
export function DSA() {
  return (
    <Section id="dsa" label="DSA & Competitive Programming" title={<>Solving <em>problems</em></>}>
      <div className="grid-3">
        {dsa.map((d, i) => {
          const Icon = icons[d.platform.toLowerCase()]
          return (
            <Card key={d.platform} as="a" href={d.href} target="_blank" rel="noreferrer" className="dsa-card" delay={i * 0.08}>
              <div className="platform"><Icon style={{ color: d.color }} /> {d.platform}</div>
              <div className="rating">{d.rating}</div>
              <div className="label">Max rating</div>
              <div className="meta">
                <span>{d.solved} solved</span>
                <span className="badge" style={{ color: d.color, borderColor: d.color + '55' }}>{d.badge}</span>
              </div>
            </Card>
          )
        })}
      </div>
    </Section>
  )
}

/* ---------------- Skills ---------------- */
export function Skills() {
  const all = Object.values(skills).flat()
  return (
    <Section id="skills" label="Skills & Technologies" title={<>My <em>toolbox</em></>}>
      <Card>
        {Object.entries(skills).map(([group, items]) => (
          <div key={group} className="skill-group">
            <h4>{group}</h4>
            <div className="tags">
              {items.map((s, i) => (
                <motion.span
                  key={s}
                  className="tag"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ scale: 1.08 }}
                >
                  {s}
                </motion.span>
              ))}
            </div>
          </div>
        ))}
      </Card>
      <div className="marquee">
        <div className="marquee-track">
          {[...all, ...all].map((s, i) => <span key={i} className="tag">{s}</span>)}
        </div>
      </div>
    </Section>
  )
}

/* ---------------- Education ---------------- */
export function Education() {
  return (
    <Section id="education" label="Education & Certifications" title={<>Always <em>learning</em></>}>
      <div className="stack">
        <Card>
          <div className="edu-row">
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>{education.school}</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14 }}>{education.degree}</p>
            </div>
            <span className="exp-period">{education.period}</span>
          </div>
          <Tags items={education.coursework} />
        </Card>
        {certifications.map((c, i) => (
          <Card
            key={c.name}
            {...(c.href ? { as: 'a', href: c.href, target: '_blank', rel: 'noreferrer' } : {})}
            className="cert"
            delay={i * 0.05}
          >
            <div>
              <h4>{c.name}</h4>
              <p>{c.issuer}</p>
            </div>
            {c.href ? <FiExternalLink color="var(--muted)" /> : <FiAward color="var(--accent)" />}
          </Card>
        ))}
      </div>
    </Section>
  )
}

/* ---------------- Interests ---------------- */
export function Interests() {
  return (
    <Section id="interests" label="Off the clock" title={<>Watching & <em>listening</em></>}>
      <div className="posters">
        {interests.watching.map((t, i) => (
          <Reveal key={t} delay={i * 0.05} y={30}>
            <div
              className="poster"
              style={{ background: `linear-gradient(160deg, hsl(${(i * 57 + 220) % 360} 70% 55%), hsl(${(i * 57 + 280) % 360} 70% 30%))` }}
            >
              <span>{t}</span>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal className="music">
        <div className="eq"><i /><i /><i /><i /></div>
        <FiMusic color="var(--muted)" />
        <span style={{ color: 'var(--muted)', fontSize: 14 }}>On repeat: {interests.music.join(' · ')}</span>
      </Reveal>
    </Section>
  )
}

/* ---------------- Highlights ---------------- */
export function Highlights() {
  return (
    <Section id="highlights" label="Highlights" title={<>Moments worth <em>sharing</em></>}>
      <div className="grid-3">
        {highlights.map((h, i) => (
          <Card key={h.title} as="a" href={h.href} target="_blank" rel="noreferrer" className="highlight" delay={i * 0.08}>
            <div className="hl-img">
              <div style={{ background: `conic-gradient(from ${i * 90}deg at 30% 40%, hsl(${h.hue} 80% 60%), hsl(${(h.hue + 80) % 360} 80% 45%), hsl(${h.hue} 80% 60%))` }} />
            </div>
            <p>{h.title}</p>
          </Card>
        ))}
      </div>
    </Section>
  )
}

/* ---------------- Guestbook ---------------- */
// Entries are stored in this visitor's browser only. Swap for a backend (Supabase, Firebase, etc.) to make it shared.
const seedEntries = []

function loadEntries() {
  try {
    const saved = JSON.parse(localStorage.getItem('guestbook'))
    return Array.isArray(saved) ? saved : seedEntries
  } catch { return seedEntries }
}

function timeAgo(t) {
  const s = Math.floor((Date.now() - t) / 1000)
  if (s < 60) return 'just now'
  const units = [[86400, 'd'], [3600, 'h'], [60, 'm']]
  for (const [sec, u] of units) if (s >= sec) return `${Math.floor(s / sec)}${u} ago`
}

export function Guestbook() {
  const [entries, setEntries] = useState(loadEntries)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    const next = [{ name: name.trim(), message: message.trim(), at: Date.now() }, ...entries].slice(0, 20)
    setEntries(next)
    try { localStorage.setItem('guestbook', JSON.stringify(next)) } catch {}
    setMessage('')
  }

  return (
    <Section id="guestbook" label="Guestbook" title={<>Leave a <em>note</em></>}>
      <Card>
        <form className="gb-form" onSubmit={submit}>
          <input className="input" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} style={{ flex: '0 1 160px' }} />
          <input className="input" placeholder="Say something nice…" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={200} />
          <button className="btn btn-primary" type="submit"><FiSend size={14} /> Sign</button>
        </form>
        {entries.length === 0 && <p style={{ color: 'var(--faint)', fontSize: 14 }}>Be the first to sign the guestbook ✍️</p>}
        <AnimatePresence initial={false}>
          {entries.map((en) => (
            <motion.div
              key={en.at + en.name}
              className="gb-entry"
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease }}
            >
              <div className="gb-avatar" style={{ background: `hsl(${[...en.name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360} 60% 50%)` }}>
                {en.name[0].toUpperCase()}
              </div>
              <div>
                <div className="who">{en.name}<time>{timeAgo(en.at)}</time></div>
                <p>{en.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </Card>
    </Section>
  )
}

/* ---------------- Quote + footer ---------------- */
export function Quote() {
  return (
    <Reveal className="quote">
      <blockquote>“{quote.text}”</blockquote>
      <cite>— {quote.author}</cite>
    </Reveal>
  )
}

export function Footer() {
  return (
    <footer>
      <span>© {new Date().getFullYear()} {profile.name}. Built with React & Framer Motion.</span>
      <span style={{ display: 'flex', gap: 16 }}>
        <a href="#guestbook">Sign the guestbook</a>
        {profile.github
          ? <a href={`https://github.com/${profile.github}`} target="_blank" rel="noreferrer">GitHub</a>
          : <a href={`mailto:${profile.email}`}>Email</a>}
      </span>
    </footer>
  )
}
