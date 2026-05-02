import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BLOCKS_DIR = join(__dirname, '..', '..', 'source_blocks')

export function readBlock(filename: string): string {
  return readFileSync(join(BLOCKS_DIR, filename), 'utf8')
}

// ─── Markdown text cleaning ───────────────────────────────────────────────────
// Pandoc-emitted artefacts: backslash-escaped underscores/brackets, &gt; for blockquote.
export function clean(s: string): string {
  if (!s) return ''
  return s
    .replace(/\\_/g, '_')
    .replace(/\\\[/g, '[')
    .replace(/\\\]/g, ']')
    .replace(/\\\*/g, '*')
    .replace(/\\\|/g, '|')
    .replace(/\\\$/g, '$')
    .replace(/\\&/g, '&')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/\\'/g, "'")
    .replace(/ /g, ' ')
    .trim()
}

// Strip blockquote markers and surrounding quotation marks if both ends present.
export function cleanQuoteText(s: string): string {
  let t = clean(s)
  t = t.replace(/^>\s*/, '').trim()
  // Strip outermost matching curly or straight quotes
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith('"') && t.endsWith('"'))) {
    t = t.slice(1, -1).trim()
  }
  return t
}

// ─── Section splitting ────────────────────────────────────────────────────────
// Split markdown by ### headings into { title, body } records.
export function splitByH3(md: string): Array<{ title: string; body: string }> {
  return splitByHeading(md, 3)
}
export function splitByH2(md: string): Array<{ title: string; body: string }> {
  return splitByHeading(md, 2)
}
export function splitByH4(md: string): Array<{ title: string; body: string }> {
  return splitByHeading(md, 4)
}

function splitByHeading(md: string, level: number): Array<{ title: string; body: string }> {
  const marker = '#'.repeat(level) + ' '
  const lines = md.split('\n')
  const sections: Array<{ title: string; body: string }> = []
  let current: { title: string; body: string[] } | null = null
  for (const line of lines) {
    if (line.startsWith(marker) && !line.startsWith(marker + '#')) {
      if (current) sections.push({ title: current.title, body: current.body.join('\n') })
      current = { title: clean(line.slice(marker.length)), body: [] }
    } else if (current) {
      current.body.push(line)
    }
  }
  if (current) sections.push({ title: current.title, body: current.body.join('\n') })
  return sections
}

// ─── Vertical 2-col tables (Field | Content) ──────────────────────────────────
// Returns the first such table's rows as a Map<fieldName, contentValue>.
// Skips the header row and the alignment/separator row.
export function parseVerticalTable(md: string): Map<string, string> {
  const result = new Map<string, string>()
  const lines = md.split('\n')
  let inTable = false
  let headerSeen = false
  for (const raw of lines) {
    const line = raw.trim()
    if (!line.startsWith('|')) {
      if (inTable) break
      continue
    }
    inTable = true
    const cells = parseRowCells(line)
    if (cells.length < 2) continue
    if (/^[-:|\s]+$/.test(cells[0])) continue // alignment row
    if (!headerSeen) {
      // first row is "Field | Content" — skip
      headerSeen = true
      continue
    }
    const key = clean(cells[0]).replace(/\*\*/g, '')
    const val = clean(cells.slice(1).join(' | ')).replace(/\*\*/g, '')
    if (key) result.set(key, val)
  }
  return result
}

// Find ALL vertical tables in a section (each table is a separate quote/critic/etc.)
export function parseAllVerticalTables(md: string): Map<string, string>[] {
  const tables: Map<string, string>[] = []
  const blocks = splitTableBlocks(md)
  for (const block of blocks) {
    const t = parseVerticalTable(block)
    if (t.size > 0) tables.push(t)
  }
  return tables
}

// Split markdown into chunks each containing exactly one pipe-table.
function splitTableBlocks(md: string): string[] {
  const lines = md.split('\n')
  const blocks: string[][] = []
  let cur: string[] = []
  let inTable = false
  for (const line of lines) {
    const isTableLine = line.trim().startsWith('|')
    if (isTableLine) {
      if (!inTable) {
        if (cur.length) cur = []
        inTable = true
      }
      cur.push(line)
    } else {
      if (inTable) {
        blocks.push(cur)
        cur = []
        inTable = false
      }
    }
  }
  if (inTable && cur.length) blocks.push(cur)
  return blocks.map(b => b.join('\n'))
}

// Parse cells of a markdown table row. Handles escaped pipes (\|).
function parseRowCells(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '')
  // Split on unescaped pipes
  const cells: string[] = []
  let buf = ''
  for (let i = 0; i < trimmed.length; i++) {
    const c = trimmed[i]
    if (c === '\\' && trimmed[i + 1] === '|') {
      buf += '|'
      i++
    } else if (c === '|') {
      cells.push(buf)
      buf = ''
    } else {
      buf += c
    }
  }
  cells.push(buf)
  return cells.map(c => c.trim())
}

