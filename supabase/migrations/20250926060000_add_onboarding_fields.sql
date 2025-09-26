-- Add onboarding fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS business_name TEXT,
ADD COLUMN IF NOT EXISTS google_review_url TEXT,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 0;

-- Add check constraint for valid onboarding_step values (0-4)
ALTER TABLE public.profiles
ADD CONSTRAINT check_onboarding_step CHECK (onboarding_step >= 0 AND onboarding_step <= 4);

-- Create index for faster onboarding status queries
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_status
ON public.profiles(onboarding_completed);

-- Update RLS policies to allow users to update their own onboarding fields
CREATE POLICY "Users can update own onboarding fields" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);