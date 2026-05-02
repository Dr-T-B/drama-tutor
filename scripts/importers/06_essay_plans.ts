import { supabase } from '../lib/supabaseAdmin.js'
import { ok, err, info, section } from '../lib/log.js'
import { readBlock, splitByH3, parseHorizontalTable, parseAllHorizontalTables, clean, parseThemeCodeList } from '../lib/parsers.js'
import 'dotenv/config'

const { data: hamRow } = await supabase.from('texts').select('id').eq('short_code', 'HAM').single()
const { data: malRow } = await supabase.from('texts').select('id').eq('short_code', 'MAL').single()
if (!hamRow || !malRow) { err('Texts not found.'); process.exit(1) }

type ParaRecord = {
  paragraph_no: number
  paragraph_function: string
  topic_sentence: string
  quote_human_id: string | null
  ao2_move: string | null
  ao3_move: string | null
  ao4_move: string | null
  ao5_move: string | null
}
type PlanRecord = {
  question_text: string
  conceptual_thesis: string
  primary_theme_code: string | null
  paragraphs: ParaRecord[]
}

const FIELD_RE: Record<string, RegExp> = {
  question:     /\*\*Question:\*\*\s*\*?([\s\S]*?)\*?(?=\n\n|\n\*\*)/i,
  thesis:       /\*\*(?:Conceptual\s+)?[Tt]hesis(?:\s*\[AO1\])?:\*\*\s*([\s\S]*?)(?=\n\n|\n\*\*)/i,
  primary:      /\*\*(?:Controlling theme|Primary themes?)[^*]*\*\*\s*([^\n]+)/i,
}

function captureField(body: string, re: RegExp): string {
  const m = body.match(re)
  return m && m[1] ? clean(m[1]).replace(/\s+/g, ' ').trim() : ''
}

// Extract paragraphs from a plan. Handles two formats:
//   Block 4 (Hamlet): "**Paragraph N — Title**" with *Argument:* + per-paragraph quote table + *AO5 move:*
//   Block 7 (Duchess): "#### Paragraph N — Title" with **Topic sentence:** **Best quote:** **AO2 focus:** etc.
function extractParagraphs(body: string): ParaRecord[] {
  const records: ParaRecord[] = []

  // Locate paragraph markers
  type Marker = { idx: number; no: number; title: string; isHeading: boolean }
  const markers: Marker[] = []

  // H4 headings (block 7)
  const h4Re = /^####\s*Paragraph\s*(\d+)\s*[—\-–:]\s*(.+)$/gim
  for (const m of body.matchAll(h4Re)) {
    markers.push({ idx: m.index!, no: parseInt(m[1], 10), title: clean(m[2]), isHeading: true })
  }
  // Bold "**Paragraph N — Title**" (block 4) — only count those at paragraph start
  const boldRe = /^\*\*Paragraph\s*(\d+)\s*[—\-–:]\s*([^*\n]+?)\*\*\s*$/gim
  for (const m of body.matchAll(boldRe)) {
    if (!markers.some(x => x.idx === m.index)) {
      markers.push({ idx: m.index!, no: parseInt(m[1], 10), title: clean(m[2]), isHeading: false })
    }
  }
  markers.sort((a, b) => a.idx - b.idx)

  for (let i = 0; i < markers.length; i++) {
    const start = markers[i].idx
    const end   = i + 1 < markers.length ? markers[i + 1].idx : body.length
    const slice = body.slice(start, end)

    let topic = captureField(slice, /\*\*Topic sentence:\*\*\s*([\s\S]*?)(?=\n\n|\n\*\*|$)/i)
    if (!topic) topic = captureField(slice, /\*Argument:\*\s*([\s\S]*?)(?=\n\n|\n\||\n\*|$)/i)
    if (!topic) topic = markers[i].title

    let quoteId: string | null = null
    const bestM = slice.match(/\*\*Best quote:\*\*\s*([A-Z]{3}\\?_Q\d{3,4})/)
    if (bestM) quoteId = bestM[1].replace(/\\_/g, '_')
    if (!quoteId) {
      // Try a per-paragraph quote table (block 4)
      const tables = parseAllHorizontalTables(slice)
      for (const tbl of tables) {
        const row = tbl.find(r => Object.keys(r).some(k => /quote\s*id/i.test(k)))
        if (!row) continue
        const idKey = Object.keys(row).find(k => /quote\s*id/i.test(k))!
        const id = clean(row[idKey]).replace(/\\_/g, '_')
        if (/^[A-Z]{3}_Q\d{3,4}$/.test(id)) { quoteId = id; break }
      }
    }

    const ao2 = captureField(slice, /\*\*AO2(?: focus|\s*\[AO2\])?:\*\*\s*([\s\S]*?)(?=\n\n|\n\*\*|$)/i)
    const ao3 = captureField(slice, /\*\*AO3(?: trigger| context|\s*\[AO3\])?:\*\*\s*([\s\S]*?)(?=\n\n|\n\*\*|$)/i)
    const ao5fromMove = captureField(slice, /\*AO5 move:\*\s*([\s\S]*?)(?=\n\n|\n\*|$)/i)
    const ao5fromBold = captureField(slice, /\*\*AO5(?: move|\s*\[AO5\])?:\*\*\s*([\s\S]*?)(?=\n\n|\n\*\*|$)/i)
    const ao5 = ao5fromMove || ao5fromBold

    records.push({
      paragraph_no:       markers[i].no,
      paragraph_function: markers[i].title,
      topic_sentence:     topic,
      quote_human_id:     quoteId,
      ao2_move:           ao2 || null,
      ao3_move:           ao3 || null,
      ao4_move:           null,
      ao5_move:           ao5 || null,
    })
  }
  return records
}

