import { useState } from 'react'
import { AoBadge } from './AoBadge'
import type { RecallGuide } from '../data/recallGuides'
import type { AOKey } from '../data/actScenes'

// Edexcel 9ET0/01: Section A (HAM) assesses AO1/AO2/AO3/AO5; Section B (MAL) assesses AO1/AO2/AO3 only.
function filterAosForPlay(aos: AOKey[], play: 'HAM' | 'MAL'): AOKey[] {
  if (play === 'MAL') return aos.filter(ao => ao !== 'AO4' && ao !== 'AO5')
  return aos.filter(ao => ao !== 'AO4')
}

const PLAY_STYLE = {
  HAM: {
    accent: 'text-violet-700',
    activeBorder: 'border-violet-500',
    activeText: 'text-violet-700',
    pillBg: 'bg-violet-100 text-violet-800',
    softBg: 'bg-violet-50',
  },
  MAL: {
    accent: 'text-teal-700',
    activeBorder: 'border-teal-500',
    activeText: 'text-teal-700',
    pillBg: 'bg-teal-100 text-teal-800',
    softBg: 'bg-teal-50',
  },
} as const

type TabId = 'themes' | 'packages' | 'critics' | 'crossText' | 'recovery'

interface TabDef {
  id: TabId
  label: string
}

