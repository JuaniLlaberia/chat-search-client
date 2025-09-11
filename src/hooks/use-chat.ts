'use client';

import { useState } from 'react';
import { Message } from '@/types';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      content: 'Hi there, how can I help you?',
      isUser: false,
      type: 'message',
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [checkpointId, setCheckpointId] = useState<string | null>(null);

  const addUserMessage = (content: string) => {
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      content,
      isUser: true,
      type: 'message',
    };

    setMessages(prev => [...prev, userMessage]);
  };

  const addAIMessagePlaceholder = () => {
    const aiMessage: Message = {
      id: `ai_${Date.now()}`,
      content: '',
      isUser: false,
      type: 'message',
      isLoading: true,
      searchInfo: {
        stages: [],
        query: '',
        urls: [],
      },
    };

    setMessages(prev => [...prev, aiMessage]);
  };

  const updateLastAIMessage = (updates: Partial<Message>) => {
    setMessages(prev => {
      const newMessages = [...prev];
      // Find the last AI message (non-user message)
      for (let i = newMessages.length - 1; i >= 0; i--) {
        if (!newMessages[i].isUser) {
          newMessages[i] = { ...newMessages[i], ...updates };
          break;
        }
      }
      return newMessages;
    });
  };

  const setLastAIMessageError = (errorContent: string) => {
    updateLastAIMessage({
      content: errorContent,
      isLoading: false,
    });
  };

  return {
    messages,
    currentMessage,
    setCurrentMessage,
    checkpointId,
    setCheckpointId,
    addUserMessage,
    addAIMessagePlaceholder,
    updateLastAIMessage,
    setLastAIMessageError,
  };
};
