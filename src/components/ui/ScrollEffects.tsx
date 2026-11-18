'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { Arrow } from './Design'
import { motionIsPaused, watchMotion } from './motion'

const revealTargets = [
  '.section-heading',
  '.focus-card',
  '.profile-story',
  '.skill-card',
  '.project-card',
  '.experience-table > li',
  '.education-grid > article',
  '.process-grid > li',
  '.service-row',
  '.award-card',
  '.pricing-card',
  '.testimonial-card',
  '.blog-card',
  '.contact-grid',
  '.contact-form-panel',
].join(',')

export function ScrollEffects() {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      const range = document.documentElement.scrollHeight - window.innerHeight
      setProgress(
        range > 0
          ? Math.min(100, Math.round((window.scrollY / range) * 100))
          : 0,
      )
      setVisible(window.scrollY > 500)
      frame = 0
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(revealTargets)
    let observer: IntersectionObserver | undefined
    const showAll = () =>
      elements.forEach((element) => {
        element.removeAttribute('data-reveal')
        element.classList.remove('scroll-reveal')
      })
    const observe = () => {
      observer?.disconnect()
      showAll()
      if (motionIsPaused() || !('IntersectionObserver' in window)) return
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.removeAttribute('data-reveal')
              observer?.unobserve(entry.target)
            }
          }
        },
        { threshold: 0, rootMargin: '0px 0px -24px 0px' },
      )
      elements.forEach((element) => {
        if (element.getBoundingClientRect().top >= window.innerHeight) {
          element.classList.add('scroll-reveal')
          element.dataset.reveal = 'waiting'
          observer?.observe(element)
        }
      })
    }
    const revealFocus = (event: FocusEvent) => {
      const element = (event.target as HTMLElement).closest('[data-reveal]')
      element?.removeAttribute('data-reveal')
      if (element) observer?.unobserve(element)
    }
    observe()
    const unwatch = watchMotion(observe)
    document.addEventListener('focusin', revealFocus)
    return () => {
      observer?.disconnect()
      showAll()
      unwatch()
      document.removeEventListener('focusin', revealFocus)
    }
  }, [])

  if (!visible) return null
  return (
    <a
      href="#home"
      className="back-to-top"
      aria-label="Kembali ke atas"
      style={{ '--scroll-progress': progress + '%' } as CSSProperties}
    >
      <Arrow />
    </a>
  )
}
