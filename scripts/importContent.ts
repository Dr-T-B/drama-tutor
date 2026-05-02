import { section } from './lib/log.js'

section('COMPONENT 1 DRAMA — CONTENT IMPORT')
console.log('Starting full import pipeline (idempotent — safe to re-run).\n')

// Import in dependency order. Each script is a top-level-await module that
// performs its inserts and exits when done.
await import('./importers/00_seed.js')
await import('./importers/01_themes.js')
await import('./importers/02_characters.js')
await import('./importers/03_methods.js')
await import('./importers/04_critics.js')
await import('./importers/05_quotes.js')
await import('./importers/06_essay_plans.js')
await import('./importers/07_thesis_models.js')
await import('./importers/08_revision_cards.js')
await import('./importers/09_context_entries.js')
await import('./importers/10_exam_skills.js')
await import('./importers/11_vocabulary.js')

section('IMPORT COMPLETE')
console.log('All content imported.')
console.log('Run sql/post_import_verification.sql in the Supabase SQL editor for content-volume checks.\n')
