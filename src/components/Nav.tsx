import { Link, useLocation } from 'react-router-dom'
import { PlayToggle } from './PlayToggle'

const LINKS = [
  { to: '/revision', label: 'Revise' },
  { to: '/quotes',   label: 'Quotes' },
  { to: '/themes',   label: 'Themes' },
  { to: '/critics',  label: 'Critics' },
  { to: '/essays',   label: 'Essays' },
  { to: '/exam',     label: 'Exam skills' },
]

export function Nav() {
  const { pathname } = useLocation()
  return (
    <nav className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2
                    flex items-center gap-4 flex-wrap">
      <Link to="/" className="text-base font-semibold text-gray-900 mr-2">
        Drama tutor
      </Link>
      <PlayToggle />
      <div className="flex gap-1 ml-auto flex-wrap">
        {LINKS.map(l => (
          <Link key={l.to} to={l.to}
            className={[
              'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              pathname.startsWith(l.to)
                ? 'bg-violet-50 text-violet-700'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50',
            ].join(' ')}>
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
