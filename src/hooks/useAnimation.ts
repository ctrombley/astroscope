import { useState, useCallback, useRef, useEffect } from 'react'
import type { AnimationState } from '../types'

export function useAnimation(initialDate?: Date): AnimationState {
  const [date, setDate] = useState(initialDate ?? new Date())
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1) // days per second
  const lastFrameRef = useRef<number>(0)
  const rafRef = useRef<number>(0)

  const step = useCallback((days: number) => {
    setDate(prev => {
      const next = new Date(prev.getTime() + days * 86400000)
      return next
    })
  }, [])

  const play = useCallback(() => setPlaying(true), [])
  const pause = useCallback(() => setPlaying(false), [])
  const toggle = useCallback(() => setPlaying(p => !p), [])

  useEffect(() => {
    if (!playing) {
      lastFrameRef.current = 0
      return
    }

    const tick = (timestamp: number) => {
      if (lastFrameRef.current > 0) {
        const elapsed = (timestamp - lastFrameRef.current) / 1000 // seconds
        const daysToAdd = elapsed * speed
        step(daysToAdd)
      }
      lastFrameRef.current = timestamp
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [playing, speed, step])

  return { date, playing, speed, step, play, pause, toggle, setSpeed, setDate }
}
