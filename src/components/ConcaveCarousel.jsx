import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const mod = (n, m) => ((n % m) + m) % m

/**
 * Cards hung on a wall that curves toward the viewer.
 * Drag / flick with momentum, snaps a card to centre, drifts when idle,
 * pauses on hover. Click the centre card to open it, a side card to turn to it.
 * Per-frame transforms are written straight to the DOM (no React re-render per frame).
 */
export default function ConcaveCarousel({
  items,
  renderItem, // (item, index, isCenter) => node
  getHref, // item => url | ''
  renderCaption, // (item, index) => node
  curvature = 0.72, // 0 = flat strip … 1 = tight drum
  distance = 4, // viewer distance, in card heights
  gap = 22,
  dim = 0.4, // fade toward the edges
  speed = 0.1, // drift, cards per second (negative reverses)
  resumeAfter = 3500, // ms of no input before drifting again
  ariaLabel = 'Carousel',
}) {
  const count = items.length
  // Repeat items so the ring always has enough cards to look continuous
  const N = count * Math.max(1, Math.ceil(9 / count))

  const rootRef = useRef(null)
  const viewRef = useRef(null)
  const panels = useRef([])
  const st = useRef({
    pos: 0, vel: 0, target: 0, mode: 'settle', dragging: false, captured: false,
    lastX: 0, lastT: 0, moved: 0, hover: false, lastInput: 0, w: 400, h: 460, visible: true, wheelT: 0,
  })
  const [center, setCenter] = useState(0) // ring index of the centred card
  const [size, setSize] = useState({ w: 400, h: 460 })

  const alpha = 0.12 + 0.36 * curvature // angle between neighbouring cards (rad)

  // ---- layout: card size follows the container width ----
  useLayoutEffect(() => {
    const el = rootRef.current
    const measure = () => {
      const cw = el.clientWidth
      const w = Math.round(Math.min(400, Math.max(250, cw * 0.74)))
      const h = Math.round(w < 340 ? 480 : w * 1.12)
      st.current.w = w
      st.current.h = h
      setSize({ w, h })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const paint = useCallback(() => {
    const s = st.current
    const R = (s.w + gap) / alpha
    for (let k = 0; k < N; k++) {
      const el = panels.current[k]
      if (!el) continue
      let o = mod(k - s.pos, N)
      if (o > N / 2) o -= N
      const ao = Math.abs(o)
      if (ao > 2.8) { el.style.visibility = 'hidden'; el.style.opacity = '0'; continue }
      const a = o * alpha
      el.style.visibility = 'visible'
      el.style.transform = `translate3d(${R * Math.sin(a)}px,0,${R * (1 - Math.cos(a))}px) rotateY(${-a}rad)`
      el.style.opacity = String(Math.max(0, 1 - (dim * Math.min(ao, 2)) / 2 - Math.max(0, ao - 2) * 1.3))
    }
  }, [N, alpha, dim, gap])

  // ---- animation loop ----
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const s = st.current
    s.lastInput = performance.now()
    let raf = 0
    let running = false
    let prev = performance.now()
    let lastCenter = -1
    let lastPainted = NaN
    const tick = (now) => {
      const dt = Math.min(0.05, (now - prev) / 1000)
      prev = now
      {
        if (!s.dragging && s.mode !== 'wheel') {
          if (s.mode === 'inertia') {
            s.pos += s.vel * dt
            s.vel *= Math.exp(-dt * 3.2)
            if (Math.abs(s.vel) < 0.7) { s.vel = 0; s.target = Math.round(s.pos); s.mode = 'settle' }
          } else if (s.mode === 'settle') {
            const d = s.target - s.pos
            s.pos += d * (1 - Math.exp(-dt * 9))
            if (Math.abs(d) < 0.0005) {
              s.pos = s.target
              if (!reduced && !s.hover && speed && now - s.lastInput > resumeAfter) s.mode = 'drift'
            }
          } else if (s.mode === 'drift') {
            if (s.hover) {
              // stop on the next card in the direction of travel, so it's readable
              s.target = speed > 0 ? Math.ceil(s.pos) : Math.floor(s.pos)
              s.mode = 'settle'
            } else s.pos += speed * dt
          }
        } else if (s.mode === 'wheel' && now - s.wheelT > 140) {
          s.target = Math.round(s.pos); s.mode = 'settle'
        }
        // Only touch the DOM when the wall actually moved
        if (s.pos !== lastPainted) { paint(); lastPainted = s.pos }
        const c = mod(Math.round(s.pos), N)
        if (c !== lastCenter) { lastCenter = c; setCenter(c) }
      }
      if (s.visible) raf = requestAnimationFrame(tick)
      else running = false
    }
    // Run the loop only while the carousel is near the viewport
    const start = () => {
      if (running || !s.visible) return
      running = true
      prev = performance.now()
      raf = requestAnimationFrame(tick)
    }
    start()

    const io = new IntersectionObserver(([e]) => { s.visible = e.isIntersecting; start() }, { rootMargin: '200px' })
    io.observe(rootRef.current)
    return () => { cancelAnimationFrame(raf); running = false; io.disconnect() }
  }, [N, paint, speed, resumeAfter])

  useEffect(() => { paint() }, [size, paint])

  // ---- input ----
  const go = useCallback((delta) => {
    const s = st.current
    const base = s.mode === 'settle' ? s.target : Math.round(s.pos)
    s.target = base + delta
    s.vel = 0
    s.mode = 'settle'
    s.lastInput = performance.now()
  }, [])

  const open = useCallback((ringIdx) => {
    const href = getHref?.(items[ringIdx % count])
    if (href) window.open(href, '_blank', 'noopener,noreferrer')
  }, [getHref, items, count])

  const onPointerDown = (e) => {
    if (e.button !== 0) return
    const s = st.current
    Object.assign(s, { dragging: true, captured: false, lastX: e.clientX, lastT: performance.now(), vel: 0, moved: 0, lastInput: performance.now() })
  }
  const onPointerMove = (e) => {
    const s = st.current
    if (!s.dragging) return
    const now = performance.now()
    const dx = e.clientX - s.lastX
    s.moved += Math.abs(dx)
    if (s.moved > 6 && !s.captured) { viewRef.current.setPointerCapture(e.pointerId); s.captured = true }
    const d = -dx / (s.w + gap)
    s.pos += d
    const dt = Math.max(1, now - s.lastT) / 1000
    s.vel = s.vel * 0.6 + (d / dt) * 0.4
    s.lastX = e.clientX
    s.lastT = now
  }
  const onPointerUp = () => {
    const s = st.current
    if (!s.dragging) return
    s.dragging = false
    s.lastInput = performance.now()
    if (performance.now() - s.lastT > 80) s.vel = 0 // held still before releasing
    s.vel = Math.max(-12, Math.min(12, s.vel))
    if (Math.abs(s.vel) > 0.7) s.mode = 'inertia'
    else { s.vel = 0; s.target = Math.round(s.pos); s.mode = 'settle' }
  }

  // Sideways trackpad swipes turn the wall; vertical wheel keeps scrolling the page
  useEffect(() => {
    const el = viewRef.current
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 2) return
      e.preventDefault()
      const s = st.current
      s.pos += e.deltaX / (s.w + gap)
      s.mode = 'wheel'
      s.wheelT = s.lastInput = performance.now()
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [gap])

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
    else if (e.key === 'Enter' && e.target === rootRef.current) open(center)
  }

  const onPanelClick = (k) => {
    const s = st.current
    if (s.moved > 6) return // it was a drag
    if (k === center) { open(k); return }
    let o = mod(k - s.pos, N)
    if (o > N / 2) o -= N
    go(Math.round(s.pos + o) - (s.mode === 'settle' ? s.target : Math.round(s.pos)))
  }

  const item = center % count
  return (
    <div
      ref={rootRef}
      className="cc"
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      style={{ '--cw': `${size.w}px`, '--ch': `${size.h}px`, '--persp': `${distance * size.h}px` }}
    >
      <div
        ref={viewRef}
        className="cc-view"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerEnter={(e) => { if (e.pointerType === 'mouse') st.current.hover = true }}
        onPointerLeave={() => { st.current.hover = false; st.current.lastInput = performance.now() }}
      >
        <div className="cc-floor" aria-hidden />
        <div className="cc-stage">
          {Array.from({ length: N }, (_, k) => (
            <div
              key={k}
              ref={(el) => { panels.current[k] = el }}
              className={`cc-panel${k === center ? ' is-center' : ''}`}
              onClick={() => onPanelClick(k)}
              aria-hidden={k !== center}
            >
              {renderItem(items[k % count], k % count, k === center)}
            </div>
          ))}
        </div>
        <div className="cc-fade" aria-hidden />
      </div>

      <div className="cc-bar">
        <button className="cc-btn" onClick={() => go(-1)} aria-label="Previous"><FiChevronLeft /></button>
        <div className="cc-caption" aria-live="polite">{renderCaption?.(items[item], item)}</div>
        <span className="cc-count">{String(item + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
        <button className="cc-btn" onClick={() => go(1)} aria-label="Next"><FiChevronRight /></button>
      </div>
    </div>
  )
}
