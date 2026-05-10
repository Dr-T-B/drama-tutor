import {
  pastPaperQuestions,
  themeQuoteBanks,
  type CriticPosition,
  type ThemeQuote,
  type Play,
} from './pastPapers'

export interface SubThemeNode {
  topic: string
  topic_sentence: string
  ao_focus: string[]
  sourceQuestionIds: string[]
}

export interface ThemeNode {
  theme: string
  questionCount: number
  subThemes: SubThemeNode[]
  quotes: ThemeQuote[]
  critics: CriticPosition[]
}

const MAX_THEMES = 12
const MIN_SUB_THEMES = 3
const MIN_RING4 = 3

function normalizeTopic(topic: string): string {
  return topic.toLowerCase().trim().replace(/\s+/g, ' ')
}

export function getThemeWheelData(play: Play): ThemeNode[] {
  const questionsForPlay = pastPaperQuestions.filter(q => q.play === play)

  // theme -> question ids that reference it
  const themeQuestions = new Map<string, string[]>()
  for (const q of questionsForPlay) {
    for (const t of q.themes) {
      const arr = themeQuestions.get(t) ?? []
      arr.push(q.id)
      themeQuestions.set(t, arr)
    }
  }

  const nodes: ThemeNode[] = []

  for (const [theme, qIds] of themeQuestions) {
    const qIdsSet = new Set(qIds)
    const matchingQuestions = questionsForPlay.filter(q => qIdsSet.has(q.id))

    // Ring 3: aggregate paragraph_plan items, dedupe by normalized topic.
    // For each duplicate cluster: merge sourceQuestionIds, keep longest topic_sentence,
    // union ao_focus.
    const subThemeMap = new Map<string, SubThemeNode>()
    for (const q of matchingQuestions) {
      const plan = q.framework?.paragraph_plan ?? []
      for (const p of plan) {
        const key = normalizeTopic(p.topic)
        const existing = subThemeMap.get(key)
        if (!existing) {
          subThemeMap.set(key, {
            topic: p.topic,
            topic_sentence: p.topic_sentence,
            ao_focus: [...p.ao_focus],
            sourceQuestionIds: [q.id],
          })
        } else {
          if (!existing.sourceQuestionIds.includes(q.id)) {
            existing.sourceQuestionIds.push(q.id)
          }
          if (p.topic_sentence.length > existing.topic_sentence.length) {
            existing.topic_sentence = p.topic_sentence
          }
          for (const ao of p.ao_focus) {
            if (!existing.ao_focus.includes(ao)) existing.ao_focus.push(ao)
          }
        }
      }
    }
    const subThemes = Array.from(subThemeMap.values())

    // Ring 4 quotes: pull bank for (theme, play) if it exists.
    const bank = themeQuoteBanks.find(
      b => b.theme === theme && b.plays.includes(play),
    )
    const quotes: ThemeQuote[] = bank ? [...bank.quotes] : []

    // Ring 4 critics: union of framework.critic_positions across matching
    // questions, deduped by critic name (first occurrence wins).
    const criticMap = new Map<string, CriticPosition>()
    for (const q of matchingQuestions) {
      const cps = q.framework?.critic_positions ?? []
      for (const cp of cps) {
        if (!criticMap.has(cp.critic)) criticMap.set(cp.critic, cp)
      }
    }
    const critics = Array.from(criticMap.values())

    nodes.push({
      theme,
      questionCount: qIds.length,
      subThemes,
      quotes,
      critics,
    })
  }

  return nodes
    .filter(n => n.subThemes.length >= MIN_SUB_THEMES && (n.quotes.length + n.critics.length) >= MIN_RING4)
    .sort((a, b) => b.questionCount - a.questionCount)
    .slice(0, MAX_THEMES)
}
