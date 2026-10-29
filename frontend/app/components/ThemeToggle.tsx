'use client'

import { useState, type CSSProperties } from 'react'
import { Moon, Sun } from 'lucide-react'

type Theme = 'light' | 'dark'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [animationEnabled, setAnimationEnabled] = useState(true)
  const [animating, setAnimating] = useState(false)
  const [pendingTheme, setPendingTheme] = useState<Theme | null>(null)
  const [waveTheme, setWaveTheme] = useState<Theme | null>(null)
  const [wavePosition, setWavePosition] = useState({ x: '50vw', y: '50vh' })

  function changeTheme(button: HTMLButtonElement) {
    if (animating) return

    const nextTheme = isDark ? 'light' : 'dark'
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!animationEnabled || reducedMotion) {
      document.documentElement.dataset.theme = nextTheme
      setIsDark(nextTheme === 'dark')
      return
    }

    const { left, top, width, height } = button.getBoundingClientRect()
    setWavePosition({
      x: `${left + width / 2}px`,
      y: `${top + height / 2}px`,
    })
    setPendingTheme(nextTheme)
    setAnimating(true)
  }

  function startWave() {
    if (pendingTheme) setWaveTheme(pendingTheme)
  }

  function finishWave() {
    if (!waveTheme) return

    document.documentElement.dataset.theme = waveTheme
    setIsDark(waveTheme === 'dark')
    setWaveTheme(null)
    setPendingTheme(null)
    setAnimating(false)
  }

  return (
    <>
      <div className="theme-controls">
        <button
          type="button"
          aria-label={`Ativar modo ${isDark ? 'claro' : 'escuro'}`}
          aria-pressed={isDark}
          disabled={animating}
          onClick={(event) => changeTheme(event.currentTarget)}
          onAnimationEnd={startWave}
          className="theme-icon-button"
          data-animating={animating}
        >
          {isDark ? <Sun aria-hidden="true" size={20} /> : <Moon aria-hidden="true" size={20} />}
        </button>
        <button
          type="button"
          aria-pressed={animationEnabled}
          disabled={animating}
          onClick={() => setAnimationEnabled((enabled) => !enabled)}
          className="theme-animation-button"
        >
          Animação {animationEnabled ? 'ligada' : 'desligada'}
        </button>
      </div>
      {waveTheme && (
        <div
          aria-hidden="true"
          className="theme-wave"
          onAnimationEnd={finishWave}
          style={{
            backgroundColor: waveTheme === 'dark' ? '#0a0a0a' : '#ffffff',
            '--wave-x': wavePosition.x,
            '--wave-y': wavePosition.y,
          } as CSSProperties & { '--wave-x': string; '--wave-y': string }}
        />
      )}
    </>
  )
}
