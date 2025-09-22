
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Debug: Log all available environment variables
console.log('Available env vars:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

// Detailed debugging
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables:', {
    VITE_SUPABASE_URL: SUPABASE_URL || 'NOT SET - Add this in Vercel Dashboard!',
    VITE_SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'NOT SET',
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || 'NOT SET',
    allEnvKeys: Object.keys(import.meta.env),
    MODE: import.meta.env.MODE,
    PROD: import.meta.env.PROD,
    DEV: import.meta.env.DEV
  });

  // Provide clear instructions in the console
  console.error('📍 TO FIX: Add VITE_SUPABASE_URL in Vercel Dashboard → Settings → Environment Variables');

  throw new Error('Missing VITE_SUPABASE_URL. Add it in Vercel Dashboard → Settings → Environment Variables');
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
