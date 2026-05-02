const COLOURS: Record<string, string> = {
  AO1: 'bg-blue-100 text-blue-800',
  AO2: 'bg-amber-100 text-amber-800',
  AO3: 'bg-green-100 text-green-800',
  AO4: 'bg-rose-100 text-rose-800',
  AO5: 'bg-purple-100 text-purple-800',
}

export function AoBadge({ ao }: { ao: string }) {
  const cls = COLOURS[ao] ?? 'bg-gray-100 text-gray-700'
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {ao}
    </span>
  )
}
