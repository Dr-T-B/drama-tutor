// DUCHESS_LOCK — AO profile lock gate for Mode D Duchess queries.
// Every Supabase read in Mode D must pass through this lock so future
// play expansions (Hamlet etc.) cannot accidentally leak into Duchess views.

export const DUCHESS_LOCK = 'DUCHESS_SECTION_B_AO1_AO2_AO3_ONLY' as const

// React Query cache key segment — include in every queryKey that reads
// Mode D Duchess content so keys never collide with future play expansions.
export const DUCHESS_LOCK_CACHE_KEY = `lock:${DUCHESS_LOCK}` as const
