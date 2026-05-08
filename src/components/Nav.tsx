import { Link, useLocation } from 'react-router-dom'
import { PlayToggle } from './PlayToggle'

type NavLink = { to: string; label: string; highlight?: boolean }

const LINKS: NavLink[] = [
  { to: '/revision', label: 'Revise' },
  { to: '/quotes',   label: 'Quotes' },
  { to: '/themes',   label: 'Themes' },
  { to: '/critics',  label: 'Critics' },
  { to: '/essays',   label: 'Essays' },
  { to: '/exam',     label: 'Exam skills' },
  { to: '/acts',     label: 'Acts & Scenes' },
  { to: '/guide',    label: 'Recall Guide' },
  { to: '/compass',  label: 'Compass' },
]

export function Nav() {
  const { pathname } = useLocation()
  return (
    <nav className="sticky top-0 z-10 bg-white border-b border-[#D2D2D7] px-4 py-2
                    flex items-center gap-4 flex-wrap">
      <Link to="/" className="text-base font-semibold text-[#1D1D1F] mr-2">
        Drama tutor
      </Link>
      <PlayToggle />
      <div className="flex gap-1 ml-auto flex-wrap">
        {LINKS.map(l => {
          const active = pathname.startsWith(l.to)
          const cls = active
            ? 'bg-blue-50 text-[#0071E3]'
            : l.highlight
              ? 'bg-[#1D1D1F] text-white hover:bg-[#2D2D2F]'
              : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-gray-50'
          return (
            <Link key={l.to} to={l.to}
              className={['px-3 py-1.5 rounded-md text-sm font-medium transition-colors', cls].join(' ')}>
              {l.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
