'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { Message } from '@/types';

interface ChatContextType {
  messages: Message[];
  currentMessage: string;
  setCurrentMessage: (message: string) => void;
  checkpointId: string | null;
  setCheckpointId: (id: string | null) => void;
  isLoading: boolean;

  createMessage: (search: string) => void;
  updateMessage: (updates: Partial<Message>) => void;
  setMessageError: (errorContent: string) => void;
  clearMessages: () => void;
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
  const [isLoading, setIsLoading] = useState(false);

  const createMessage = useCallback((search: string) => {
    setCurrentMessage(search);
    setIsLoading(true);

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
  }, []);

  const updateMessage = useCallback((updates: Partial<Message>) => {
    setMessages(prev => {
      if (prev.length === 0) return prev;

      const newMessages = [...prev];
      const lastMessage = newMessages[newMessages.length - 1];
      newMessages[newMessages.length - 1] = {
        ...lastMessage,
        ...updates,
      };

      return newMessages;
    });

    if ('isLoading' in updates) {
      setIsLoading(updates.isLoading ?? false);
    }
  }, []);

  const setMessageError = useCallback(
    (errorContent: string) => {
      updateMessage({
        content: errorContent,
        isLoading: false,
      });
      setIsLoading(false);
    },
    [updateMessage]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentMessage('');
    setIsLoading(false);
  }, []);

  const value = useMemo<ChatContextType>(
    () => ({
      messages,
      currentMessage,
      setCurrentMessage,
      checkpointId,
      setCheckpointId,
      isLoading,
      createMessage,
      updateMessage,
      setMessageError,
      clearMessages,
    }),
    [
      messages,
      currentMessage,
      checkpointId,
      isLoading,
      createMessage,
      updateMessage,
      setMessageError,
      clearMessages,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
