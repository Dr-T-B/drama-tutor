import { ModeDDuchessRouteTrainer } from '../ModeDDuchessRouteTrainer'

export function CourtSurveillancePage() {
  return (
    <ModeDDuchessRouteTrainer
      routeKey="MODE_D_D002R_DUCHESS_CONTROL_ROUTE_B_COURT_SURVEILLANCE"
      routeTitle="Court Surveillance"
      difficultyBand="LEVEL_5_ADVANCED"
      riskWarning="Can over-focus on Bosola and lose the Duchess/control question."
      revealRoute={undefined}
    />
  )
}
