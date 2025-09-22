
import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, SessionPayload } from '@/types';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';
import {
  appendSessionMessage,
  ensureActiveSession,
  fetchSessionMessages,
  loadSessionPayload,
  resetSessionMessages,
  sendToWebhook,
  storeSessionMetadataLocally,
  getStoredSessionMetadata,
  clearStoredSessionMetadata,
} from '@/lib/chat-utils';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface ChatInterfaceProps {
  onReset: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onReset }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [sessionUuid, setSessionUuid] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<SessionPayload | null>(getStoredSessionMetadata());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load messages on component mount
  useEffect(() => {
    let isMounted = true;

    const bootstrapSession = async () => {
      if (!user) {
        setMessages([]);
        setSessionUuid(null);
        setSessionData(null);
        setIsInitializing(false);
        return;
      }

      setIsInitializing(true);

      try {
        const session = await ensureActiveSession();
        if (!isMounted) return;

        setSessionUuid(session.session_uuid);

        const [payload, history] = await Promise.all([
          loadSessionPayload(session.session_uuid),
          fetchSessionMessages(session.session_uuid),
        ]);

        if (!isMounted) return;

        if (payload) {
          setSessionData(payload);
          storeSessionMetadataLocally(payload);
        } else {
          const cached = getStoredSessionMetadata();
          if (cached && cached.uuid === session.session_uuid) {
            setSessionData(cached);
          } else {
            setSessionData(null);
          }
        }

        setMessages(history);
      } catch (error) {
        console.error('Failed to initialize chat session', error);
        toast({
          variant: 'destructive',
          title: 'Unable to load chat session',
          description: 'Please refresh the page or sign in again.',
        });
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };

    bootstrapSession();

    return () => {
      isMounted = false;
    };
  }, [user, toast]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = async (content: string, sender: 'user' | 'agent') => {
    if (!sessionUuid) {
      throw new Error('No active session available for messaging.');
    }

    const newMessage: Message = {
      id: uuidv4(),
      content,
      sender,
      timestamp: Date.now(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      await appendSessionMessage(sessionUuid, newMessage);
    } catch (error) {
      console.error('Failed to persist chat message', error);
      toast({
        variant: 'destructive',
        title: 'Unable to save message',
        description: 'Your message may not appear in future sessions.',
      });
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading || !sessionUuid) return;

    // Add user message
    try {
      await addMessage(content, 'user');
    } catch (error) {
      console.error('Unable to add message to session', error);
      toast({
        variant: 'destructive',
        title: 'Message failed',
        description: 'Unable to send your message right now.',
      });
      return;
    }
    setIsLoading(true);

    try {
      // Send message to webhook
      const response = await sendToWebhook({
        uuid: sessionUuid,
        message: content,
      });

      // Process response
      const agentReply = response.reply || response.output;
      
      if (agentReply) {
        setTimeout(() => {
          addMessage(agentReply, 'agent').finally(() => setIsLoading(false));
        }, 500);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
      
      toast({
        variant: 'destructive',
        title: 'Error sending message',
        description: 'There was a problem communicating with the server.',
      });
    }
  };

  const handleClearChat = async () => {
    if (!sessionUuid) {
      return;
    }

    try {
      await resetSessionMessages(sessionUuid);
      clearStoredSessionMetadata();
      setMessages([]);
      setSessionData(null);
      onReset();
    } catch (error) {
      console.error('Failed to clear chat history', error);
      toast({
        variant: 'destructive',
        title: 'Unable to clear chat',
        description: 'Please try again later.',
      });
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full text-center text-foreground/60">
        <p>Please sign in to start a conversation.</p>
      </div>
    );
  }

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-full text-center text-foreground/60">
        <p>Loading your session…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto">
      <ChatHeader onClearChat={handleClearChat} sessionData={sessionData ?? undefined} />

      <div className="flex-1 overflow-y-auto p-4 glass rounded-lg mb-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-foreground/50 text-center">
              Your conversation will appear here.<br />
              Start by sending a message below.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatInterface;
