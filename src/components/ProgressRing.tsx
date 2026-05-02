interface Props { value: number; max: number; size?: number }

export function ProgressRing({ value, max, size = 48 }: Props) {
  const r = (size - 6) / 2
  const circ = 2 * Math.PI * r
  const pct = max === 0 ? 0 : value / max
  const dash = circ * pct
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke="currentColor" strokeWidth={5} className="text-gray-200"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke="currentColor" strokeWidth={5} className="text-violet-500"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"/>
    </svg>
  )
}
