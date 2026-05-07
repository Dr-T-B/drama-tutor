import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Try to restore existing session first
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        setSession(data.session)
        setLoading(false)
        return
      }

      // No session — call the auto-session Edge Function to get tokens
      try {
        const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/auto-session`,
          { method: 'POST' }
        )

        if (!res.ok) {
          const { error } = await res.json()
          throw new Error(error ?? 'Auto-session failed')
        }

        const { access_token, refresh_token } = await res.json()

        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        })

        if (sessionError) throw sessionError

        setSession(sessionData.session)
      } catch (err) {
        console.error('Auto sign-in failed:', err)
      } finally {
        setLoading(false)
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  return { session, loading, userId: session?.user.id ?? null }
}
