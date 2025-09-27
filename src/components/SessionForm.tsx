import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader } from "lucide-react";
import { SessionFormData, SessionPayload } from "@/types";
import {
  ensureActiveSession,
  persistSessionPayload,
  sendToWebhook,
  storeSessionMetadataLocally,
} from "@/lib/chat-utils";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Provider } from "@/types/supabase";

interface SessionFormProps {
  onFormSuccess?: () => void;
}

const formSchema = z.object({
  clientFirstName: z
    .string()
    .min(1, {
      message: "First name is required",
    })
    .max(30, {
      message: "First name must be 30 characters or less",
    }),
  phoneNumber: z.string().min(1, {
    message: "Phone number is required",
  }),
  providerId: z.string().optional(),
});

const SessionForm: React.FC<SessionFormProps> = ({ onFormSuccess }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSettingsLoading, setIsSettingsLoading] = React.useState(true);
  const [profileSettings, setProfileSettings] = React.useState({
    clinicMode: false,
    businessName: "",
    googleReviewUrl: "",
  });
  const [providers, setProviders] = React.useState<Provider[]>([]);
  const { user } = useAuth();

  const form = useForm<SessionFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientFirstName: "",
      phoneNumber: "",
      providerId: "",
    },
  });

  React.useEffect(() => {
    const loadSettings = async () => {
      if (!user) {
        setProfileSettings({ clinicMode: false, businessName: "", googleReviewUrl: "" });
        setProviders([]);
        setIsSettingsLoading(false);
        return;
      }

      setIsSettingsLoading(true);

      try {
        const [profileResponse, providersResponse] = await Promise.all([
          supabase
            .from("profiles")
            .select("business_name, google_review_url, provider_mode_enabled")
            .eq("id", user.id)
            .maybeSingle(),
          supabase
            .from("providers")
            .select("id, name, user_id, created_at")
            .eq("user_id", user.id)
            .order("name", { ascending: true }),
        ]);

        if (profileResponse.error) {
          if (profileResponse.error.code !== "PGRST116") {
            console.error("Failed to load profile settings:", profileResponse.error);
          }
        } else if (profileResponse.data) {
          setProfileSettings({
            clinicMode: profileResponse.data.provider_mode_enabled ?? false,
            businessName: profileResponse.data.business_name ?? "",
            googleReviewUrl: profileResponse.data.google_review_url ?? "",
          });
        } else {
          setProfileSettings({ clinicMode: false, businessName: "", googleReviewUrl: "" });
        }

        if (providersResponse.error) {
          console.error("Failed to load provider list:", providersResponse.error);
          setProviders([]);
        } else {
          setProviders(providersResponse.data ?? []);
        }
      } catch (error) {
        console.error("Unexpected error loading session settings", error);
        setProviders([]);
      } finally {
        setIsSettingsLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  const onSubmit = async (formValues: SessionFormData) => {
    setIsSubmitting(true);
    try {
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in to submit review requests.",
        });
        return;
      }

      if (profileSettings.clinicMode && providers.length === 0) {
        toast({
          variant: "destructive",
          title: "Providers required",
          description: "Add providers in your profile settings before sending review requests.",
        });
        return;
      }

      if (profileSettings.clinicMode && !formValues.providerId) {
        form.setError("providerId", {
          type: "manual",
          message: "Please select a provider",
        });
        toast({
          variant: "destructive",
          title: "Provider required",
          description: "Select a provider before sending the review request.",
        });
        return;
      }

      const selectedProvider = profileSettings.clinicMode
        ? providers.find((provider) => provider.id === formValues.providerId)
        : undefined;

      if (profileSettings.clinicMode && !selectedProvider) {
        toast({
          variant: "destructive",
          title: "Provider not found",
          description: "Select a valid provider before submitting the form.",
        });
        return;
      }

      const session = await ensureActiveSession();
      const requestUniqueKey = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${session.session_uuid}-${Date.now()}`;

      const sanitizedFormData: SessionFormData = {
        clientFirstName: formValues.clientFirstName,
        phoneNumber: formValues.phoneNumber,
        providerId: profileSettings.clinicMode ? formValues.providerId : undefined,
      };

      const payload: SessionPayload = {
        ...sanitizedFormData,
        uuid: session.session_uuid,
        providerName: selectedProvider?.name,
        clinicMode: profileSettings.clinicMode,
        businessName: profileSettings.businessName || undefined,
        googleReviewUrl: profileSettings.googleReviewUrl || undefined,
      };

      await persistSessionPayload(session.session_uuid, payload);
      storeSessionMetadataLocally(payload);

      try {
        const reviewRequestInsert: Record<string, unknown> = {
          patient_name: sanitizedFormData.clientFirstName,
          phone_number: sanitizedFormData.phoneNumber,
          created_by: user.id,
          unique_key: requestUniqueKey,
          status: "sent",
          sent_at: new Date().toISOString(),
        };

        if (profileSettings.clinicMode && selectedProvider?.name) {
          reviewRequestInsert.physician_name = selectedProvider.name;
        }

        const { error: reviewRequestError } = await supabase
          .from("review_requests")
          .insert(reviewRequestInsert);

        if (reviewRequestError) {
          console.error("Failed to track review request:", reviewRequestError);
        }

        const analyticsPayload = {
          user_id: user.id,
          event: "review_request_sent",
          metadata: {
            clinic_mode: profileSettings.clinicMode,
            provider: selectedProvider?.name ?? null,
            has_google_url: !!profileSettings.googleReviewUrl,
          },
        };

        const { error: analyticsError } = await supabase
          .from("analytics")
          .insert(analyticsPayload);

        if (analyticsError) {
          console.error("Analytics tracking error:", analyticsError);
        }
      } catch (error) {
        console.error("Analytics tracking error:", error);
      }

      try {
        const webhookPayload: Record<string, string | boolean> = {
          uuid: payload.uuid,
          client_first_name: payload.clientFirstName,
          phone_number: payload.phoneNumber,
          clinic_mode: payload.clinicMode ? "on" : "off",
        };

        if (payload.clinicMode && payload.providerName) {
          webhookPayload.provider_name = payload.providerName;
        }
        if (payload.businessName) {
          webhookPayload.business_name = payload.businessName;
        }
        if (payload.googleReviewUrl) {
          webhookPayload.google_review_url = payload.googleReviewUrl;
        }

        await sendToWebhook(webhookPayload);

        toast({
          title: "Review Request Sent",
        });
      } catch (error) {
        console.log("Webhook failed, but data saved locally:", error);
        toast({
          title: "Review Request Sent",
        });
      }

      form.reset({ clientFirstName: "", phoneNumber: "", providerId: "" });

      if (onFormSuccess) {
        onFormSuccess();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Error submitting review request",
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitDisabled =
    isSubmitting ||
    isSettingsLoading ||
    (profileSettings.clinicMode && providers.length === 0);

  return (
    <Card className="w-full max-w-lg glass animate-fade-in">
      <CardHeader className="relative">
        <CardTitle className="text-gradient text-3xl font-bold text-center">
          Violet the Curious
        </CardTitle>
        <CardDescription className="text-center">
          Submit a review request to your {profileSettings.clinicMode ? "patient" : "customer"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="clientFirstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Magnus"
                      {...field}
                      disabled={isSettingsLoading || isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="555-555-5555"
                      {...field}
                      disabled={isSettingsLoading || isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {profileSettings.clinicMode && (
              <FormField
                control={form.control}
                name="providerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provider</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      value={field.value || ""}
                      disabled={isSettingsLoading || isSubmitting || providers.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={providers.length === 0 ? "No providers available" : "Select a provider"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {providers.map((provider) => (
                          <SelectItem key={provider.id} value={provider.id}>
                            {provider.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {providers.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        Add providers from your profile settings page to enable clinic mode submissions.
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit" className="w-full" disabled={isSubmitDisabled}>
              {isSubmitting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Submit Review Request"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center text-xs text-foreground/50">
        <p>All information is encrypted and securely transmitted</p>
      </CardFooter>
    </Card>
  );
};

export default SessionForm;
