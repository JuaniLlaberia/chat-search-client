'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Message } from '@/types';

interface ChatContextType {
  messages: Message[];
  currentMessage: string;
  setCurrentMessage: (message: string) => void;
  checkpointId: string | null;
  setCheckpointId: (id: string | null) => void;

  createMessage: (search: string) => void;
  updateMessage: (updates: Partial<Message>) => void;
  setMessageError: (errorContent: string) => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [checkpointId, setCheckpointId] = useState<string | null>(null);

  const createMessage = (search: string) => {
    setCurrentMessage(search);
    const msg: Message = {
      id: `msg_${Date.now()}`,
      type: 'message',
      isLoading: true,
      search,
      content: '',
      sources: [],
      images: [],
    };

    setMessages(prev => [...prev, msg]);
  };

  const updateMessage = (updates: Partial<Message>) => {
    setMessages(prev => {
      if (prev.length === 0) return prev;

      const newMessages = [...prev];
      newMessages[newMessages.length - 1] = {
        ...newMessages[newMessages.length - 1],
        ...updates,
      };

      return newMessages;
    });
  };

  const setMessageError = (errorContent: string) => {
    updateMessage({
      content: errorContent,
      isLoading: false,
    });
  };

  const value: ChatContextType = {
    messages,
    currentMessage,
    setCurrentMessage,
    checkpointId,
    setCheckpointId,

    createMessage,
    updateMessage,
    setMessageError,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
