import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowUpRight, FiArrowRight, FiCopy, FiCheck, FiSend, FiLinkedin, FiGithub, FiFileText, FiDownload, FiChevronDown } from 'react-icons/fi'
import {
  profile, socials, experiences, projects, hackathons, dsa, skills, education, certifications, interests, highlights, quote,
} from '../data'
import ConcaveCarousel from './ConcaveCarousel'
import { SectionHead, Reveal, Chips, Magnetic, SplitText, icons } from './ui'

const easeOut = [0.22, 1, 0.36, 1]

/* ---------------- Experience: boarding-pass tickets ---------------- */
export function Experience({ n }) {
  return (
    <section id="experience">
      <div className="wrap">
        <SectionHead n={n} label="experience" title={[{ t: "where i've " }, { t: 'worked.', className: 'dbl' }]} note="From AI research at Samsung PRISM to agentic AI at Infosys." />
        {experiences.map((exp, i) => (
          <motion.div
            key={`${exp.company}-${exp.period}`}
            className="ticket"
            initial={{ opacity: 0, y: 60, rotate: -1.5 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1, delay: i * 0.1, ease: easeOut }}
          >
            <div className="t-main">
              <div className="t-head"><span>ticket · exp-{String(i + 1).padStart(2, '0')}</span><span>● {exp.mode}</span></div>
              <h3 className="t-company">{exp.company}</h3>
              <p className="t-role">{exp.role}</p>
              <div className="fields">
                <div className="field"><small>period</small><span>{exp.period}</span></div>
                <div className="field"><small>mode</small><span>{exp.mode}</span></div>
                <div className="field"><small>role</small><span>{exp.role.split('·')[0].trim()}</span></div>
              </div>
              <ul className="bullets">{exp.points.map((p) => <li key={p}>{p}</li>)}</ul>
              {exp.project && (
                <Reveal className="t-project" y={20}>
                  <div className="t-project-head">
                    <span className="eyebrow"><b>✺</b> {exp.project.context}</span>
                  </div>
                  <h4>{exp.project.title}</h4>
                  <ul className="bullets">{exp.project.points.map((p) => <li key={p}>{p}</li>)}</ul>
                  <Chips items={exp.project.tags} />
                </Reveal>
              )}
              <Chips items={exp.tags} />
              {exp.link && (
                <a className="proj-link" href={exp.link} target="_blank" rel="noreferrer">
                  <FiLinkedin /> Read the post <FiArrowUpRight />
                </a>
              )}
            </div>
            <div className="t-stub">
              {exp.stats.map((s) => (
                <div key={s.label} className="stub-stat"><strong>{s.value}</strong><span>{s.label}</span></div>
              ))}
              <div className="stub-id">{exp.company.toUpperCase()}-{String(i + 1).padStart(3, '0')}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ---------------- Projects: concave carousel ---------------- */
function ProjectPanel({ p, i, total }) {
  const stop = (e) => e.stopPropagation()
  return (
    <article className="cc-card" style={{ '--hue': p.hue }}>
      <div className="cc-art">
        <div className="cc-art-top">
          <span>project {String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
          <span className={`status${p.ongoing ? ' ongoing' : ''}`}>{p.status}</span>
        </div>
        <span className="cc-num" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
        <div className="cc-cmd"><span>$</span> init {p.title.split(' ')[0].toLowerCase()}<i className="caret" /></div>
      </div>
      <div className="cc-body">
        <h3>{p.title}</h3>
        <p>{p.description}</p>
        <Chips items={p.tags.slice(0, 4)} />
        {(p.href || p.live) && (
          <div className="proj-links">
            {p.href && <a className="proj-link" href={p.href} target="_blank" rel="noreferrer" onClick={stop}><FiGithub /> GitHub <FiArrowUpRight /></a>}
            {p.live && <a className="proj-link" href={p.live} target="_blank" rel="noreferrer" onClick={stop}>Live app <FiArrowUpRight /></a>}
          </div>
        )}
      </div>
    </article>
  )
}

export function Projects({ n }) {
  return (
    <section id="projects">
      <div className="wrap">
        <SectionHead n={n} label="selected work" title={[{ t: "things i've " }, { t: 'built.', className: 'dbl' }]} note="Android, web and cross-platform apps, a Chrome extension and computer-vision experiments. Drag the wall to explore." />
      </div>
      <Reveal>
        <ConcaveCarousel
          items={projects}
          ariaLabel="Projects. Use the arrow keys to turn, Enter to open."
          getHref={(p) => p.href || p.live}
          renderItem={(p, i) => <ProjectPanel p={p} i={i} total={projects.length} />}
          renderCaption={(p) => (
            <>
              <strong>{p.title}</strong>
              <span>{p.href || p.live ? 'tap the centre card to open' : p.tags.slice(0, 3).join(' · ')}</span>
            </>
          )}
        />
      </Reveal>
    </section>
  )
}

/* ---------------- Skills: numbered feature list ---------------- */
export function Skills({ n }) {
  return (
    <section id="skills">
      <div className="wrap">
        <SectionHead n={n} label="toolbox" title={[{ t: 'what i ' }, { t: 'work with.', className: 'dbl' }]} />
        <div className="skill-list">
          {Object.entries(skills).map(([group, items], i) => (
            <Reveal key={group} className="skill-row" delay={i * 0.06} y={20}>
              <span className="num">({String(i + 1).padStart(2, '0')})</span>
              <h4>{group}</h4>
              <Chips items={items} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Education: receipts ---------------- */
function Receipt({ children, delay }) {
  return (
    <motion.div
      className="receipt"
      initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
      whileInView={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.4, delay, ease: [0.6, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ---------------- Résumé: framed PDF viewer + open / download ---------------- */
export function Resume({ n }) {
  const [open, setOpen] = useState(false)
  const file = profile.resume
  const name = `${profile.name.replace(/\s+/g, '_')}_Resume.pdf`
  return (
    <section id="resume">
      <div className="wrap">
        <SectionHead n={n} label="résumé" title={[{ t: 'the one-page ' }, { t: 'version.', className: 'dbl' }]} note="Everything above, on a single page. Tap to read it here, or download it." />
        <Reveal>
          <div className={`resume${open ? ' open' : ''}`}>
            <div className="resume-card">
              <div className="resume-icon"><FiFileText size={26} /></div>
              <div className="resume-info">
                <strong>{profile.name}</strong>
                <span>{name}</span>
              </div>
              <div className="resume-actions">
                <button className="btn btn-fire btn-sm" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="resume-viewer">
                  {open ? 'Hide résumé' : 'View résumé'} <FiChevronDown className={`chev${open ? ' up' : ''}`} />
                </button>
                <a className="icon-btn" href={file} download={name} aria-label="Download résumé" title="Download">
                  <FiDownload size={14} />
                </a>
              </div>
            </div>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id="resume-viewer"
                  className="resume-panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.55, ease: easeOut }}
                >
                  <div className="term-top resume-bar">
                    <i /><i /><i />
                    <span>{name}</span>
                    <a className="resume-newtab" href={file} target="_blank" rel="noreferrer">open in new tab <FiArrowUpRight /></a>
                  </div>
                  <object className="resume-view" data={`${file}#view=FitH&toolbar=0&navpanes=0`} type="application/pdf" aria-label="Résumé PDF">
                    {/* Shown where the browser can't display PDFs inline (most phones) */}
                    <div className="resume-fallback">
                      <p>Your browser can't show the PDF here.</p>
                      <div className="hero-ctas">
                        <a className="btn btn-fire" href={file} target="_blank" rel="noreferrer">Open résumé <FiArrowUpRight className="arrow" /></a>
                        <a className="btn btn-ghost" href={file} download={name}><span>Download</span> ↓</a>
                      </div>
                    </div>
                  </object>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function Education({ n }) {
  return (
    <section id="education">
      <div className="wrap">
        <SectionHead n={n} label="education" title={[{ t: 'always ' }, { t: 'learning.', className: 'dbl' }]} note="Every course, itemised." />
        <div className="receipts">
          <Receipt delay={0}>
            <div className="rc-head">
              <strong>srm ist</strong>
              <small>kattankulathur · {education.period}</small>
            </div>
            <div className="rc-row name"><span>{education.degree.split('·').slice(0, 2).join('·')}</span></div>
            {education.coursework.map((c) => (
              <div key={c} className="rc-row"><span>{c}</span><span className="lead" /><span className="v">✓</span></div>
            ))}
            <div className="rc-total"><span>CGPA</span><strong>8.65<small style={{ fontSize: 14, color: 'var(--muted)' }}>/10</small></strong></div>
            <div className="rc-foot">thank you for reading</div>
          </Receipt>

          <Receipt delay={0.25}>
            <div className="rc-head">
              <strong>certifications</strong>
              <small>{certifications.length} items</small>
            </div>
            {certifications.map((c) => {
              const [issuer, date] = c.issuer.split('·').map((s) => s.trim())
              return (
                <div key={c.name}>
                  <div className="rc-row name">
                    <span>{c.name}</span><span className="lead" />
                    {c.href
                      ? <a className="v" href={c.href} target="_blank" rel="noreferrer">verify ↗</a>
                      : <span className="v">✓</span>}
                  </div>
                  <div className="rc-sub">{issuer}{date ? ` · ${date}` : ''}</div>
                </div>
              )
            })}
            <div className="rc-total"><span>total</span><strong>{String(certifications.length).padStart(2, '0')}</strong></div>
            <div className="rc-foot">* * * keep shipping * * *</div>
          </Receipt>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Optional sections (shown only when data exists) ---------------- */
export function Hackathons({ n }) {
  return (
    <section id="hackathons">
      <div className="wrap">
        <SectionHead n={n} label="hackathons" title={[{ t: 'built under ' }, { t: 'pressure.', className: 'dbl' }]} />
        <div className="cards">
          {hackathons.map((h, i) => (
            <Reveal key={h.name} className="ncard" delay={i * 0.08}>
              <div className="proj-meta"><span>{String(i + 1).padStart(2, '0')}</span><span className="status">{h.place}</span></div>
              <h4>{h.name}</h4>
              <ul className="bullets" style={{ marginTop: 14 }}>{h.points.map((p) => <li key={p}>{p}</li>)}</ul>
              <Chips items={h.tags} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function DSA({ n }) {
  return (
    <section id="dsa">
      <div className="wrap">
        <SectionHead n={n} label="competitive programming" title={[{ t: 'solving ' }, { t: 'problems.', className: 'dbl' }]} />
        <div className="cards">
          {dsa.map((d, i) => {
            const Icon = icons[d.platform.toLowerCase()]
            return (
              <Reveal key={d.platform} delay={i * 0.08}>
                <a className="ncard" style={{ display: 'block' }} href={d.href} target="_blank" rel="noreferrer">
                  <div className="proj-meta"><span>{Icon && <Icon />} {d.platform}</span><span>{d.badge}</span></div>
                  <div className="big">{d.rating}</div>
                  <p>max rating · {d.solved} solved</p>
                </a>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function level(c) { return c === 0 ? 0 : c < 3 ? 1 : c < 6 ? 2 : c < 10 ? 3 : 4 }
const heatColor = (l) => (l === 0 ? 'var(--heat-0)' : `color-mix(in srgb, var(--ember) ${[0, 30, 55, 80, 100][l]}%, transparent)`)

export function GitHubActivity({ n }) {
  const [days, setDays] = useState([])
  useEffect(() => {
    if (!profile.github) return
    fetch(`https://github-contributions-api.jogruber.de/v4/${profile.github}?y=last`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setDays(d.contributions || []))
      .catch(() => {})
  }, [])
  const total = days.reduce((s, d) => s + d.count, 0)
  const pad = days.length ? new Date(days[0].date).getDay() : 0
  return (
    <section id="github">
      <div className="wrap">
        <SectionHead n={n} label="github activity" title={[{ t: 'shipping ' }, { t: 'daily.', className: 'dbl' }]} />
        <Reveal className="ncard">
          <div className="heat-wrap">
            <div className="heatmap">
              {Array.from({ length: pad }).map((_, i) => <span key={`p${i}`} />)}
              {days.map((d) => <span key={d.date} className="heat" title={`${d.count} on ${d.date}`} style={{ background: heatColor(level(d.count)) }} />)}
            </div>
          </div>
          <div className="heat-legend">
            <span>{days.length ? `${total} contributions in the last year` : 'loading…'}</span>
            <span className="scale">less {[0, 1, 2, 3, 4].map((l) => <span key={l} className="heat" style={{ background: heatColor(l) }} />)} more</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function Interests({ n }) {
  return (
    <section id="interests">
      <div className="wrap">
        <SectionHead n={n} label="off the clock" title={[{ t: 'watching & ' }, { t: 'listening.', className: 'dbl' }]} />
        <Chips items={[...interests.watching, ...interests.music]} />
      </div>
    </section>
  )
}

export function Highlights({ n }) {
  return (
    <section id="highlights">
      <div className="wrap">
        <SectionHead n={n} label="highlights" title={[{ t: 'moments worth ' }, { t: 'sharing.', className: 'dbl' }]} />
        <div className="cards">
          {highlights.map((h, i) => (
            <Reveal key={h.title} delay={i * 0.08}>
              <a className="ncard" style={{ display: 'block' }} href={h.href} target="_blank" rel="noreferrer">
                <div className="proj-meta"><span>{String(i + 1).padStart(2, '0')}</span><span>↗</span></div>
                <h4>{h.title}</h4>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Guestbook: chat room ---------------- */
// Entries are stored in this visitor's browser only. Swap for a backend (Supabase, Firebase, etc.) to make it shared.
function loadEntries() {
  try {
    const saved = JSON.parse(localStorage.getItem('guestbook'))
    return Array.isArray(saved) ? saved : []
  } catch { return [] }
}

function timeAgo(t) {
  const s = Math.floor((Date.now() - t) / 1000)
  if (s < 60) return 'just now'
  for (const [sec, u] of [[86400, 'd'], [3600, 'h'], [60, 'm']]) if (s >= sec) return `${Math.floor(s / sec)}${u} ago`
}

export function Guestbook({ n }) {
  const [entries, setEntries] = useState(loadEntries)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    const next = [...entries, { name: name.trim(), message: message.trim(), at: Date.now() }].slice(-30)
    setEntries(next)
    try { localStorage.setItem('guestbook', JSON.stringify(next)) } catch {}
    setMessage('')
  }

  return (
    <section id="guestbook">
      <div className="wrap">
        <SectionHead n={n} label="guestbook" title={[{ t: 'leave a ' }, { t: 'note.', className: 'dbl' }]} note="Say hi, drop feedback, or just leave your mark." />
        <Reveal className="chat">
          <div className="chat-top">
            <span className="room"><span className="dot-live" /> room #guestbook</span>
            <span>{entries.length} message{entries.length === 1 ? '' : 's'}</span>
          </div>
          <div className="chat-body">
            <span className="sys">room opened · be nice ✺</span>
            {entries.length === 0 && <span className="sys">no messages yet — be the first</span>}
            <AnimatePresence initial={false}>
              {entries.map((en) => (
                <motion.div
                  key={en.at + en.name}
                  className="msg"
                  initial={{ opacity: 0, y: 16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, ease: easeOut }}
                >
                  <div className="av" style={{ background: `hsl(${[...en.name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360} 55% 45%)` }}>
                    {en.name[0].toUpperCase()}
                  </div>
                  <div className="bubble">
                    <div className="who"><b>{en.name}</b>{timeAgo(en.at)}</div>
                    <p>{en.message}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <form className="chat-form" onSubmit={submit}>
            <input className="input name" placeholder="your name" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />
            <input className="input text" placeholder="type a message…" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={200} />
            <button className="btn btn-fire btn-sm" type="submit" style={{ height: 44 }}><FiSend size={14} /> send</button>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------------- Contact + footer ---------------- */
export function Contact() {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(profile.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <div className="eyebrow" style={{ justifyContent: 'center' }}><b>✺</b> what's next</div>
        <SplitText as="h2" className="big" segments={[{ t: "let's build" }, { br: true }, { t: 'something.', className: 'dbl' }]} />
        <Reveal><p>Always up for a conversation about agentic AI, apps or interesting problems. My inbox is open — I usually reply within a day.</p></Reveal>
        <Reveal className="row" delay={0.15}>
          <Magnetic>
            <a className="btn btn-fire" href={`mailto:${profile.email}`}>{profile.email} <FiArrowRight className="arrow" /></a>
          </Magnetic>
          <button className="btn btn-ghost" onClick={copy}>
            {copied ? <FiCheck color="var(--ember)" /> : <FiCopy />} <span>{copied ? 'copied!' : 'copy email'}</span>
          </button>
        </Reveal>
        <Reveal className="socials" delay={0.25}>
          {socials.map((s) => {
            const Icon = icons[s.icon]
            return (
              <a key={s.label} className="social" href={s.href} target={s.href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer">
                <Icon size={14} /> {s.label}
              </a>
            )
          })}
        </Reveal>
        <p className="quote">“{quote.text}” — <b>{quote.author}</b></p>
      </div>
    </section>
  )
}

export function Footer() {
  const first = profile.name.split(' ').pop().toLowerCase()
  return (
    <footer>
      <div className="wrap">
        <div className="foot">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>built with react + framer motion</span>
          <a href="#home">back to top ↑</a>
        </div>
        <div className="foot-word">{first}.</div>
      </div>
    </footer>
  )
}
