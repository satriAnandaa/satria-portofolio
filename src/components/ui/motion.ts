export const motionEvent = 'portfolio-motion-change'

export function motionIsPaused() {
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.documentElement.dataset.motion === 'paused'
  )
}

export function watchMotion(callback: () => void) {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
  preference.addEventListener('change', callback)
  window.addEventListener(motionEvent, callback)
  return () => {
    preference.removeEventListener('change', callback)
    window.removeEventListener(motionEvent, callback)
  }
}
