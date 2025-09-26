import { supabase } from '@/integrations/supabase/client';

export async function checkAndSetupOnboarding() {
  try {
    // Check if onboarding columns exist by trying to query them
    const { data, error } = await supabase
      .from('profiles')
      .select('id, business_name, google_review_url, onboarding_completed, onboarding_step')
      .limit(1);

    if (error) {
      // If columns don't exist, we'll get an error
      console.log('Onboarding columns may not exist:', error.message);

      // Try to add the columns via SQL (this requires admin access)
      // In production, this would be handled by migrations
      const { error: alterError } = await supabase.rpc('setup_onboarding_columns', {});

      if (alterError) {
        console.log('Could not auto-create columns:', alterError);
        // Fall back to using existing profile structure
        return false;
      }
    }

    return true;
  } catch (err) {
    console.error('Error checking onboarding setup:', err);
    return false;
  }
}

// Helper to check if a user needs onboarding
export async function checkUserNeedsOnboarding(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error checking user profile:', error);
      return false;
    }

    // Check if onboarding fields exist
    if ('onboarding_completed' in data) {
      return !data.onboarding_completed;
    }

    // Fall back to checking if business_name is empty
    // For existing users without the new columns
    const hasBusinessInfo = data.business_name || data.google_review_url;
    return !hasBusinessInfo;
  } catch (err) {
    console.error('Error in checkUserNeedsOnboarding:', err);
    return false;
  }
}