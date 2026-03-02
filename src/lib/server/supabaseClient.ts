import { createClient } from '@supabase/supabase-js';
import type { Database } from '$types/supabase';
import { SUPABASE_ANON_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

// Service role client for server-side operations that bypass RLS
export const supabaseAdmin = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
