'use client'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [theme, setTheme] = useState('dark')
  useEffect(() => {
    const system = window.matchMedia('(prefers-color-scheme: light)')
    const apply = () => setTheme(document.documentElement.dataset.theme || (system.matches ? 'light' : 'dark'))
    apply()
    const update = () => {
      let saved = null
      try { saved = localStorage.getItem('satria-theme') } catch { /* Optional storage. */ }
      if (!saved) { document.documentElement.dataset.theme = system.matches ? 'light' : 'dark'; apply() }
    }
    system.addEventListener('change', update)
    return () => system.removeEventListener('change', update)
  }, [])
  return <button type="button" className="icon-button" aria-label={theme === 'light' ? 'Aktifkan tema gelap' : 'Aktifkan tema terang'}
    onClick={() => {
      const next = theme === 'light' ? 'dark' : 'light'
      setTheme(next); document.documentElement.dataset.theme = next
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'light' ? '#f4f5ef' : '#080908')
      try { localStorage.setItem('satria-theme', next) } catch { /* Works without persistence. */ }
    }}><span aria-hidden="true">{theme === 'light' ? '☾' : '☼'}</span></button>
}
