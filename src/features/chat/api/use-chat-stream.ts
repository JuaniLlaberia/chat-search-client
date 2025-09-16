'use client';

import { useRef, useCallback } from 'react';
import { ChatService } from '@/services/chat-service';
import { Source } from '@/types/index';

interface UseChatStreamProps {
  onContent: (content: string) => void;
  onFollowupQuestions: (questions: string[]) => void;
  onSearchUpdate: ({
    sources,
    images,
    error,
    isSearching,
  }: {
    sources?: Source[];
    images?: string[];
    error?: string;
    isSearching?: boolean;
  }) => void;
  onCheckpoint: (checkpointId: string) => void;
  onError: (error: string) => void;
}

export const useChatStream = ({
  onContent,
  onFollowupQuestions,
  onSearchUpdate,
  onCheckpoint,
  onError,
}: UseChatStreamProps) => {
  const chatServiceRef = useRef<ChatService>(new ChatService());

  const streamChat = useCallback(
    async (
      userInput: string,
      checkpointId: string | null,
      topic: 'general' | 'news' | 'finance' = 'general'
    ) => {
      const chatService = chatServiceRef.current;

      try {
        await chatService.streamChat(userInput, checkpointId, topic, {
          onContent,
          onFollowupQuestions,
          onSearchStart: () => onSearchUpdate({ isSearching: true }),
          onSearchResults: (sources, images) =>
            onSearchUpdate({ sources, images, isSearching: false }),
          onSearchError: error => onSearchUpdate({ error, isSearching: false }),
          onEnd: () => onSearchUpdate({ isSearching: false }),
          onError: () =>
            onError('Sorry, there was an error processing your request.'),
          onCheckpoint,
        });
      } catch {
        onError('Sorry, there was an error connecting to the server.');
      }
    },
    [onContent, onFollowupQuestions, onSearchUpdate, onCheckpoint, onError]
  );

  const stopStream = useCallback(() => {
    chatServiceRef.current.close();
  }, []);

  return {
    streamChat,
    stopStream,
    isStreaming: () => chatServiceRef.current.isActive(),
  };
};
