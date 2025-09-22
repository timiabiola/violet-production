
import React from 'react';
import { Message } from '@/types';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const timestamp = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div
      className={cn(
        "flex w-full animate-fade-in mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-xl px-4 py-3 text-sm",
          isUser
            ? "bg-primary text-primary-foreground"
            : "glass-dark"
        )}
      >
        <div className="mb-1 whitespace-pre-wrap break-words">{message.content}</div>
        <div
          className={cn(
            "text-[10px] opacity-70 text-right",
            isUser ? "text-primary-foreground" : "text-foreground"
          )}
        >
          {timestamp}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
