import { usePlay } from '../contexts/PlayContext'

const options = [
  { value: 'HAM', label: 'Hamlet' },
  { value: 'both', label: 'Both' },
  { value: 'MAL', label: 'Duchess' },
] as const

export function PlayToggle() {
  const { play, setPlay } = usePlay()
  return (
    <div className="flex rounded-full border border-[#D2D2D7] bg-white p-0.5 gap-0.5">
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => setPlay(o.value)}
          className={[
            'px-3 py-1 rounded-full text-sm font-medium transition-colors',
            play === o.value
              ? 'bg-[#0071E3] text-white'
              : 'text-[#6E6E73] hover:text-[#1D1D1F]',
          ].join(' ')}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
