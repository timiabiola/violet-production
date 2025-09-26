-- Fix search_path security issues for functions
-- Setting search_path to 'public' prevents SQL injection via search_path manipulation

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

-- Add comment explaining the security model
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

-- Add comment explaining the function
COMMENT ON FUNCTION public.calculate_response_time() IS 'Calculates response time in minutes when a review request is completed. Uses fixed search_path for security.';

-- Also fix the update_updated_at_column function if it exists
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

-- Add comment
COMMENT ON FUNCTION public.update_updated_at_column() IS 'Updates the updated_at column on row modifications. Uses fixed search_path for security.';