'use client'

import { useEffect, useState, useRef } from 'react'
import { motionIsPaused, watchMotion } from './motion'

export function RoleTicker({ roles }: { roles: string[] }) {
  const root = useRef<HTMLParagraphElement>(null)
  const [text, setText] = useState(roles[0] || '')
  const [animated, setAnimated] = useState(false)
  useEffect(() => {
    setText(roles[0] || '')
    setAnimated(false)
    if (roles.length < 2 || !('IntersectionObserver' in window)) return
    let timer: ReturnType<typeof setTimeout> | undefined
    let index = 0
    let length = roles[0].length
    let deleting = true
    let inView = true
    const clear = () => {
      clearTimeout(timer)
      timer = undefined
    }
    const tick = () => {
      if (motionIsPaused() || document.hidden || !inView) return
      length += deleting ? -1 : 1
      setText(roles[index].slice(0, Math.max(0, length)))
      let delay = deleting ? 45 : 85
      if (length <= 0) {
        deleting = false
        index = (index + 1) % roles.length
        delay = 300
      } else if (length >= roles[index].length) {
        deleting = true
        delay = 1900
      }
      timer = setTimeout(tick, delay)
    }
    const resume = () => {
      clear()
      const enabled = !motionIsPaused()
      setAnimated(enabled)
      if (enabled && !document.hidden && inView) timer = setTimeout(tick, 1400)
    }
    const observer = new IntersectionObserver((entries) => {
      inView = entries[0].isIntersecting
      resume()
    })
    if (root.current) observer.observe(root.current)
    const unwatch = watchMotion(resume)
    document.addEventListener('visibilitychange', resume)
    resume()
    return () => {
      clear()
      unwatch()
      observer.disconnect()
      document.removeEventListener('visibilitychange', resume)
    }
  }, [roles])
  const space = text.indexOf(' ')
  return (
    <p
      ref={root}
      className={'hero-role' + (animated ? ' hero-role--animated' : '')}
      aria-hidden="true"
    >
      {animated ? (
        <span className="typed-role">
          <span className="accent-role">
            {space < 0 ? text : text.slice(0, space)}
          </span>
          {space < 0 ? '' : text.slice(space)}
          <i className="type-caret" />
        </span>
      ) : (
        roles.map((role, index) => (
          <span key={role} className={index === 0 ? 'accent-role' : ''}>
            {role}
            {index < roles.length - 1 && (
              <span className="role-divider">/</span>
            )}
          </span>
        ))
      )}
    </p>
  )
}
