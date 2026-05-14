-- Secure Supabase RLS Policies for public schema
-- This script enables Row Level Security and applies least-privilege policies
-- for the listed tables. Use with Supabase-compatible PostgreSQL.

-- 1) Disable public exposure completely where not needed
ALTER TABLE public."SequelizeMeta" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."SequelizeMeta" FORCE ROW LEVEL SECURITY;

CREATE POLICY sequelize_meta_no_access
  ON public."SequelizeMeta"
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- 2) Secure users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users FORCE ROW LEVEL SECURITY;

-- Do not allow password to be selected via public/authenticated roles.
REVOKE SELECT (password) ON public.users FROM PUBLIC;
REVOKE SELECT (password) ON public.users FROM authenticated;
REVOKE SELECT (password) ON public.users FROM anon;

-- NOTE: If your 'id' column is INTEGER but auth.uid() returns UUID, 
-- you may need to use a different column (e.g., 'auth_id' or similar UUID column)
-- OR cast auth.uid() to text. Adjust the column name below if needed.

CREATE POLICY users_select_own
  ON public.users
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND id::text = auth.uid()::text);

CREATE POLICY users_update_own
  ON public.users
  FOR UPDATE
  USING (auth.uid() IS NOT NULL AND id::text = auth.uid()::text)
  WITH CHECK (auth.uid() IS NOT NULL AND id::text = auth.uid()::text);

-- No public/anonymous access to users rows is allowed.

-- 3) Secure books table
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books FORCE ROW LEVEL SECURITY;

CREATE POLICY books_select_public
  ON public.books
  FOR SELECT
  USING (true);

CREATE POLICY books_insert_authenticated
  ON public.books
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id::text = auth.uid()::text);

CREATE POLICY books_update_owner
  ON public.books
  FOR UPDATE
  USING (auth.uid() IS NOT NULL AND user_id::text = auth.uid()::text)
  WITH CHECK (auth.uid() IS NOT NULL AND user_id::text = auth.uid()::text);

CREATE POLICY books_delete_owner
  ON public.books
  FOR DELETE
  USING (auth.uid() IS NOT NULL AND user_id::text = auth.uid()::text);

-- 4) Secure reviews table
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews FORCE ROW LEVEL SECURITY;

CREATE POLICY reviews_select_own
  ON public.reviews
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND user_id::text = auth.uid()::text);

CREATE POLICY reviews_insert_own
  ON public.reviews
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id::text = auth.uid()::text);

CREATE POLICY reviews_update_own
  ON public.reviews
  FOR UPDATE
  USING (auth.uid() IS NOT NULL AND user_id::text = auth.uid()::text)
  WITH CHECK (auth.uid() IS NOT NULL AND user_id::text = auth.uid()::text);

CREATE POLICY reviews_delete_own
  ON public.reviews
  FOR DELETE
  USING (auth.uid() IS NOT NULL AND user_id::text = auth.uid()::text);

-- 5) Secure favorites table
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites FORCE ROW LEVEL SECURITY;

CREATE POLICY favorites_select_own
  ON public.favorites
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND user_id::text = auth.uid()::text);

CREATE POLICY favorites_insert_own
  ON public.favorites
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id::text = auth.uid()::text);

CREATE POLICY favorites_update_own
  ON public.favorites
  FOR UPDATE
  USING (auth.uid() IS NOT NULL AND user_id::text = auth.uid()::text)
  WITH CHECK (auth.uid() IS NOT NULL AND user_id::text = auth.uid()::text);

CREATE POLICY favorites_delete_own
  ON public.favorites
  FOR DELETE
  USING (auth.uid() IS NOT NULL AND user_id::text = auth.uid()::text);

-- 6) Secure messages table (contact form submissions)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages FORCE ROW LEVEL SECURITY;

-- Messages are created by authenticated users
CREATE POLICY messages_insert_own
  ON public.messages
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id::text = auth.uid()::text);

-- Users can only see their own messages
CREATE POLICY messages_select_own
  ON public.messages
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND user_id::text = auth.uid()::text);

-- Users can only delete their own messages
CREATE POLICY messages_delete_own
  ON public.messages
  FOR DELETE
  USING (auth.uid() IS NOT NULL AND user_id::text = auth.uid()::text);

-- Admin can read all (via service_role)

-- 7) Secure summaries table
ALTER TABLE public.summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.summaries FORCE ROW LEVEL SECURITY;

CREATE POLICY summaries_select_own
  ON public.summaries
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND user_id::text = auth.uid()::text
  );

-- If summaries are meant to be publicly readable, add a policy such as:
-- CREATE POLICY summaries_select_public ON public.summaries FOR SELECT USING (is_public = true);

CREATE POLICY summaries_insert_own
  ON public.summaries
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id::text = auth.uid()::text);

CREATE POLICY summaries_update_own
  ON public.summaries
  FOR UPDATE
  USING (auth.uid() IS NOT NULL AND user_id::text = auth.uid()::text)
  WITH CHECK (auth.uid() IS NOT NULL AND user_id::text = auth.uid()::text);

CREATE POLICY summaries_delete_own
  ON public.summaries
  FOR DELETE
  USING (auth.uid() IS NOT NULL AND user_id::text = auth.uid()::text);

-- 8) Secure password reset tokens
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_tokens FORCE ROW LEVEL SECURITY;

CREATE POLICY password_reset_tokens_no_access
  ON public.password_reset_tokens
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- 9) Optional security guard: remove default anonymous access to sensitive tables
-- Uncomment and adjust if your Supabase project granted default SELECT on these tables.
-- REVOKE SELECT ON public.users FROM PUBLIC;
-- REVOKE SELECT ON public.password_reset_tokens FROM PUBLIC;
-- REVOKE SELECT ON public.messages FROM PUBLIC;
-- REVOKE SELECT ON public.reviews FROM PUBLIC;
-- REVOKE SELECT ON public.favorites FROM PUBLIC;
-- REVOKE SELECT ON public.summaries FROM PUBLIC;

-- Notes:
--  * auth.uid() must be available from Supabase JWT context.
--  * service_role bypasses RLS; keep service_role keys secret.
--  * For users.password, the safest production path is to remove the column entirely or
--    replace it with a bcrypt-hashed password and never expose it through PostgREST.
