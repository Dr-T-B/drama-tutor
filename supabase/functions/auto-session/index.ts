import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const familyEmail = Deno.env.get('FAMILY_EMAIL')
  const familyPassword = Deno.env.get('FAMILY_PASSWORD')

  if (!supabaseUrl || !serviceRoleKey || !familyEmail || !familyPassword) {
    return new Response(
      JSON.stringify({ error: 'Server misconfiguration — secrets not set' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  const { data, error } = await supabase.auth.signInWithPassword({
    email: familyEmail,
    password: familyPassword,
  })

  if (error || !data.session) {
    return new Response(
      JSON.stringify({ error: error?.message ?? 'Sign-in failed' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
})
