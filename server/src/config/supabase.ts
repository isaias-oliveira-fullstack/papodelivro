import { createClient, SupabaseClient } from '@supabase/supabase-js';

const rawSupabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseUrl = rawSupabaseUrl
  ? rawSupabaseUrl.replace(/^https?:\/\/db\./i, 'https://')
  : undefined;

let supabase: SupabaseClient | null = null;

if (rawSupabaseUrl && rawSupabaseUrl !== supabaseUrl) {
  console.warn(
    `[Supabase] SUPABASE_URL parece usar prefixo inválido 'db.'; normalizando para ${supabaseUrl}`
  );
}

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('[Supabase] Variáveis de ambiente SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configuradas.');
}

export { supabase };
