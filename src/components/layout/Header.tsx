'use client'
import { useEffect, useRef, useState } from 'react'
import { ThemeToggle } from '../ui/ThemeToggle'
import { Arrow, BrandMark } from '../ui/Design'

export function Header({
  name,
  navigation,
  extras = [],
}: {
  name: string
  navigation: { label: string; target: string }[]
  extras?: { label: string; target: string }[]
}) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const primaryLinks = navigation.slice(0, 5)
  const moreLinks = [...navigation.slice(5), ...extras]
  const root = useRef<HTMLElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        const dropdown =
          root.current?.querySelector<HTMLDetailsElement>('details[open]')
        if (dropdown) {
          dropdown.open = false
          dropdown.querySelector('summary')?.focus()
        }
        if (open) {
          setOpen(false)
          button.current?.focus()
        }
      }
    }
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) {
        setOpen(false)
        root.current?.querySelectorAll('details').forEach((item) => {
          item.open = false
        })
      }
    }
    const viewport = window.matchMedia('(min-width: 1025px)')
    const resize = () => setOpen(false)
    document.addEventListener('keydown', escape)
    document.addEventListener('pointerdown', outside)
    viewport.addEventListener('change', resize)
    return () => {
      document.removeEventListener('keydown', escape)
      document.removeEventListener('pointerdown', outside)
      viewport.removeEventListener('change', resize)
    }
  }, [open])
  useEffect(() => {
    let queued = false
    const update = () => {
      let current = ''
      let closest = -Infinity
      for (const item of navigation) {
        const top =
          document.getElementById(item.target)?.getBoundingClientRect().top ??
          Infinity
        if (top <= 160 && top > closest) {
          current = item.target
          closest = top
        }
      }
      setActive(current)
      setScrolled(window.scrollY > 24)
      queued = false
    }
    const scroll = () => {
      if (!queued) {
        queued = true
        requestAnimationFrame(update)
      }
    }
    update()
    window.addEventListener('scroll', scroll, { passive: true })
    return () => window.removeEventListener('scroll', scroll)
  }, [navigation])
  return (
    <header
      className={'site-header' + (scrolled ? ' is-scrolled' : '')}
      ref={root}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node))
          setOpen(false)
      }}
    >
      <noscript>
        <style>
          {
            '@media(max-width:1024px){.nav-menu{display:flex!important}.nav-actions{display:none!important}}'
          }
        </style>
      </noscript>
      <nav className="container site-nav" aria-label="Navigasi utama">
        <a className="brand" href="/#home" aria-label={name + ', beranda'}>
          <BrandMark />
          <span>
            {name.split(' ')[0]}
            <b>.</b>
          </span>
        </a>
        <div className="nav-actions ml-auto flex items-center gap-3 min-[1025px]:order-3 min-[1025px]:ml-0">
          <ThemeToggle />
          <a className="button button-outline nav-contact" href="/contact">
            Hire Me <Arrow />
          </a>
          <button
            className="menu-toggle"
            type="button"
            ref={button}
            aria-controls="menu"
            aria-expanded={open}
            aria-label={open ? 'Tutup navigasi' : 'Buka navigasi'}
            onClick={(event) => {
              setOpen(!open)
              if (!open && event.detail === 0)
                requestAnimationFrame(() =>
                  menu.current?.querySelector('a')?.focus(),
                )
            }}
          >
            <span className="menu-label">{open ? 'Tutup' : 'Menu'}</span>
            <span className="menu-bars" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
        <div
          className={'nav-menu ' + (open ? 'is-open' : '')}
          id="menu"
          ref={menu}
        >
          <a className="nav-link" href="/#home" onClick={() => setOpen(false)}>
            Beranda
          </a>
          {primaryLinks.map((item) => (
            <a
              key={item.target}
              className="nav-link"
              href={'/#' + item.target}
              aria-current={active === item.target ? 'location' : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          {moreLinks.length > 0 && (
            <details
              className="nav-dropdown"
              onMouseEnter={(event) => {
                if (
                  window.matchMedia('(hover: hover) and (pointer: fine)')
                    .matches
                )
                  event.currentTarget.open = true
              }}
              onMouseLeave={(event) => {
                if (!event.currentTarget.contains(document.activeElement))
                  event.currentTarget.open = false
              }}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node))
                  event.currentTarget.open = false
              }}
            >
              <summary>
                Jelajahi <span aria-hidden="true">⌄</span>
              </summary>
              <div>
                {moreLinks.map((item) => (
                  <a
                    className="nav-link"
                    key={item.target}
                    href={'/#' + item.target}
                    onClick={(event) => {
                      setOpen(false)
                      event.currentTarget
                        .closest('details')
                        ?.removeAttribute('open')
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </details>
          )}
          <a className="button button-outline mobile-hire" href="/contact">
            Hire Me <Arrow />
          </a>
        </div>
      </nav>
    </header>
  )
}
