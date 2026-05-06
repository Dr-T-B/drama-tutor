import type { PlayCode } from '../../types/essayBuilder'
import type { PlayFilter } from '../../types/database'

export function playFilterToCode(p: PlayFilter): PlayCode | null {
  if (p === 'HAM') return 'hamlet'
  if (p === 'MAL') return 'duchess_of_malfi'
  return null
}

export function playCodeLabel(p: PlayCode): string {
  return p === 'hamlet' ? 'Hamlet' : 'The Duchess of Malfi'
}

function xfnv1a(str: string): () => number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h += 0x6d2b79f5
    let t = h
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function seededShuffle<T>(items: T[], seed: string): T[] {
  const rng = xfnv1a(seed)
  const out = items.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}