// ─── Single-line escaped-pipe tables (block 6 part 3 format) ──────────────────
// Each table is on a single line: \| Field \| Content \| \| -:- \| -:- \| \| **Method** \| ... \|
// Split by \| then group into key/value pairs after the header.
export function parseInlineEscapedTable(line: string): Map<string, string> {
  const result = new Map<string, string>()
  // Replace escaped pipes with literal pipe, then split
  const cleaned = line.replace(/\\\|/g, '|')
  const cells = cleaned.split('|').map(s => s.trim()).filter(s => s.length > 0)
  // Skip "Field", "Content", and alignment markers like "-:-"
  const filtered: string[] = []
  for (const c of cells) {
    if (/^[-:]+$/.test(c)) continue
    filtered.push(c)
  }
  // First two are typically "Field" and "Content" headers; drop them
  if (filtered[0] && /^field$/i.test(filtered[0].replace(/\*\*/g, ''))) filtered.shift()
  if (filtered[0] && /^content$/i.test(filtered[0].replace(/\*\*/g, ''))) filtered.shift()
  for (let i = 0; i + 1 < filtered.length; i += 2) {
    const key = clean(filtered[i]).replace(/\*\*/g, '')
    const val = clean(filtered[i + 1]).replace(/\*\*/g, '')
    if (key) result.set(key, val)
  }
  return result
}

// ─── Horizontal tables with named header columns ──────────────────────────────
// Parses tables like: | **Level** | **Version** | ... — returns array of row objects.
export function parseHorizontalTable(md: string): Record<string, string>[] {
  const lines = md.split('\n').filter(l => l.trim().startsWith('|'))
  if (lines.length < 2) return []
  const headers = parseRowCells(lines[0]).map(h => clean(h).replace(/\*\*/g, ''))
  const rows: Record<string, string>[] = []
  for (let i = 1; i < lines.length; i++) {
    const cells = parseRowCells(lines[i])
    if (cells.every(c => /^[-:|\s]*$/.test(c))) continue
    if (cells.length === 0) continue
    const row: Record<string, string> = {}
    headers.forEach((h, j) => { row[h] = clean(cells[j] ?? '').replace(/\*\*/g, '') })
    rows.push(row)
  }
  return rows
}

// Find all horizontal tables (separated by blank lines or non-pipe lines) in a body.
export function parseAllHorizontalTables(md: string): Record<string, string>[][] {
  return splitTableBlocks(md)
    .map(b => parseHorizontalTable(b))
    .filter(t => t.length > 0)
}

// ─── Theme code helpers ───────────────────────────────────────────────────────
// Block 5 uses DOM_T01 internally; we always store as MAL_T01.
export function normaliseThemeCode(code: string): string {
  return code.replace(/^DOM_T/, 'MAL_T').replace(/^DOM\\_T/, 'MAL_T')
}

// Extract a theme code from a heading like "HAM_T01 — Revenge, Delay and Action"
export function extractThemeCode(title: string): { code: string; name: string } | null {
  const cleaned = clean(title).replace(/\\_/g, '_')
  const m = cleaned.match(/^((?:HAM|MAL|DOM)_T\d{2})\s*[—–-]\s*(.+)$/)
  if (!m) return null
  return { code: normaliseThemeCode(m[1]), name: m[2].trim() }
}

// Extract quote ID like HAM_Q001 / MAL_Q001 from various encodings.
export function normaliseQuoteId(s: string): string {
  return clean(s).replace(/\\_/g, '_').replace(/\\/g, '').trim()
}

// Parse "HAM_T09, HAM_T12" → ['HAM_T09','HAM_T12']
export function parseThemeCodeList(s: string): string[] {
  if (!s) return []
  return clean(s)
    .replace(/\\_/g, '_')
    .split(/[,;/]+/)
    .map(t => t.trim())
    .map(normaliseThemeCode)
    .filter(t => /^(HAM|MAL)_T\d{2}$/.test(t))
}

// Parse "Method → Word → Effect → Theme" chain into 4 parts.
// Some entries use → unicode arrow, some use ' -> '. Some are missing parts.
export function parseMethodChain(s: string): { method: string; word: string; effect: string; themeNote: string } {
  const cleaned = clean(s).replace(/\\_/g, '_')
  // Replace common arrow variants with a single sentinel
  const parts = cleaned.split(/\s*(?:→|—>|->)\s*/).map(p => p.trim())
  return {
    method:    parts[0] ?? '',
    word:      parts[1] ?? '',
    effect:    parts[2] ?? '',
    themeNote: parts[3] ?? '',
  }
}

// Map a free-form AO2 method name to one of the schema's allowed categories.
export function methodCategoryFor(name: string): string {
  const n = name.toLowerCase()
  if (/(disease|animal|light|dark|natural|spatial|musical|acoustic|body|grotesque|medical|performance|theatrical|economic|commercial|imagery)/.test(n)) return 'imagery'
  if (/(metaphor|euphemism|sententia|self.?revelation|religious|devotional|extended\s+metaphor)/.test(n)) return 'lexical'
  if (/(antithesis|caesura|enjambment|fragment|parallel|repetition|syntax|sibilance|alliteration|assonance|stichomythia)/.test(n)) return 'syntax'
  if (/(rhyming\s+couplet|blank\s+verse|verse|prose)/.test(n)) return 'verse_form'
  if (/(soliloquy|aside|dramatic\s+irony|stagecraft|prop|stage\s+direction|disguise|play.?within|dumb\s+show|reported)/.test(n)) return 'dramatic'
  if (/(imperative|interrogative|rhetoric|hyperbole|apostrophe|sentent)/.test(n)) return 'rhetorical'
  if (/(staging|prop)/.test(n)) return 'staging'
  return 'generic'
}

// Map memorisation priority by theme number (T01 = 5, T02 = 4, T03+ = 3).
export function priorityForTheme(themeCode: string): number {
  const m = themeCode.match(/T(\d{2})$/)
  if (!m) return 3
  const n = parseInt(m[1], 10)
  if (n <= 2) return 5
  if (n <= 4) return 4
  if (n <= 8) return 3
  return 2
}
