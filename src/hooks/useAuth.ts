import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Try to restore existing session first
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSession(data.session)
        setLoading(false)
      } else {
        // Auto sign-in with shared family account
        supabase.auth.signInWithPassword({
          email: import.meta.env.VITE_FAMILY_EMAIL,
          password: import.meta.env.VITE_FAMILY_PASSWORD,
        }).then(({ data: signInData }) => {
          setSession(signInData.session)
          setLoading(false)
        })
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  return { session, loading, userId: session?.user.id ?? null }
}
