-- ============================================================
-- Migration: 12_security_patch
-- Purpose: Fix four Supabase security advisories
-- Covers: set_updated_at search_path, is_teacher RPC exposure,
--         VITE_FAMILY_PASSWORD note, leaked password reminder
-- Pre-flight results (read from sql/component1_drama_schema_v6.sql,
-- the canonical schema source, since live DB query was not run from CLI):
--   is_teacher prosecdef: TRUE  (function declared `security definer`
--                                at sql/component1_drama_schema_v6.sql:121-131)
--   RLS policies using is_teacher:
--     - Dynamic loop creates `<table>_teacher_read` SELECT policies on
--       every user-data table (sql/component1_drama_schema_v6.sql:1227-1231)
--     - `ao_scores_teacher_read` on user_essay_attempt_ao_scores
--       (sql/component1_drama_schema_v6.sql:1257-1261)
--   → Block B applies (RLS depends on is_teacher being callable by
--     authenticated users); role list preserved exactly as live function.
-- ============================================================

-- ── FIX 1: set_updated_at() — pin search_path ───────────────
-- Prevents search path manipulation attacks on the trigger function.

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ── FIX 2: is_teacher() — restrict RPC exposure ─────────────
-- Block B applies: RLS policies reference is_teacher(), so authenticated
-- must retain EXECUTE. We:
--   (a) revoke EXECUTE from anon (closes the unauthenticated RPC surface),
--   (b) flip SECURITY DEFINER → SECURITY INVOKER (function now runs with
--       the caller's privileges; safe because authenticated users can read
--       their own row in app_user_roles via the existing
--       `app_user_roles_own_read` policy),
--   (c) keep `set search_path = public` to defend against search path
--       manipulation, and
--   (d) preserve the exact role list from the live function so behaviour
--       is identical for content_editor and admin users.

REVOKE EXECUTE ON FUNCTION public.is_teacher() FROM anon;

CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.app_user_roles
    WHERE user_id = auth.uid()
      AND role IN ('teacher', 'content_editor', 'admin')
  );
$$;

-- ── FIX 3: Leaked password protection ───────────────────────
-- Cannot be applied via SQL. Manual step required:
-- Supabase Dashboard → Authentication → Email
-- → Leaked Password Protection → enable.
-- Confirm done before closing this migration.

-- ── FIX 4: VITE_FAMILY_PASSWORD exposure ────────────────────
-- Cannot be applied via SQL. Handled in the repo:
--   - .gitignore already excludes .env.local
--   - .env.example updated to list VITE_FAMILY_EMAIL / VITE_FAMILY_PASSWORD
--     with empty values (no real credentials committed).
