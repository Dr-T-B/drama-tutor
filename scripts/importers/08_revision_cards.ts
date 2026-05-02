import { supabase } from '../lib/supabaseAdmin.js'
import { ok, err, info, section } from '../lib/log.js'
import 'dotenv/config'

const { data: hamRow } = await supabase.from('texts').select('id').eq('short_code', 'HAM').single()
const { data: malRow } = await supabase.from('texts').select('id').eq('short_code', 'MAL').single()
if (!hamRow || !malRow) { err('Texts not found.'); process.exit(1) }

async function buildCardsForText(textCode: 'HAM' | 'MAL', textId: string) {
  section(`08 — Revision cards (${textCode})`)
  const playwright = textCode === 'HAM' ? 'Shakespeare' : 'Webster'

  // Quote cards
  const { data: quotes } = await supabase
    .from('quotes')
    .select('id, quote_id, content, exam_sentence, primary_theme_id')
    .eq('text_id', textId)
  let qCount = 0
  for (const q of quotes ?? []) {
    if (!q.exam_sentence) continue
    const front = `[${q.quote_id}] Analyse this ${playwright} quotation: "${q.content.slice(0, 100)}${q.content.length > 100 ? '…' : ''}"`
    const { error } = await supabase
      .from('revision_cards')
      .upsert({
        text_id:      textId,
        theme_id:     q.primary_theme_id,
        quote_id:     q.id,
        card_type:    'quote',
        ao_focus:     'AO2',
        front_prompt: front,
        back_content: q.exam_sentence,
        difficulty:   'A',
      }, { onConflict: 'text_id,card_type,front_prompt_hash' })
    if (error) { err(`Quote card ${q.quote_id}: ${error.message}`); continue }
    qCount++
  }
  ok(`${qCount} quote cards (${textCode})`)

  // Theme cards: A* thesis
  const { data: themes } = await supabase
    .from('themes')
    .select('id, theme_code, theme_name')
    .eq('text_id', textId)
  let tCount = 0
  for (const t of themes ?? []) {
    const { data: thesis } = await supabase
      .from('theme_theses')
      .select('thesis_text')
      .eq('theme_id', t.id)
      .eq('grade_band', 'A_STAR')
      .maybeSingle()
    if (!thesis) continue
    const front = `Give a Grade A* thesis for the theme: ${t.theme_name} (${t.theme_code})`
    const { error } = await supabase
      .from('revision_cards')
      .upsert({
        text_id:      textId,
        theme_id:     t.id,
        card_type:    'theme',
        ao_focus:     'AO1',
        front_prompt: front,
        back_content: thesis.thesis_text,
        difficulty:   'A_STAR',
      }, { onConflict: 'text_id,card_type,front_prompt_hash' })
    if (error) { err(`Theme card ${t.theme_code}: ${error.message}`); continue }
    tCount++
  }
  ok(`${tCount} theme cards (${textCode})`)
}

await buildCardsForText('HAM', hamRow.id)
await buildCardsForText('MAL', malRow.id)

console.log('\n✅  08 Revision cards complete\n')
