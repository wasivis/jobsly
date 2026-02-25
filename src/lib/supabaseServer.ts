import { createClient } from '@supabase/supabase-js';

// This client uses the SERVICE_ROLE_KEY
// It should ONLY be used in API routes, never in components.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string // Use the secret key here
);