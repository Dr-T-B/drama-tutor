import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

// Load .env.local from the project root (preferred) then .env as a fallback.
// dotenv.config() does not override already-set env vars, so .env.local wins.
const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..', '..')
dotenv.config({ path: resolve(projectRoot, '.env.local') })
dotenv.config({ path: resolve(projectRoot, '.env') })

const url = process.env.VITE_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  throw new Error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
}

export const supabase = createClient(url, key, {
  auth: { persistSession: false },
})
