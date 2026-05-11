import type { Essay, EssayPlay } from '../../types/essay'

const modules = import.meta.glob<{ default: Essay }>('./*.json', { eager: true })

export const essays: Essay[] = Object.values(modules).map((m) => m.default)

export function getEssayById(id: string): Essay | undefined {
  return essays.find((e) => e.id === id)
}

export function getEssaysByAct(play: EssayPlay, actScene: string): Essay[] {
  return essays.filter(
    (e) => e.play === play && e.related_acts.includes(actScene),
  )
}

export function getEssaysByTheme(play: EssayPlay, theme: string): Essay[] {
  return essays.filter(
    (e) =>
      e.play === play &&
      (e.primary_theme === theme || e.secondary_themes.includes(theme)),
  )
}

export function getEssaysByPlay(play: EssayPlay): Essay[] {
  return essays.filter((e) => e.play === play)
}

export function getCharacterStudies(play: EssayPlay): Essay[] {
  return essays.filter(
    (e) => e.play === play && e.category === 'character_study',
  )
}
