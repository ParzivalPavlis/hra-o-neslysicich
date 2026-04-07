import type { Database } from '$types/supabase';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SECRET_KEY, SUPABASE_URL } from '$env/static/private';

export const supabaseAdminClient = createClient<Database>(SUPABASE_URL, SUPABASE_SECRET_KEY, {
	auth: {
		autoRefreshToken: false,
		persistSession: false
	}
});
