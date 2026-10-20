import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiHash, FiSun, FiMoon, FiCopy, FiCalendar } from 'react-icons/fi'
import { profile, socials } from '../data'
import { icons } from './ui'

export const navSections = [
  { id: 'home', label: 'Home' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'hackathons', label: 'Hackathons' },
  { id: 'github', label: 'GitHub Activity' },
  { id: 'dsa', label: 'DSA' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'interests', label: 'Interests' },
  { id: 'highlights', label: 'Highlights' },
  { id: 'guestbook', label: 'Guestbook' },
]

export default function CommandPalette({ open, setOpen, theme, toggleTheme }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)

  const commands = useMemo(() => [
    ...navSections.filter((s) => document.getElementById(s.id)).map((s) => ({
      group: 'Navigate', label: s.label, icon: FiHash,
      run: () => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' }),
    })),
    {
      group: 'Actions', label: `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`, icon: theme === 'dark' ? FiSun : FiMoon,
      hint: 'T', run: toggleTheme,
    },
    { group: 'Actions', label: 'Copy email', icon: FiCopy, run: () => navigator.clipboard?.writeText(profile.email) },
    ...(profile.calLink ? [{ group: 'Actions', label: 'Book an intro call', icon: FiCalendar, run: () => window.open(profile.calLink, '_blank') }] : []),
    ...socials.map((s) => ({ group: 'Links', label: s.label, icon: icons[s.icon], run: () => window.open(s.href, '_blank') })),
  ], [theme, toggleTheme, open])

  const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    if (open) { setQuery(''); setActive(0); setTimeout(() => inputRef.current?.focus(), 10) }
  }, [open])
  useEffect(() => setActive(0), [query])

  const run = (c) => { setOpen(false); setTimeout(c.run, 120) }

  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
    if (e.key === 'Enter' && filtered[active]) run(filtered[active])
    if (e.key === 'Escape') setOpen(false)
  }

  let lastGroup = null
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="cmdk-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
          <motion.div
            className="cmdk"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cmdk-input">
              <FiSearch />
              <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={onKey} placeholder="Type a command or search…" />
              <kbd>esc</kbd>
            </div>
            <div className="cmdk-list">
              {filtered.length === 0 && <div className="cmdk-empty">No results found.</div>}
              {filtered.map((c, i) => {
                const header = c.group !== lastGroup ? <div className="cmdk-group">{c.group}</div> : null
                lastGroup = c.group
                const Icon = c.icon
                return (
                  <div key={c.group + c.label}>
                    {header}
                    <button className={`cmdk-item ${i === active ? 'active' : ''}`} onMouseEnter={() => setActive(i)} onClick={() => run(c)}>
                      <Icon size={15} /> {c.label}
                      {c.hint && <kbd className="hint">{c.hint}</kbd>}
                    </button>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
