import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2, User, Link, Key, AlertCircle, Plus, Trash2 } from 'lucide-react';
import AuthNavbar from '@/components/AuthNavbar';
import Footer from '@/components/Footer';
import { Provider } from '@/types/supabase';

type SupabaseLikeError = {
  message?: string;
  error?: unknown;
  details?: unknown;
};

const getErrorMessage = (error: unknown): string => {
  console.error('Full error object:', JSON.stringify(error, null, 2));

  if (error && typeof error === 'object') {
    const err = error as SupabaseLikeError;

    if (err.message) {
      const message = err.message.toLowerCase();

      if (message.includes('violates check constraint')) {
        return 'Please ensure all fields are filled correctly.';
      }
      if (message.includes('duplicate key')) {
        return 'This provider already exists. Try a different name.';
      }
      if (message.includes('network')) {
        return 'Network error. Please check your connection and try again.';
      }
      if (message.includes('permission') || message.includes('policy')) {
        return 'You do not have permission to update this profile. Please contact support.';
      }
      if (message.includes('invalid input syntax')) {
        return 'Please check that all fields are formatted correctly.';
      }
      if (message.includes('row-level security')) {
        return 'Profile access denied. Please ensure you are logged in.';
      }

      return err.message.length > 100
        ? 'An error occurred while saving your profile. Please try again.'
        : err.message;
    }

    if (err.error) {
      return getErrorMessage(err.error);
    }

    if (err.details) {
      return typeof err.details === 'string'
        ? err.details
        : 'Profile save failed. Please check your input.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please check the console for details.';
};

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [profileData, setProfileData] = useState({
    businessName: '',
    googleReviewUrl: '',
    providerModeEnabled: false,
  });
  const [providers, setProviders] = useState<Provider[]>([]);
  const [newProviderName, setNewProviderName] = useState('');
  const [isProviderSubmitting, setIsProviderSubmitting] = useState(false);
  const [providerActionId, setProviderActionId] = useState<string | null>(null);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const fetchProfile = useCallback(async () => {
    if (!user) return;

    try {
      const [profileResponse, providersResponse] = await Promise.all([
        supabase
          .from('profiles')
          .select('business_name, google_review_url, provider_mode_enabled')
          .eq('id', user.id)
          .maybeSingle(),
        supabase
          .from('providers')
          .select('id, name, user_id, created_at')
          .eq('user_id', user.id)
          .order('name', { ascending: true }),
      ]);

      if (profileResponse.error) {
        if (profileResponse.error.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileResponse.error);
        }
      } else if (profileResponse.data) {
        setProfileData({
          businessName: profileResponse.data.business_name || '',
          googleReviewUrl: profileResponse.data.google_review_url || '',
          providerModeEnabled: profileResponse.data.provider_mode_enabled ?? false,
        });
      } else {
        setProfileData({ businessName: '', googleReviewUrl: '', providerModeEnabled: false });
      }

      if (providersResponse.error) {
        console.error('Error fetching providers:', providersResponse.error);
        setProviders([]);
      } else {
        setProviders(providersResponse.data ?? []);
      }

      setHasChanges(false);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setProviders([]);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to update your profile.');
      return;
    }

    setLoading(true);

    try {
      const updates = {
        id: user.id,
        business_name: profileData.businessName,
        google_review_url: profileData.googleReviewUrl,
        provider_mode_enabled: profileData.providerModeEnabled,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        throw error;
      }

      toast.success('Profile updated successfully');
      setHasChanges(false);
      await fetchProfile();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleAddProvider = async () => {
    if (!user) {
      toast.error('Please sign in to manage providers.');
      return;
    }

    const trimmed = newProviderName.trim();
    if (!trimmed) {
      toast.error('Enter a provider name before adding.');
      return;
    }

    setIsProviderSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('providers')
        .insert({ user_id: user.id, name: trimmed })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setProviders((prev) => [...prev, data]);
      setNewProviderName('');
      toast.success('Provider added successfully');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsProviderSubmitting(false);
    }
  };

  const handleRemoveProvider = async (providerId: string) => {
    if (!user) {
      toast.error('Please sign in to manage providers.');
      return;
    }

    setProviderActionId(providerId);
    try {
      const { error } = await supabase
        .from('providers')
        .delete()
        .eq('id', providerId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setProviders((prev) => prev.filter((provider) => provider.id !== providerId));
      toast.success('Provider removed');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setProviderActionId(null);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;

      toast.success('Password updated successfully');
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <AuthNavbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security">
              <Key className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your clinic settings and provider mode</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      type="text"
                      placeholder="Your Business Name"
                      value={profileData.businessName}
                      onChange={(e) => {
                        setProfileData((prev) => ({ ...prev, businessName: e.target.value }));
                        setHasChanges(true);
                      }}
                      required
                    />
                    <p className="text-sm text-gray-600">
                      This will be included in review request notifications.
                      <span className="text-red-500"> *Required</span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="googleReviewUrl" className="flex items-center">
                      <Link className="w-4 h-4 mr-2" />
                      Google Business Profile Review URL
                    </Label>
                    <Input
                      id="googleReviewUrl"
                      type="url"
                      placeholder="https://g.page/r/your-business/review"
                      value={profileData.googleReviewUrl}
                      onChange={(e) => {
                        setProfileData((prev) => ({ ...prev, googleReviewUrl: e.target.value }));
                        setHasChanges(true);
                      }}
                    />
                    <p className="text-sm text-gray-600">
                      This URL is used to generate review links for your customers. (Optional)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="provider-mode">Clinic Mode</Label>
                    <div className="flex items-start justify-between rounded-md border border-muted bg-muted/20 p-3">
                      <div className="pr-4">
                        <p className="text-sm font-medium">Enable provider mode</p>
                        <p className="text-xs text-muted-foreground">
                          When enabled, you can manage a provider list that appears on the review request form.
                        </p>
                      </div>
                      <Switch
                        id="provider-mode"
                        checked={profileData.providerModeEnabled}
                        onCheckedChange={(checked) => {
                          setProfileData((prev) => ({ ...prev, providerModeEnabled: checked }));
                          setHasChanges(true);
                        }}
                      />
                    </div>
                  </div>

                  {profileData.providerModeEnabled && (
                    <div className="space-y-4 rounded-md border border-dashed border-muted bg-muted/10 p-4">
                      <div>
                        <h3 className="text-sm font-medium">Provider Directory</h3>
                        <p className="text-xs text-muted-foreground">
                          Add providers that should appear in the review request dropdown.
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 md:flex-row">
                        <Input
                          placeholder="Dr. Jones"
                          value={newProviderName}
                          onChange={(e) => setNewProviderName(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={handleAddProvider}
                          disabled={isProviderSubmitting || !newProviderName.trim()}
                        >
                          {isProviderSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Adding
                            </>
                          ) : (
                            <>
                              <Plus className="mr-2 h-4 w-4" />
                              Add Provider
                            </>
                          )}
                        </Button>
                      </div>

                      {providers.length === 0 ? (
                        <p className="text-xs text-muted-foreground">
                          No providers added yet. Add a provider above to get started.
                        </p>
                      ) : (
                        <ul className="space-y-2">
                          {providers.map((provider) => (
                            <li
                              key={provider.id}
                              className="flex items-center justify-between rounded-md border border-muted bg-background px-3 py-2"
                            >
                              <span className="text-sm font-medium">{provider.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveProvider(provider.id)}
                                disabled={providerActionId === provider.id}
                                aria-label={`Remove ${provider.name}`}
                              >
                                {providerActionId === provider.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {hasChanges && (
                    <div className="flex items-start gap-2 rounded-md border border-yellow-200 bg-yellow-50 p-3">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">You have unsaved changes</p>
                        <p className="text-xs text-yellow-700">
                          Click "Save Profile" to update your settings.
                        </p>
                      </div>
                    </div>
                  )}

                  <Button type="submit" disabled={loading || !hasChanges} className="w-full">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Profile'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Update your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