export function RecallGuide({ guide }: { guide: RecallGuide }) {
  const style = PLAY_STYLE[guide.play]
  const tabs: TabDef[] = [
    { id: 'themes', label: 'Themes' },
    { id: 'packages', label: 'Quote Packages' },
    { id: 'critics', label: 'Critics' },
    ...(guide.crossText ? [{ id: 'crossText' as const, label: 'Cross-Text' }] : []),
    { id: 'recovery', label: 'Recovery' },
  ]

  const [tab, setTab] = useState<TabId>('themes')

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 flex-wrap">
        {tabs.map(t => {
          const active = t.id === tab
          const cls = active
            ? `${style.activeBorder} ${style.activeText}`
            : 'border-transparent text-gray-500 hover:text-gray-800'
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${cls}`}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Tab body */}
      {tab === 'themes' && <ThemesTab guide={guide} />}
      {tab === 'packages' && <PackagesTab guide={guide} />}
      {tab === 'critics' && <CriticsTab guide={guide} />}
      {tab === 'crossText' && guide.crossText && <CrossTextTab guide={guide} />}
      {tab === 'recovery' && <RecoveryTab guide={guide} />}
    </div>
  )
}

function ThemesTab({ guide }: { guide: RecallGuide }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="hidden md:grid md:grid-cols-[1.5fr_2fr_1.5fr_1fr] px-4 py-2 text-xs uppercase tracking-wide text-gray-400 font-semibold border-b border-gray-100">
        <span>Theme</span>
        <span>Anchor quote</span>
        <span>Method</span>
        <span>AOs</span>
      </div>
      {guide.themes.map((theme, i) => {
        const open = openIdx === i
        return (
          <div key={theme.name} className="border-b border-gray-100 last:border-b-0">
            <button
              type="button"
              onClick={() => setOpenIdx(open ? null : i)}
              className="w-full grid grid-cols-1 md:grid-cols-[1.5fr_2fr_1.5fr_1fr] gap-2 px-4 py-3 text-left hover:bg-gray-50"
            >
              <span className="text-sm font-semibold text-gray-900">{theme.name}</span>
              <span className="text-sm font-serif italic text-gray-700">{theme.anchorQuote}</span>
              <span className="text-sm text-gray-600">{theme.method}</span>
              <span className="flex gap-1 flex-wrap">
                {filterAosForPlay(theme.aos, guide.play).map(ao => <AoBadge key={ao} ao={ao} />)}
              </span>
            </button>
            {open && (
              <div className="px-4 pb-4 pt-1 flex flex-col gap-3 bg-gray-50/50">
                {theme.packages.map((pkg, j) => (
                  <PackageCard key={j} pkg={pkg} play={guide.play} />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function PackagesTab({ guide }: { guide: RecallGuide }) {
  return (
    <div className="flex flex-col gap-8">
      {guide.themes.map(theme => (
        <section key={theme.name} className="flex flex-col gap-3">
          <h3 className="text-xs uppercase tracking-wide font-semibold text-gray-400">
            {theme.name}
          </h3>
          <div className="flex flex-col gap-3">
            {theme.packages.map((pkg, j) => (
              <PackageCard key={j} pkg={pkg} play={guide.play} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function PackageCard({
  pkg,
  play,
}: {
  pkg: import('../data/recallGuides').QuotePackage
  play: 'HAM' | 'MAL'
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-2">
      <p className="text-xs uppercase tracking-wide text-gray-400">
        {pkg.speaker} · {pkg.act}
      </p>
      <p className="font-serif italic text-base text-gray-900 my-2">{pkg.text}</p>
      {pkg.methods.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {pkg.methods.map((m, i) => (
            <span
              key={i}
              className="bg-gray-100 text-gray-700 text-xs rounded-full px-2 py-0.5"
            >
              {m}
            </span>
          ))}
        </div>
      )}
      <div className="border-t border-gray-100 pt-3">
        <p className="text-sm text-gray-600 leading-snug">{pkg.meaning}</p>
      </div>
      <div className="flex gap-1 flex-wrap">
        {filterAosForPlay(pkg.aos, play).map(ao => <AoBadge key={ao} ao={ao} />)}
      </div>
    </div>
  )
}

function CriticsTab({ guide }: { guide: RecallGuide }) {
  const style = PLAY_STYLE[guide.play]
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {guide.critics.map(c => (
        <div key={c.name} className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-2">
          <p className="font-semibold text-gray-900">{c.name}</p>
          <p className="text-sm text-gray-600 mt-1 leading-snug">{c.position}</p>
          <div className="flex gap-1 flex-wrap mt-1">
            {c.themes.map(t => (
              <span
                key={t}
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${style.pillBg}`}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function CrossTextTab({ guide }: { guide: RecallGuide }) {
  if (!guide.crossText) return null
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {guide.crossText.map(c => (
        <div key={c.title} className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="font-semibold text-sm text-gray-900">{c.title}</p>
          <p className="text-sm text-gray-600 mt-1 leading-snug">{c.detail}</p>
        </div>
      ))}
    </div>
  )
}

function RecoveryTab({ guide }: { guide: RecallGuide }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guide.recoveryMoves.map(m => (
          <div key={m.title} className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="font-semibold text-gray-900">{m.title}</p>
            <p className="text-sm text-gray-600 mt-1 leading-snug">{m.detail}</p>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
        <p className="text-xs uppercase font-semibold text-amber-700">
          {guide.modelParagraph.theme}
        </p>
        <p className="font-serif italic text-amber-900 my-1">{guide.modelParagraph.quote}</p>
        <p className="text-sm text-amber-900 leading-relaxed">
          {parseModelParagraph(guide.modelParagraph.text, guide.play)}
        </p>
      </div>
    </div>
  )
}

function parseModelParagraph(text: string, play: 'HAM' | 'MAL') {
  const allowed = play === 'MAL'
    ? new Set(['AO1', 'AO2', 'AO3'])
    : new Set(['AO1', 'AO2', 'AO3', 'AO5'])
  const parts = text.split(/(\[AO[1-5]\])/g)
  return parts.map((part, i) => {
    const m = part.match(/^\[(AO[1-5])\]$/)
    if (m) {
      if (!allowed.has(m[1])) return null
      return (
        <span key={i} className="inline-block align-middle mx-0.5">
          <AoBadge ao={m[1]} />
        </span>
      )
    }
    return <span key={i}>{part}</span>
  })
}
