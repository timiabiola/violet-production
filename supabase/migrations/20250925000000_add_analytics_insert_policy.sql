-- Allow authenticated users to insert analytics events tied to their user ID
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'analytics'
      AND policyname = 'Users can insert analytics events'
  ) THEN
    CREATE POLICY "Users can insert analytics events"
    ON public.analytics
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
