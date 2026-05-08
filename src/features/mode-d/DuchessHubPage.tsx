import { Link } from 'react-router-dom'
import { useDuchessRoutes } from '../../data/modeD'
import type { ModeDRoute } from '../../types/modeDTrainer'

const BAND_LABELS: Record<string, string> = {
  LEVEL_5_ENTRY:    'Level 5 Entry · recommended',
  LEVEL_5_ADVANCED: 'Level 5 Advanced',
}

const ROUTE_CONFIG: Record<string, {
  trainerPath?: string
  revealPath?: string
  stemStatus: 'available' | 'coming_soon'
  essayStatus: 'available' | 'coming_soon'
}> = {
  'MODE_D_D002R_DUCHESS_CONTROL_ROUTE_A_PATRIARCHAL_CONTROL': {
    trainerPath: '/mode-d/duchess/patriarchal-control',
    revealPath:  '/mode-d/duchess/patriarchal-control/reveal',
    stemStatus:  'coming_soon',
    essayStatus: 'available',
  },
  'MODE_D_D002R_DUCHESS_CONTROL_ROUTE_B_COURT_SURVEILLANCE': {
    trainerPath: '/mode-d/duchess/court-surveillance',
    stemStatus:  'available',
    essayStatus: 'coming_soon',
  },
  'MODE_D_D002R_DUCHESS_CONTROL_ROUTE_C_RESISTANCE_IDENTITY': {
    stemStatus:  'coming_soon',
    essayStatus: 'coming_soon',
  },
}

function RouteCard({ route }: { route: ModeDRoute }) {
  const cfg = ROUTE_CONFIG[route.route_key] ?? { stemStatus: 'coming_soon', essayStatus: 'coming_soon' }
  const isActive = route.is_active && cfg.trainerPath

  return (
    <div className={`bg-white rounded-xl border p-5 space-y-3 ${isActive ? 'border-[#D2D2D7]' : 'border-[#E8E8ED] opacity-60'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5">
          <h3 className="text-base font-semibold text-[#1D1D1F]">{route.route_title}</h3>
          <p className="text-xs text-[#6E6E73]">{BAND_LABELS[route.difficulty_band] ?? route.difficulty_band}</p>
        </div>
        {!isActive && (
          <span className="shrink-0 text-xs bg-[#F5F5F7] text-[#AEAEB2] px-2 py-1 rounded-full font-medium">
            Coming soon
          </span>
        )}
      </div>

      {route.risk_warning && (
        <p className="text-xs text-[#6E6E73]">
          <span className="font-medium text-amber-700">Route risk: </span>
          {route.risk_warning}
        </p>
      )}

      {route.thesis_angle && (
        <p className="text-xs text-[#AEAEB2] italic">{route.thesis_angle}</p>
      )}

      {isActive && (
        <div className="flex flex-wrap gap-2 pt-1">
          {cfg.trainerPath && cfg.stemStatus === 'available' && (
            <Link
              to={cfg.trainerPath}
              className="px-3 py-1.5 bg-[#1D1D1F] text-white text-xs font-medium rounded-lg hover:bg-[#2D2D2F] transition-colors"
            >
              Train →
            </Link>
          )}
          {cfg.trainerPath && cfg.stemStatus === 'coming_soon' && (
            <Link
              to={cfg.trainerPath}
              className="px-3 py-1.5 bg-[#F5F5F7] text-[#6E6E73] text-xs font-medium rounded-lg hover:bg-[#E8E8ED] transition-colors"
            >
              Train (stems coming)
            </Link>
          )}
          {cfg.revealPath && cfg.essayStatus === 'available' && (
            <Link
              to={cfg.revealPath}
              className="px-3 py-1.5 border border-[#D2D2D7] text-xs font-medium rounded-lg hover:bg-[#F5F5F7] transition-colors"
            >
              Read annotated essay
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export function DuchessHubPage() {
  const { data: routes, isLoading, error } = useDuchessRoutes()

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <p className="text-xs font-medium text-[#6E6E73] uppercase tracking-wide">Mode D — Duchess Trainer</p>
        <h1 className="text-2xl font-semibold text-[#1D1D1F]">The Duchess of Malfi</h1>
        <p className="text-sm text-[#6E6E73]">
          Explore Webster's presentation of control — choose a route to practice Level 5 essay architecture.
        </p>
      </div>

      {/* Compliance strip */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs bg-[#F5F5F7] text-[#6E6E73] px-2.5 py-1 rounded-full font-medium">Section B</span>
        <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">AO1 / AO2 / AO3 only</span>
        <span className="text-xs bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full font-medium">AO4 / AO5 blocked</span>
      </div>

      {isLoading && (
        <p className="text-sm text-[#6E6E73]">Loading routes…</p>
      )}

      {error && (
        <p className="text-sm text-rose-600">Error loading routes: {(error as Error).message}</p>
      )}

      {/* Route cards */}
      {routes && (
        <div className="space-y-4">
          {routes.map(route => (
            <RouteCard key={route.route_key} route={route} />
          ))}
          {/* Route C placeholder if not in DB yet */}
          {!routes.find(r => r.route_key.includes('ROUTE_C')) && (
            <div className="bg-white rounded-xl border border-[#E8E8ED] p-5 opacity-50">
              <h3 className="text-base font-semibold text-[#1D1D1F]">Route C — Resistance and Identity</h3>
              <p className="text-xs text-[#6E6E73] mt-0.5">Level 5 Advanced</p>
              <p className="text-xs text-[#AEAEB2] mt-2">Foundation imported · stems pending</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
