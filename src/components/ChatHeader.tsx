
import React from 'react';
import { Button } from '@/components/ui/button';
import { SessionPayload } from '@/types';

interface ChatHeaderProps {
  onClearChat: () => void;
  sessionData?: SessionPayload | null;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClearChat, sessionData }) => {
  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history? This action cannot be undone.')) {
      onClearChat();
    }
  };

  return (
    <div className="flex items-center justify-between p-4 glass rounded-lg mb-4">
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold text-gradient">
          Chat with {sessionData?.clinicMode ? (sessionData?.providerName || 'Your Provider') : 'Your Clinic'}
        </h2>
        {sessionData && (
          <p className="text-xs text-foreground/70">
            Session: {sessionData.clientFirstName} • {sessionData.uuid.split('-')[0]}
          </p>
        )}
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleClearChat}
        className="text-xs"
      >
        Clear History
      </Button>
    </div>
  );
};

export default ChatHeader;
