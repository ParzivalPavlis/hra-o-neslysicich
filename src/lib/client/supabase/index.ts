import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { type Database } from '$types/supabase';
import { createBrowserClient } from '@supabase/ssr';

export const supabaseBrowserClient = createBrowserClient<Database>(
	PUBLIC_SUPABASE_URL,
	PUBLIC_SUPABASE_ANON_KEY
);
