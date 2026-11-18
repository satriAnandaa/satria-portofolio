'use client'

import { useEffect, useRef } from 'react'
import { motionIsPaused, watchMotion } from './motion'

export function PointerEffects() {
  const ring = useRef<HTMLSpanElement>(null)
  const dot = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    let frame = 0
    let x = 0,
      y = 0,
      ringX = 0,
      ringY = 0
    let entered = false
    let button: HTMLElement | null = null
    const hero = document.querySelector<HTMLElement>('.hero')
    const resetButton = () => {
      button?.style.removeProperty('--magnetic-x')
      button?.style.removeProperty('--magnetic-y')
      button = null
    }
    const hide = () => {
      if (ring.current) ring.current.dataset.visible = 'false'
      if (dot.current) dot.current.dataset.visible = 'false'
      resetButton()
      entered = false
      cancelAnimationFrame(frame)
      frame = 0
    }
    const animate = () => {
      ringX += (x - ringX) * 0.2
      ringY += (y - ringY) * 0.2
      ring.current?.style.setProperty(
        'transform',
        'translate3d(' + ringX + 'px,' + ringY + 'px,0) translate(-50%,-50%)',
      )
      frame =
        Math.abs(x - ringX) + Math.abs(y - ringY) > 0.1
          ? requestAnimationFrame(animate)
          : 0
    }
    const move = (event: PointerEvent) => {
      if (!fine.matches || motionIsPaused() || event.pointerType !== 'mouse') {
        hide()
        return
      }
      const target = event.target
      if (!(target instanceof Element) || target.closest('iframe')) {
        hide()
        return
      }
      x = event.clientX
      y = event.clientY
      if (!entered) {
        ringX = x
        ringY = y
        entered = true
      }
      ring.current?.setAttribute('data-visible', 'true')
      dot.current?.setAttribute('data-visible', 'true')
      ring.current?.setAttribute(
        'data-hover',
        String(
          Boolean(target.closest('a,button,summary,input,textarea,select')),
        ),
      )
      dot.current?.style.setProperty(
        'transform',
        'translate3d(' + x + 'px,' + y + 'px,0) translate(-50%,-50%)',
      )
      if (!frame) frame = requestAnimationFrame(animate)
      const nextButton = target.closest<HTMLElement>('.button')
      if (button !== nextButton) {
        resetButton()
        button = nextButton
      }
      if (button) {
        const rect = button.getBoundingClientRect()
        button.style.setProperty('--hover-x', x - rect.left + 'px')
        button.style.setProperty('--hover-y', y - rect.top + 'px')
        button.style.setProperty(
          '--magnetic-x',
          (x - rect.left - rect.width / 2) * 0.07 + 'px',
        )
        button.style.setProperty(
          '--magnetic-y',
          (y - rect.top - rect.height / 2) * 0.07 + 'px',
        )
      }
      if (hero && target.closest('.hero')) {
        hero.style.setProperty(
          '--hero-x',
          (x / window.innerWidth - 0.5) * 14 + 'px',
        )
        hero.style.setProperty(
          '--hero-y',
          (y / window.innerHeight - 0.5) * 10 + 'px',
        )
      }
    }
    const leave = (event: PointerEvent) => {
      if (
        !event.relatedTarget ||
        (event.relatedTarget instanceof Element &&
          event.relatedTarget.closest('iframe'))
      )
        hide()
    }
    const disable = () => {
      hide()
      hero?.style.removeProperty('--hero-x')
      hero?.style.removeProperty('--hero-y')
    }
    document.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', move, { passive: true })
    document.addEventListener('pointerout', leave)
    window.addEventListener('blur', hide)
    fine.addEventListener('change', disable)
    const unwatch = watchMotion(disable)
    return () => {
      disable()
      unwatch()
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', move)
      document.removeEventListener('pointerout', leave)
      window.removeEventListener('blur', hide)
      fine.removeEventListener('change', disable)
    }
  }, [])
  return (
    <div className="pointer-effects" aria-hidden="true">
      <span className="cursor-ring" ref={ring} />
      <span className="cursor-dot" ref={dot} />
    </div>
  )
}
