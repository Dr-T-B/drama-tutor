import { createContext, useContext, useState, type ReactNode } from 'react'
import type { PlayFilter } from '../types/database'

interface PlayContextValue {
  play: PlayFilter
  setPlay: (p: PlayFilter) => void
}

const PlayContext = createContext<PlayContextValue | null>(null)

export function PlayProvider({ children }: { children: ReactNode }) {
  const [play, setPlayState] = useState<PlayFilter>(
    () => (localStorage.getItem('drama_play') as PlayFilter) ?? 'both'
  )
  const setPlay = (p: PlayFilter) => {
    localStorage.setItem('drama_play', p)
    setPlayState(p)
  }
  return (
    <PlayContext.Provider value={{ play, setPlay }}>
      {children}
    </PlayContext.Provider>
  )
}

export function usePlay() {
  const ctx = useContext(PlayContext)
  if (!ctx) throw new Error('usePlay must be inside PlayProvider')
  return ctx
}
