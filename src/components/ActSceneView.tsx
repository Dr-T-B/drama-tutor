import { useEffect, useMemo, useState } from 'react'
import { AoBadge } from './AoBadge'
import { PrintButton } from './PrintButton'
import { EssayCard } from './EssayCard'
import { getEssaysByAct } from '../data/essays'
import type { ActScene, AOKey } from '../data/actScenes'

const AO_RING: Record<AOKey, string> = {
  AO1: 'ring-blue-400',
  AO2: 'ring-amber-400',
  AO3: 'ring-green-400',
  AO4: 'ring-rose-400',
  AO5: 'ring-purple-400',
}

// Edexcel 9ET0/01: Section A (HAM) assesses AO1/AO2/AO3/AO5; Section B (MAL) assesses AO1/AO2/AO3 only.
function filterAosForPlay(aos: AOKey[], play: 'HAM' | 'MAL'): AOKey[] {
  if (play === 'MAL') return aos.filter(ao => ao !== 'AO4' && ao !== 'AO5')
  return aos.filter(ao => ao !== 'AO4')
}

const PLAY_STYLE = {
  HAM: {
    activeBg: 'bg-violet-50 text-violet-700',
    activeBorder: 'border-violet-200',
    pill: 'bg-violet-100 text-violet-800',
    accent: 'text-violet-700',
  },
  MAL: {
    activeBg: 'bg-teal-50 text-teal-700',
    activeBorder: 'border-teal-200',
    pill: 'bg-teal-100 text-teal-800',
    accent: 'text-teal-700',
  },
} as const

function sceneKey(s: ActScene) {
  return `${s.act}-${s.scene}`
}

