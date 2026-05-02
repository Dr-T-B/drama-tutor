import { usePlay } from '../contexts/PlayContext'

const options = [
  { value: 'HAM', label: 'Hamlet' },
  { value: 'both', label: 'Both' },
  { value: 'MAL', label: 'Duchess' },
] as const

export function PlayToggle() {
  const { play, setPlay } = usePlay()
  return (
    <div className="flex rounded-full border border-gray-200 bg-white p-0.5 gap-0.5">
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => setPlay(o.value)}
          className={[
            'px-3 py-1 rounded-full text-sm font-medium transition-colors',
            play === o.value
              ? o.value === 'HAM'
                ? 'bg-violet-600 text-white'
                : o.value === 'MAL'
                ? 'bg-teal-700 text-white'
                : 'bg-gray-800 text-white'
              : 'text-gray-500 hover:text-gray-800',
          ].join(' ')}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
