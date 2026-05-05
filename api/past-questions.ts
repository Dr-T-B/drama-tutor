import { createClient } from '@supabase/supabase-js'

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const yearParam = req.query?.year
  const sectionParam = req.query?.section

  let q = supabase
    .from('exam_questions')
    .select('id, question_text, question_year, question_number, section')
    .eq('source', 'past_paper')
    .order('question_year', { ascending: false })
    .order('question_number')

  if (yearParam) {
    const y = parseInt(String(yearParam), 10)
    if (!Number.isNaN(y)) q = q.eq('question_year', y)
  }
  if (sectionParam === 'SECTION_A' || sectionParam === 'SECTION_B') {
    q = q.eq('section', sectionParam)
  }

  const { data, error } = await q
  if (error) return res.status(500).json({ error: error.message })

  res.status(200).json(data ?? [])
}