export function ActSceneView({ guide }: { guide: ActScene[] }) {
  const groupedByAct = useMemo(() => {
    const groups = new Map<number, ActScene[]>()
    for (const s of guide) {
      if (!groups.has(s.act)) groups.set(s.act, [])
      groups.get(s.act)!.push(s)
    }
    for (const arr of groups.values()) arr.sort((a, b) => a.scene - b.scene)
    return Array.from(groups.entries()).sort(([a], [b]) => a - b)
  }, [guide])

  const firstScene = guide[0]
  const playStyle = firstScene ? PLAY_STYLE[firstScene.play] : PLAY_STYLE.HAM

  const [selectedKey, setSelectedKey] = useState<string | null>(
    firstScene ? sceneKey(firstScene) : null,
  )
  const [openActs, setOpenActs] = useState<Set<number>>(
    () => new Set(firstScene ? [firstScene.act] : []),
  )

  useEffect(() => {
    if (!firstScene) {
      setSelectedKey(null)
      return
    }
    if (!guide.some(s => sceneKey(s) === selectedKey)) {
      setSelectedKey(sceneKey(firstScene))
      setOpenActs(new Set([firstScene.act]))
    }
  }, [guide, firstScene, selectedKey])

  const selected = useMemo(
    () => guide.find(s => sceneKey(s) === selectedKey) ?? null,
    [guide, selectedKey],
  )

  function toggleAct(act: number) {
    setOpenActs(prev => {
      const next = new Set(prev)
      if (next.has(act)) next.delete(act)
      else next.add(act)
      return next
    })
  }

  if (!firstScene) {
    return (
      <p className="text-sm text-gray-500">No scenes available for this play.</p>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
      {/* ── SIDEBAR ───────────────────────────────────────── */}
      <aside className="md:sticky md:top-20 md:self-start">
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          {groupedByAct.map(([act, scenes]) => {
            const isOpen = openActs.has(act)
            return (
              <div key={act} className="border-b border-gray-100 last:border-b-0">
                <button
                  type="button"
                  onClick={() => toggleAct(act)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-left
                             text-sm font-semibold text-gray-800 hover:bg-gray-50"
                >
                  <span>Act {act}</span>
                  <span className="text-xs text-gray-400">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <ul className="pb-2">
                    {scenes.map(s => {
                      const key = sceneKey(s)
                      const active = key === selectedKey
                      const cls = active
                        ? `${playStyle.activeBg} font-medium`
                        : 'text-gray-600 hover:bg-gray-50'
                      return (
                        <li key={key}>
                          <button
                            type="button"
                            onClick={() => setSelectedKey(key)}
                            className={`w-full text-left px-4 py-1.5 text-sm leading-snug ${cls}`}
                          >
                            <span className="block text-xs text-gray-400">
                              Scene {s.scene}
                            </span>
                            <span className="block">{s.title}</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      </aside>

      {/* ── MAIN PANEL ────────────────────────────────────── */}
      <section>
        {selected && <SceneDetail scene={selected} />}
      </section>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
      {children}
    </p>
  )
}

function SceneDetail({ scene }: { scene: ActScene }) {
  const style = PLAY_STYLE[scene.play]
  const [activeAO, setActiveAO] = useState<AOKey | null>(null)
  const sceneIdentity = `${scene.act}-${scene.scene}`

  useEffect(() => {
    setActiveAO(null)
  }, [sceneIdentity])

  const visibleAoFocus = filterAosForPlay(scene.aoFocus, scene.play)
  const filteredQuotes = activeAO
    ? scene.keyQuotes.filter(q => q.aos.includes(activeAO))
    : scene.keyQuotes

  const textName = scene.play === 'HAM' ? 'Hamlet' : 'The Duchess of Malfi'

  return (
    <article className="flex flex-col gap-6">
      {/* Print button — hidden on print */}
      <div className="flex justify-end print-hide">
        <PrintButton label="Print this scene" />
      </div>

      {/* Print-only metadata header */}
      <header className="hidden print-only" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '16pt', margin: 0, fontFamily: 'Georgia, serif' }}>
          Drama Tutor — Acts &amp; Scenes
        </h1>
        <p style={{ fontSize: '10pt', color: '#555', margin: '0.25rem 0 1rem' }}>
          {textName} · Act {scene.act}, Scene {scene.scene} · Generated{' '}
          {new Date().toLocaleDateString('en-GB', {
            day: 'numeric', month: 'long', year: 'numeric'
          })}
        </p>
        <p style={{ margin: 0, fontWeight: 600, fontSize: '12pt' }}>{scene.title}</p>
        <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #ccc' }} />
      </header>

      {/* Header */}
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-gray-900">
          Act {scene.act}, Scene {scene.scene} — {scene.title}
        </h2>
        <div className="flex items-center gap-1 flex-wrap">
          {visibleAoFocus.map(ao => {
            const isActive = ao === activeAO
            const hasFilter = activeAO !== null
            const ringClass = isActive ? `ring-2 ring-offset-1 ${AO_RING[ao]}` : ''
            const opacityClass = hasFilter && !isActive ? 'opacity-40' : 'opacity-100'
            return (
              <button
                key={ao}
                type="button"
                onClick={() => setActiveAO(prev => (prev === ao ? null : ao))}
                className={`rounded-full transition-opacity cursor-pointer ${ringClass} ${opacityClass}`}
              >
                <AoBadge ao={ao} />
              </button>
            )
          })}
          {activeAO && (
            <button
              type="button"
              onClick={() => setActiveAO(null)}
              className="text-xs text-gray-400 underline cursor-pointer ml-2"
            >
              ✕ clear
            </button>
          )}
        </div>
      </header>

      {/* Summary */}
      <div>
        <SectionLabel>Summary</SectionLabel>
        <p className="text-gray-700 leading-relaxed">{scene.summary}</p>
      </div>

      {/* Dramatic significance */}
      <div>
        <SectionLabel>Dramatic significance</SectionLabel>
        <p className="text-gray-700 leading-relaxed">{scene.dramaticSignificance}</p>
      </div>

      {/* Key quotes */}
      <div className="flex flex-col gap-3">
        <SectionLabel>
          {activeAO ? `Key quotes — ${activeAO}` : 'Key quotes'}
        </SectionLabel>
        {filteredQuotes.length === 0 && activeAO && (
          <p className="text-sm text-gray-400 italic">
            No quotes tagged {activeAO} for this scene — try another AO or clear the filter.
          </p>
        )}
        {filteredQuotes.map((q, i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-3 print-keep-together"
          >
            <p className="text-xs uppercase text-gray-400 tracking-wide">
              {q.speaker} · Act {scene.act}, Scene {scene.scene}
            </p>
            <p className="font-serif italic text-gray-900 leading-snug">{q.text}</p>
            {q.methods.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {q.methods.map((m, j) => (
                  <span
                    key={j}
                    className="bg-gray-100 text-gray-700 text-xs rounded-full px-2 py-0.5"
                  >
                    {m}
                  </span>
                ))}
              </div>
            )}
            <div className="border-t border-gray-100 pt-3">
              <p className="text-sm text-gray-700 leading-snug">{q.significance}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Themes */}
      {scene.themes.length > 0 && (
        <div>
          <SectionLabel>Themes</SectionLabel>
          <div className="flex gap-1.5 flex-wrap">
            {scene.themes.map(t => (
              <span
                key={t}
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${style.pill}`}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Exam tip */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
        <p className="text-xs font-semibold text-amber-700 uppercase mb-1">Exam tip</p>
        <p className="text-amber-900 text-sm leading-snug">{scene.examTip}</p>
      </div>

      {/* Context note */}
      {scene.contextNote && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-blue-700 uppercase mb-1">AO3 context</p>
          <p className="text-blue-900 text-sm leading-snug">{scene.contextNote}</p>
        </div>
      )}

      <SceneEssays play={scene.play} act={scene.act} sceneNum={scene.scene} />
    </article>
  )
}

function SceneEssays({
  play,
  act,
  sceneNum,
}: {
  play: 'HAM' | 'MAL'
  act: number
  sceneNum: number
}) {
  const [open, setOpen] = useState(false)
  const essays = useMemo(
    () => getEssaysByAct(play, `${act}.${sceneNum}`),
    [play, act, sceneNum],
  )
  if (essays.length === 0) return null

  return (
    <div className="print-hide">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-left hover:bg-gray-50"
      >
        <span className="text-sm font-semibold text-gray-800">
          Model essays for this scene
          <span className="ml-2 text-xs font-normal text-gray-400">
            {essays.length}
          </span>
        </span>
        <span className="text-xs text-gray-400">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="mt-3 flex flex-col gap-3">
          {essays.map(e => (
            <EssayCard key={e.id} essay={e} />
          ))}
        </div>
      )}
    </div>
  )
}
