'use client'

import { useEffect, useState } from 'react'
import { motionEvent, motionIsPaused, watchMotion } from './motion'

export function MotionToggle() {
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const update = () => {
      setPaused(motionIsPaused())
      setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    }
    update()
    return watchMotion(update)
  }, [])
  const label = reduced
    ? 'Animasi dinonaktifkan oleh pengaturan perangkat'
    : paused
      ? 'Aktifkan animasi'
      : 'Jeda animasi'
  return (
    <>
      <noscript>
        <style>
          {
            '.motion-toggle{display:none!important}.marquee-track,.type-caret{animation:none!important}'
          }
        </style>
      </noscript>
      <button
        type="button"
        className="motion-toggle"
        aria-label={label}
        title={label}
        aria-pressed={paused}
        disabled={reduced}
        onClick={() => {
          const next = !paused
          document.documentElement.dataset.motion = next ? 'paused' : 'playing'
          try {
            localStorage.setItem('satria-motion', next ? 'paused' : 'playing')
          } catch {
            /* Optional persistence. */
          }
          window.dispatchEvent(new Event(motionEvent))
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {paused ? (
            <path d="m9 6 9 6-9 6V6Z" stroke="currentColor" strokeWidth="1.5" />
          ) : (
            <path d="M9 6v12M15 6v12" stroke="currentColor" strokeWidth="2" />
          )}
        </svg>
      </button>
    </>
  )
}
