
export interface SessionFormData {
  clientFirstName: string;
  phoneNumber: string;
  providerId?: string;
}

export interface SessionPayload extends SessionFormData {
  uuid: string;
  providerName?: string;
  clinicMode: boolean;
  businessName?: string;
  googleReviewUrl?: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: number;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}

export interface AgentResponse {
  output?: string;
  reply?: string;
}
