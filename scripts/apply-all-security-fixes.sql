-- ============================================
-- COMBINED SECURITY FIXES FOR VIOLET PRODUCTION
-- ============================================
-- Run this script in Supabase SQL Editor to apply all security fixes at once

-- ============================================
-- 1. FIX FUNCTION SEARCH PATHS
-- ============================================

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    INSERT INTO public.profiles (id, updated_at)
    VALUES (new.id, now())
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$;

COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates a profile for new users. Uses SECURITY DEFINER with fixed search_path for security.';

-- Fix calculate_response_time function
CREATE OR REPLACE FUNCTION public.calculate_response_time()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.completed_at IS NOT NULL AND NEW.sent_at IS NOT NULL THEN
    NEW.response_time_minutes := EXTRACT(EPOCH FROM (NEW.completed_at - NEW.sent_at)) / 60;
  END IF;
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.calculate_response_time() IS 'Calculates response time in minutes when a review request is completed. Uses fixed search_path for security.';

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.update_updated_at_column() IS 'Updates the updated_at column on row modifications. Uses fixed search_path for security.';

-- ============================================
-- 2. FIX SECURITY DEFINER VIEW
-- ============================================

-- Drop the existing view with SECURITY DEFINER
DROP VIEW IF EXISTS public.review_analytics CASCADE;

-- Recreate the view without SECURITY DEFINER (using SECURITY INVOKER which is the default)
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

COMMENT ON VIEW public.review_analytics IS 'Analytics view for review requests - uses invoker permissions to respect RLS policies';

-- ============================================
-- 3. VERIFICATION QUERIES
-- ============================================

-- Verify functions have search_path set
SELECT
    p.proname AS function_name,
    p.prosecdef AS security_definer,
    p.proconfig AS configuration
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname IN ('handle_new_user', 'calculate_response_time', 'update_updated_at_column');

-- Verify view is not using SECURITY DEFINER
SELECT
    schemaname,
    viewname,
    definition
FROM pg_views
WHERE schemaname = 'public'
AND viewname = 'review_analytics';

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ Security fixes applied successfully!';
    RAISE NOTICE '';
    RAISE NOTICE 'Fixed issues:';
    RAISE NOTICE '1. ✅ Function search_path set for handle_new_user';
    RAISE NOTICE '2. ✅ Function search_path set for calculate_response_time';
    RAISE NOTICE '3. ✅ Function search_path set for update_updated_at_column';
    RAISE NOTICE '4. ✅ SECURITY DEFINER removed from review_analytics view';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  MANUAL STEPS STILL REQUIRED:';
    RAISE NOTICE '1. Enable leaked password protection in Auth settings';
    RAISE NOTICE '2. Enable at least 2 MFA methods';
    RAISE NOTICE '3. Upgrade Postgres version for security patches';
    RAISE NOTICE '';
    RAISE NOTICE 'See /docs/SECURITY_FIXES.md for detailed instructions.';
END $$;