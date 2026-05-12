import { useState, useEffect, useRef } from 'react'

// ─── AO configuration ────────────────────────────────────────────────────────

type AoKey = 'AO1' | 'AO2' | 'AO3' | 'AO5'

const AO_CONFIG: Record<AoKey, { color: string; bg: string; light: string; desc: string }> = {
  AO1: { color: '#3B82F6', bg: '#1E3A5F', light: '#BFDBFE', desc: 'Argument & Interpretation' },
  AO2: { color: '#F59E0B', bg: '#451A03', light: '#FDE68A', desc: 'Language, Form & Structure' },
  AO3: { color: '#10B981', bg: '#064E3B', light: '#A7F3D0', desc: 'Contexts' },
  AO5: { color: '#A855F7', bg: '#3B0764', light: '#E9D5FF', desc: 'Critical Viewpoints' },
}

// ─── Stem data ────────────────────────────────────────────────────────────────

interface Stem {
  id: number
  ao: AoKey
  name: string
  hint: string
  full: string
  tip: string
  plays: string[]
}

const STEMS: Stem[] = [
  {
    id: 1, ao: 'AO1',
    name: 'The Interpretive Opening',
    hint: 'Shakespeare/Webster presents…',
    full: 'Shakespeare/Webster presents [character] as [interpretive claim], a construction that invites the audience to consider [wider thematic idea].',
    tip: 'Lead with your argument — never with plot summary.',
    plays: ['Hamlet', 'Duchess'],
  },
  {
    id: 2, ao: 'AO1',
    name: 'The Complexity / Ambiguity',
    hint: 'While [character] might superficially appear…',
    full: 'While [character] might superficially appear [reading A], a closer reading reveals [reading B], suggesting that [thematic/dramatic point].',
    tip: 'Shows the examiner you can hold two readings simultaneously.',
    plays: ['Hamlet', 'Duchess'],
  },
  {
    id: 3, ao: 'AO1',
    name: 'The Development / Pivot',
    hint: 'This idea is complicated further when…',
    full: 'This idea is complicated further when [moment/quote], which forces a reassessment of [character/theme] as [new interpretation].',
    tip: 'Use this to evolve your argument — not repeat it.',
    plays: ['Hamlet', 'Duchess'],
  },
  {
    id: 4, ao: 'AO2',
    name: 'The Method-to-Meaning',
    hint: "Shakespeare/Webster's use of [method]…",
    full: "Shakespeare/Webster's use of [dramatic/linguistic method] in '[quote]' enacts [meaning/effect], positioning the audience to [response].",
    tip: 'Never name a method without explaining WHY it matters here.',
    plays: ['Hamlet', 'Duchess'],
  },
  {
    id: 5, ao: 'AO2',
    name: 'The Form & Genre',
    hint: 'In line with the conventions of…',
    full: 'In line with the conventions of [revenge tragedy / Jacobean tragedy], the [soliloquy / aside / stichomythia] here functions to [dramatic purpose], heightening the sense of [theme].',
    tip: 'Name the genre convention, then subvert or confirm it.',
    plays: ['Hamlet', 'Duchess'],
  },
  {
    id: 6, ao: 'AO2',
    name: 'The Structural Placement',
    hint: 'Positioned at [Act/Scene], this moment…',
    full: 'Positioned at [Act/Scene], this moment carries particular dramatic weight: [structural significance], which [effect on audience/meaning].',
    tip: "Act placement = dramatic function. Always justify the 'why here'.",
    plays: ['Hamlet', 'Duchess'],
  },
  {
    id: 7, ao: 'AO3',
    name: 'The Contextual Lens',
    hint: 'Read within its [Jacobean/early modern] context…',
    full: 'Read within its [Jacobean / early modern / Renaissance] context, [quote/moment] reflects contemporary anxieties about [power / gender / religion / mortality], suggesting that [playwright] is doing more than [surface reading].',
    tip: 'Context must illuminate the text — not sit beside it.',
    plays: ['Hamlet', 'Duchess'],
  },
  {
    id: 8, ao: 'AO3',
    name: 'The Gender / Power Context',
    hint: 'In a period when [patriarchal norm]…',
    full: 'In a period when [patriarchal norm / political instability / court corruption], [character]\'s [action/speech] takes on a subversive resonance, as [playwright] uses [method] to [challenge/reinforce] [contextual idea].',
    tip: 'Anchor your context to a specific, named social/political reality.',
    plays: ['Hamlet', 'Duchess'],
  },
  {
    id: 9, ao: 'AO5',
    name: 'The Critic-as-Lens',
    hint: "[Critic]'s reading of [character/theme] as…",
    full: "[Critic]'s reading of [character/theme] as [critic's position] is supported by [quote], where [analysis] — yet this position is complicated by [counter-reading], suggesting the play resists a single interpretation.",
    tip: 'The critic opens a door — your analysis walks through it.',
    plays: ['Hamlet'],
  },
  {
    id: 10, ao: 'AO5',
    name: 'The Critical Debate',
    hint: 'Critical opinion is divided: where [Critic A]…',
    full: "Critical opinion is divided: where [Critic A] argues [position], [Critic B] contends [contrasting position]. The [quote/moment] accommodates both readings, pointing to the play's deliberate [ambiguity/complexity] around [theme].",
    tip: 'Never quote a critic without showing how the TEXT supports or resists them.',
    plays: ['Hamlet'],
  },
]

