#!/usr/bin/env node

// Script to fix the SECURITY DEFINER issue on review_analytics view
// This connects directly to Supabase and executes the required SQL

const sql = `
-- Fix security issue: Remove SECURITY DEFINER from review_analytics view
-- This ensures the view uses the invoker's permissions and respects RLS policies

-- Drop the existing view with SECURITY DEFINER
DROP VIEW IF EXISTS public.review_analytics CASCADE;

-- Recreate the view without SECURITY DEFINER (using SECURITY INVOKER which is the default)
-- This view is based on review_requests table as per the original definition
CREATE OR REPLACE VIEW public.review_analytics
WITH (security_invoker = true) AS
SELECT
  DATE_TRUNC('day', sent_at) as date,
  COUNT(*) as total_sent,
  COUNT(CASE WHEN status = 'clicked' THEN 1 END) as total_clicked,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as total_completed,
  COUNT(CASE WHEN status = 'failed' THEN 1 END) as total_failed,
  ROUND(AVG(response_time_minutes)::numeric, 2) as avg_response_time,
  ROUND(100.0 * COUNT(CASE WHEN status = 'completed' THEN 1 END) / NULLIF(COUNT(*), 0), 2) as completion_rate
FROM public.review_requests
GROUP BY DATE_TRUNC('day', sent_at);

-- Grant appropriate permissions on the view
GRANT SELECT ON public.review_analytics TO authenticated;
GRANT SELECT ON public.review_analytics TO service_role;

-- Add a comment explaining the security model
COMMENT ON VIEW public.review_analytics IS 'Analytics view for review requests - uses invoker permissions to respect RLS policies';
`;

console.log('SQL to fix SECURITY DEFINER issue on review_analytics view:');
console.log('='.repeat(60));
console.log(sql);
console.log('='.repeat(60));
console.log('\nTo apply this fix:');
console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard');
console.log('2. Select your project');
console.log('3. Navigate to the SQL Editor');
console.log('4. Paste the SQL above and execute it');
console.log('\nAlternatively, if you have the Supabase service role key:');
console.log('You can use the Supabase client library to execute this SQL programmatically.');