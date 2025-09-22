import { Database } from '@/integrations/supabase/types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type BusinessUnit = Database['public']['Tables']['business_units']['Row'];
export type Licensee = Database['public']['Tables']['licensees']['Row'];
export type ReviewRequest = Database['public']['Tables']['review_requests']['Row'];
export type UserRole = Database['public']['Tables']['user_roles']['Row'];
export type AppRole = Database['public']['Enums']['app_role'];
export type SubscriptionPlan = Database['public']['Tables']['subscription_plans']['Row'];
export type Subscription = Database['public']['Tables']['subscriptions']['Row'];
export type Analytics = Database['public']['Tables']['analytics']['Row'];
export type SessionRecord = Database['public']['Tables']['session_records']['Row'];
export type ChatMessageRecord = Database['public']['Tables']['chat_messages']['Row'];
export type Provider = Database['public']['Tables']['providers']['Row'];
