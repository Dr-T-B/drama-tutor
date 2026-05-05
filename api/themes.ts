import { createClient } from '@supabase/supabase-js'

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase
    .from('themes')
    .select('id, theme_code, theme_name, section_relevance, texts!inner(short_code)')
    .order('theme_code')

  if (error) return res.status(500).json({ error: error.message })

  res.status(200).json(
    (data ?? []).map((t: any) => ({
      id: t.id,
      theme_code: t.theme_code,
      theme_name: t.theme_name,
      section_relevance: t.section_relevance,
      play: t.texts.short_code,
    }))
  )
}