const TOTAL = 20 * 60

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}

// ─── Component ────────────────────────────────────────────────────────────────

export function StemSprintPage() {
  const [flipped, setFlipped]   = useState<Record<number, boolean>>({})
  const [recalled, setRecalled] = useState<Record<number, boolean>>({})
  const [timeLeft, setTimeLeft] = useState(TOTAL)
  const [running, setRunning]   = useState(false)
  const [started, setStarted]   = useState(false)
  const [done, setDone]         = useState(false)
  const [filter, setFilter]     = useState<AoKey | 'ALL'>('ALL')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current!)
            setRunning(false)
            setDone(true)
            return 0
          }
          return t - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running])

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const secs = String(timeLeft % 60).padStart(2, '0')
  const elapsed = ((TOTAL - timeLeft) / TOTAL) * 100
  const recalledCount = Object.values(recalled).filter(Boolean).length
  const timerColor = timeLeft < 120 ? '#EF4444' : timeLeft < 300 ? '#F59E0B' : '#10B981'

  const filtered = filter === 'ALL' ? STEMS : STEMS.filter(s => s.ao === filter)

  const toggleFlip = (id: number) => setFlipped(f => ({ ...f, [id]: !f[id] }))
  const toggleRecalled = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setRecalled(r => ({ ...r, [id]: !r[id] }))
  }
  const reset = () => {
    setTimeLeft(TOTAL); setRunning(false); setStarted(false)
    setFlipped({}); setRecalled({}); setDone(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0A0A0F 0%, #12111A 40%, #0D1117 100%)',
      color: '#E2E8F0',
      padding: '0',
    }}>
      {/* Ambient glow */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '-5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%)' }} />
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 20px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: '#6B7280', textTransform: 'uppercase', marginBottom: 8, fontFamily: 'monospace' }}>
            Edexcel A-Level English Literature · Component 1 Drama
          </div>
          <h1 style={{
            fontSize: 'clamp(24px,5vw,40px)', fontWeight: 400, margin: '0 0 6px',
            background: 'linear-gradient(135deg, #E2E8F0 0%, #94A3B8 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px', lineHeight: 1.2, fontFamily: 'Georgia, serif',
          }}>
            Paragraph Stem Sprint
          </h1>
          <p style={{ color: '#6B7280', fontSize: 13, margin: 0, fontFamily: 'monospace' }}>
            Hamlet · The Duchess of Malfi · 20-Minute Quick Recall
          </p>
        </div>

        {/* Timer block */}
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20, padding: '20px 28px', marginBottom: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div>
              <div style={{ fontSize: 52, fontWeight: 700, color: timerColor, fontFamily: 'monospace', lineHeight: 1, letterSpacing: 2, transition: 'color 0.5s' }}>
                {mins}:{secs}
              </div>
              <div style={{ fontSize: 10, color: '#4B5563', letterSpacing: 3, textTransform: 'uppercase', marginTop: 3, fontFamily: 'monospace' }}>remaining</div>
            </div>
            <div style={{ minWidth: 140 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6B7280', marginBottom: 5, fontFamily: 'monospace' }}>
                <span>{recalledCount}/{STEMS.length} recalled</span>
                <span>{Math.round(elapsed)}% elapsed</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${elapsed}%`, background: `linear-gradient(90deg, #10B981, ${timerColor})`, borderRadius: 3, transition: 'width 1s linear' }} />
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, marginTop: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(recalledCount / STEMS.length) * 100}%`, background: '#A855F7', borderRadius: 2, transition: 'width 0.3s' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: 10, color: '#4B5563', marginTop: 3, fontFamily: 'monospace' }}>stems recalled</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {!started ? (
              <button onClick={() => { setRunning(true); setStarted(true) }}
                style={btnStyle('#10B981')}>▶ Start 20-Min Sprint</button>
            ) : (
              <button onClick={() => setRunning(r => !r)}
                style={btnStyle(running ? '#F59E0B' : '#10B981')}>
                {running ? '⏸ Pause' : '▶ Resume'}
              </button>
            )}
            <button onClick={reset} style={btnStyle('#6B7280', true)}>↺ Reset</button>
          </div>
        </div>

        {/* Instructions */}
        {!started && (
          <div style={{
            background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: 12, padding: '14px 18px', marginBottom: 22,
            fontSize: 13, color: '#93C5FD', fontFamily: 'monospace', lineHeight: 1.7,
          }}>
            <strong style={{ color: '#BFDBFE', display: 'block', marginBottom: 5 }}>📋 How to use this sprint</strong>
            1. Hit <strong>Start 20-Min Sprint</strong> to begin the timer.<br />
            2. Read each card's <strong>stem name + opening hint</strong> — say or write the full stem from memory.<br />
            3. Click a card to <strong>reveal</strong> the complete stem and exam tip.<br />
            4. Tick <strong>Mark as Recalled</strong> for every stem you got right. Target: all 10.
          </div>
        )}

        {/* Done banner */}
        {done && (
          <div style={{
            background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)',
            borderRadius: 12, padding: '18px 22px', marginBottom: 22, textAlign: 'center',
          }}>
            <div style={{ fontSize: 26, marginBottom: 6 }}>⏰</div>
            <div style={{ fontSize: 17, color: '#E9D5FF', fontWeight: 600, marginBottom: 4 }}>Time's up!</div>
            <div style={{ color: '#A78BFA', fontSize: 13, fontFamily: 'monospace' }}>
              You recalled <strong>{recalledCount}</strong> of {STEMS.length} stems.&nbsp;
              {recalledCount === 10 && '🏆 Perfect — A* ready!'}
              {recalledCount >= 7 && recalledCount < 10 && 'Strong. Drill the remaining stems again.'}
              {recalledCount < 7 && 'Keep going — repeat missed stems until fluent.'}
            </div>
          </div>
        )}

        {/* AO filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {(['ALL', 'AO1', 'AO2', 'AO3', 'AO5'] as const).map(f => {
            const cfg = f === 'ALL' ? null : AO_CONFIG[f]
            const active = filter === f
            return (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '6px 16px', borderRadius: 8, cursor: 'pointer',
                border: active ? `1.5px solid ${cfg?.color ?? '#94A3B8'}` : '1.5px solid rgba(255,255,255,0.08)',
                background: active ? `rgba(${hexToRgb(cfg?.color ?? '#94A3B8')},0.15)` : 'rgba(255,255,255,0.03)',
                color: active ? (cfg?.color ?? '#E2E8F0') : '#6B7280',
                fontSize: 12, fontFamily: 'monospace', letterSpacing: 1, transition: 'all 0.2s',
              }}>
                {f === 'ALL' ? 'All Stems' : `${f} · ${cfg!.desc}`}
              </button>
            )
          })}
        </div>

        {/* AO legend */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 22, flexWrap: 'wrap' }}>
          {(Object.entries(AO_CONFIG) as [AoKey, typeof AO_CONFIG[AoKey]][]).map(([ao, cfg]) => (
            <div key={ao} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#6B7280', fontFamily: 'monospace' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: cfg.color, flexShrink: 0 }} />
              <span style={{ color: cfg.color }}>{ao}</span>
              <span>— {cfg.desc}</span>
              {ao === 'AO5' && (
                <span style={{ color: '#7C3AED', background: 'rgba(124,58,237,0.15)', padding: '1px 6px', borderRadius: 4 }}>Hamlet only</span>
              )}
            </div>
          ))}
        </div>

        {/* Cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
          {filtered.map(stem => {
            const cfg = AO_CONFIG[stem.ao]
            const isFlipped  = !!flipped[stem.id]
            const isRecalled = !!recalled[stem.id]
            return (
              <div key={stem.id} onClick={() => toggleFlip(stem.id)} style={{
                background: isRecalled
                  ? 'linear-gradient(135deg,rgba(16,185,129,0.08),rgba(16,185,129,0.03))'
                  : `linear-gradient(135deg,${cfg.bg}55,rgba(10,10,15,0.95))`,
                border: `1.5px solid ${isRecalled ? 'rgba(16,185,129,0.4)' : isFlipped ? cfg.color + '60' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 16, padding: 20, cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                position: 'relative', overflow: 'hidden',
                minHeight: 180, display: 'flex', flexDirection: 'column',
                boxShadow: isFlipped ? `0 0 24px ${cfg.color}20` : 'none',
              }}>
                {/* Corner accent */}
                <div style={{
                  position: 'absolute', top: 0, right: 0, width: 60, height: 60,
                  background: `radial-gradient(circle at top right,${cfg.color}15,transparent 70%)`,
                  borderRadius: '0 16px 0 0',
                }} />

                {/* Card header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{
                      background: cfg.color, color: '#0A0A0F', fontSize: 10, fontWeight: 700,
                      padding: '3px 8px', borderRadius: 5, fontFamily: 'monospace', letterSpacing: 0.5,
                    }}>{stem.ao}</span>
                    <span style={{ fontSize: 11, color: '#4B5563', fontFamily: 'monospace' }}>#{stem.id}</span>
                  </div>
                  {isRecalled && <span style={{ fontSize: 16, color: '#10B981' }}>✓</span>}
                </div>

                {/* Name */}
                <div style={{ fontSize: 15, color: cfg.light, fontWeight: 600, marginBottom: 8, lineHeight: 1.3 }}>
                  {stem.name}
                </div>

                {/* Hint / reveal */}
                {!isFlipped ? (
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: '#6B7280', fontStyle: 'italic', lineHeight: 1.5, fontFamily: 'monospace' }}>
                      "{stem.hint}"
                    </div>
                    <div style={{ marginTop: 12, fontSize: 10, color: '#374151', fontFamily: 'monospace', letterSpacing: 1 }}>
                      TAP TO REVEAL →
                    </div>
                  </div>
                ) : (
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 13, color: '#D1D5DB', lineHeight: 1.65, fontFamily: 'monospace',
                      background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: '10px 12px',
                      borderLeft: `3px solid ${cfg.color}`, marginBottom: 10,
                    }}>
                      "{stem.full}"
                    </div>
                    <div style={{
                      fontSize: 11, color: cfg.color,
                      background: `rgba(${hexToRgb(cfg.color)},0.08)`,
                      borderRadius: 6, padding: '7px 10px', fontFamily: 'monospace', lineHeight: 1.5,
                    }}>
                      💡 {stem.tip}
                    </div>
                    {stem.ao === 'AO5' && (
                      <div style={{ marginTop: 8, fontSize: 10, color: '#7C3AED', fontFamily: 'monospace' }}>
                        ⚠ Hamlet (Section A) only — do not use for Duchess
                      </div>
                    )}
                  </div>
                )}

                {/* Play tags */}
                <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
                  {stem.plays.map(p => (
                    <span key={p} style={{
                      fontSize: 10, fontFamily: 'monospace', padding: '2px 8px', borderRadius: 4,
                      color:       p === 'Hamlet' ? '#60A5FA' : '#F472B6',
                      background:  p === 'Hamlet' ? 'rgba(96,165,250,0.1)' : 'rgba(244,114,182,0.1)',
                    }}>{p}</span>
                  ))}
                </div>

                {/* Recall button */}
                {isFlipped && (
                  <button onClick={e => toggleRecalled(stem.id, e)} style={{
                    marginTop: 12, padding: '7px 14px', borderRadius: 8, width: '100%',
                    border: isRecalled ? '1.5px solid #10B981' : '1.5px solid rgba(255,255,255,0.1)',
                    background: isRecalled ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
                    color: isRecalled ? '#10B981' : '#6B7280',
                    fontSize: 11, fontFamily: 'monospace', letterSpacing: 1,
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}>
                    {isRecalled ? '✓ RECALLED' : '○ MARK AS RECALLED'}
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* Score summary */}
        <div style={{
          marginTop: 32, background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '20px 24px',
          display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 16,
        }}>
          {(Object.entries(AO_CONFIG) as [AoKey, typeof AO_CONFIG[AoKey]][]).map(([ao, cfg]) => {
            const aoStems   = STEMS.filter(s => s.ao === ao)
            const aoRecalled = aoStems.filter(s => recalled[s.id]).length
            return (
              <div key={ao} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: cfg.color, fontFamily: 'monospace' }}>
                  {aoRecalled}/{aoStems.length}
                </div>
                <div style={{ fontSize: 11, color: '#4B5563', fontFamily: 'monospace', marginTop: 3 }}>{ao} recalled</div>
                <div style={{ marginTop: 6, height: 3, width: 48, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(aoRecalled / aoStems.length) * 100}%`, background: cfg.color, borderRadius: 2, transition: 'width 0.3s' }} />
                </div>
              </div>
            )
          })}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#E2E8F0', fontFamily: 'monospace' }}>
              {recalledCount}/10
            </div>
            <div style={{ fontSize: 11, color: '#4B5563', fontFamily: 'monospace', marginTop: 3 }}>total recalled</div>
            <div style={{ marginTop: 4, fontSize: 11, fontFamily: 'monospace', color: recalledCount === 10 ? '#10B981' : recalledCount >= 7 ? '#F59E0B' : '#6B7280' }}>
              {recalledCount === 10 ? '🏆 A* target' : recalledCount >= 7 ? 'Strong — keep drilling' : 'Keep going!'}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: '#374151', fontFamily: 'monospace', letterSpacing: 1 }}>
          HAMLET · THE DUCHESS OF MALFI · EDEXCEL COMPONENT 1 DRAMA · AO1 AO2 AO3 AO5
        </div>
      </div>
    </div>
  )
}

// ─── Button style helper ──────────────────────────────────────────────────────

function btnStyle(color: string, ghost = false): React.CSSProperties {
  return {
    padding: '9px 18px', borderRadius: 10, border: `1.5px solid ${color}`,
    background: ghost ? 'transparent' : `${color}22`,
    color, fontSize: 13, fontFamily: 'monospace', letterSpacing: 0.5,
    cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
  }
}