function parsePlans(md: string, planSectionRegex: RegExp): PlanRecord[] {
  const plans: PlanRecord[] = []
  for (const sec of splitByH3(md)) {
    if (!planSectionRegex.test(sec.title)) continue
    const question = captureField(sec.body, FIELD_RE.question)
    const thesis   = captureField(sec.body, FIELD_RE.thesis)
    const primaryRaw = captureField(sec.body, FIELD_RE.primary)
    const themeCodes = parseThemeCodeList(primaryRaw)
    const paragraphs = extractParagraphs(sec.body)
    if (!question || paragraphs.length === 0) continue
    plans.push({
      question_text:       question,
      conceptual_thesis:   thesis || question,
      primary_theme_code:  themeCodes[0] ?? null,
      paragraphs,
    })
  }
  return plans
}

async function importPlans(plans: PlanRecord[], textCode: 'HAM' | 'MAL', textId: string, planMinutes: number) {
  section(`06 — Essay plans (${textCode})`)
  info(`Parsed ${plans.length} plans`)
  for (const p of plans) {
    let themeId: string | null = null
    if (p.primary_theme_code) {
      const { data } = await supabase.from('themes').select('id')
        .eq('text_id', textId).eq('theme_code', p.primary_theme_code).maybeSingle()
      themeId = data?.id ?? null
    }

    // Check for existing plan with same question + text
    const { data: existing } = await supabase
      .from('essay_plans')
      .select('id')
      .eq('text_id', textId)
      .eq('question_text', p.question_text)
      .maybeSingle()

    let planId: string
    if (existing) {
      planId = existing.id
      await supabase.from('essay_plans').update({
        theme_id:          themeId,
        section:           textCode === 'HAM' ? 'SECTION_A' : 'SECTION_B',
        conceptual_thesis: p.conceptual_thesis,
        plan_minutes:      planMinutes,
      }).eq('id', planId)
    } else {
      const { data: ins, error } = await supabase
        .from('essay_plans')
        .insert({
          text_id:           textId,
          theme_id:          themeId,
          section:           textCode === 'HAM' ? 'SECTION_A' : 'SECTION_B',
          question_text:     p.question_text,
          conceptual_thesis: p.conceptual_thesis,
          plan_minutes:      planMinutes,
          target_level:      'A_STAR',
        })
        .select('id').single()
      if (error || !ins) { err(`Plan insert: ${error?.message}`); continue }
      planId = ins.id
    }

    // Idempotent rebuild of plan_paragraphs
    await supabase.from('plan_paragraphs').delete().eq('essay_plan_id', planId)
    for (const para of p.paragraphs) {
      let quoteRowId: string | null = null
      if (para.quote_human_id) {
        const { data: qr } = await supabase.from('quotes').select('id')
          .eq('text_id', textId).eq('quote_id', para.quote_human_id).maybeSingle()
        quoteRowId = qr?.id ?? null
      }
      const { error } = await supabase.from('plan_paragraphs').insert({
        essay_plan_id:      planId,
        paragraph_no:       para.paragraph_no,
        paragraph_function: para.paragraph_function.slice(0, 200),
        topic_sentence:     para.topic_sentence,
        quote_id:           quoteRowId,
        ao2_move:           para.ao2_move,
        ao3_move:           para.ao3_move,
        ao4_move:           null,
        ao5_move:           para.ao5_move,
      })
      if (error) err(`  para ${p.question_text.slice(0, 40)} P${para.paragraph_no}: ${error.message}`)
    }
    ok(`Plan: ${p.question_text.slice(0, 60)}…  (paragraphs: ${p.paragraphs.length})`)
  }
}

const hamPlans = parsePlans(readBlock('block4_hamlet_critics_plans_models.md'), /^ESSAY\s+PLAN/i)
await importPlans(hamPlans, 'HAM', hamRow.id, 75)
const malPlans = parsePlans(readBlock('block7_duchess_essay_plans.md'), /^ESSAY\s+PLAN/i)
await importPlans(malPlans, 'MAL', malRow.id, 55)

console.log('\n✅  06 Essay plans complete\n')
