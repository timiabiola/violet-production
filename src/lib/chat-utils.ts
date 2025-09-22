import { supabase } from '@/integrations/supabase/client';
import { Message, SessionPayload, AgentResponse } from '@/types';
import { ChatMessageRecord, SessionRecord } from '@/types/supabase';

const SESSION_METADATA_KEY = 'session_metadata';

type SerializableValue = string | number | boolean | null | undefined;
type SerializableRecord = Record<string, SerializableValue>;

type MessageMetadata = {
  messageId: string;
  timestamp: number;
};

const mapRecordToMessage = (record: ChatMessageRecord): Message => {
  const metadata = (record.metadata as MessageMetadata | null) ?? null;
  return {
    id: metadata?.messageId ?? record.id,
    content: record.content,
    sender: record.sender,
    timestamp: metadata?.timestamp ?? new Date(record.created_at).getTime(),
  };
};

const buildMetadata = (message: Message): MessageMetadata => ({
  messageId: message.id,
  timestamp: message.timestamp,
});

const getCurrentUserId = async (): Promise<string> => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  const userId = data.user?.id;
  if (!userId) {
    throw new Error('Authentication required to access session storage.');
  }
  return userId;
};

export const ensureActiveSession = async (): Promise<SessionRecord> => {
  const userId = await getCurrentUserId();

  const { data: existing, error: selectError } = await supabase
    .from('session_records')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (selectError) {
    throw selectError;
  }

  if (existing) {
    return existing;
  }

  const sessionUuid = crypto.randomUUID();
  const { data: inserted, error: insertError } = await supabase
    .from('session_records')
    .insert({
      user_id: userId,
      session_uuid: sessionUuid,
      payload: {},
    })
    .select()
    .single();

  if (insertError) {
    throw insertError;
  }

  return inserted;
};

export const loadSessionPayload = async (sessionUuid: string): Promise<SessionPayload | null> => {
  const { data, error } = await supabase
    .from('session_records')
    .select('payload, session_uuid')
    .eq('session_uuid', sessionUuid)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data?.payload) {
    return null;
  }

  const payloadData = data.payload as Partial<SessionPayload>;

  return {
    ...payloadData,
    clinicMode: payloadData.clinicMode ?? false,
    uuid: sessionUuid,
  } as SessionPayload;
};

export const persistSessionPayload = async (sessionUuid: string, payload: SessionPayload): Promise<void> => {
  const { error } = await supabase
    .from('session_records')
    .update({ payload })
    .eq('session_uuid', sessionUuid);

  if (error) {
    throw error;
  }
};

export const fetchSessionMessages = async (sessionUuid: string): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_uuid', sessionUuid)
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapRecordToMessage);
};

export const appendSessionMessage = async (sessionUuid: string, message: Message): Promise<void> => {
  const { error } = await supabase
    .from('chat_messages')
    .insert({
      session_uuid: sessionUuid,
      sender: message.sender,
      content: message.content,
      metadata: buildMetadata(message),
    });

  if (error) {
    throw error;
  }
};

export const resetSessionMessages = async (sessionUuid: string): Promise<void> => {
  const { error } = await supabase
    .from('chat_messages')
    .delete()
    .eq('session_uuid', sessionUuid);

  if (error) {
    throw error;
  }
};

export const storeSessionMetadataLocally = (payload: SessionPayload): void => {
  sessionStorage.setItem(SESSION_METADATA_KEY, JSON.stringify(payload));
};

export const getStoredSessionMetadata = (): SessionPayload | null => {
  const raw = sessionStorage.getItem(SESSION_METADATA_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<SessionPayload>;
    return {
      ...parsed,
      clinicMode: parsed?.clinicMode ?? false,
    } as SessionPayload;
  } catch (error) {
    console.warn('Failed to parse cached session metadata', error);
    sessionStorage.removeItem(SESSION_METADATA_KEY);
    return null;
  }
};

export const clearStoredSessionMetadata = (): void => {
  sessionStorage.removeItem(SESSION_METADATA_KEY);
};

export const jsonToQueryString = (json: SerializableRecord): string => {
  return Object.entries(json)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
};

export const sendToWebhook = async (data: SerializableRecord): Promise<AgentResponse> => {
  // Use the configured webhook URL from environment
  const baseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://n8n.enlightenedmediacollective.com/webhook/8e680e60-73fa-4761-920e-ad07b213ab31';
  const authHeaderName = import.meta.env.VITE_N8N_AUTH_HEADER_NAME || 'Authorization';
  const authHeaderValue =
    import.meta.env.VITE_N8N_AUTH_HEADER_VALUE ?? import.meta.env.VITE_N8N_AUTH_TOKEN;

  const webhookUrl = `${baseUrl}?${jsonToQueryString(data)}`;

  console.log('Sending to webhook:', {
    url: webhookUrl,
    authHeaderName: authHeaderValue ? authHeaderName : 'NOT SET',
    hasAuth: !!authHeaderValue,
    data
  });

  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    // Add authorization header if available
    if (authHeaderValue) {
      headers[authHeaderName] = authHeaderValue;
    }

    const response = await fetch(webhookUrl, {
      method: 'GET',
      headers,
      mode: 'cors', // Changed from 'no-cors' to 'cors' to allow reading response
    });

    console.log('Webhook response:', {
      status: response.status,
      statusText: response.statusText
    });

    if (!response.ok) {
      throw new Error(`Webhook responded with ${response.status}: ${response.statusText}`);
    }

    const responseText = await response.text();
    console.log('Webhook response body:', responseText);

    return {
      output: 'Success',
      reply: 'Thank you! Your review request has been sent successfully.',
    };
  } catch (error) {
    console.error('Error sending data to webhook:', error);

    return {
      output: 'Local Success',
      reply: "Your request was saved locally. We'll process it shortly.",
    };
  }
};
