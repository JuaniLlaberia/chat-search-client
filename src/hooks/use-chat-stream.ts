'use client';

import { useRef } from 'react';

import { ChatService } from '@/services/chat-service';
import { Source } from '@/types/index';

interface UseChatStreamProps {
  onContent: (content: string) => void;
  onSearchUpdate: ({
    sources,
    images,
    error,
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
  onSearchUpdate,
  onCheckpoint,
  onError,
}: UseChatStreamProps) => {
  const chatServiceRef = useRef<ChatService>(new ChatService());

  const streamChat = async (userInput: string, checkpointId: string | null) => {
    const chatService = chatServiceRef.current;

    try {
      await chatService.streamChat(userInput, checkpointId, {
        onContent: content => {
          onContent(content);
        },

        onSearchStart: () => {
          onSearchUpdate({ isSearching: true });
        },

        onSearchResults: (sources, images) => {
          onSearchUpdate({ sources, images, isSearching: false });
        },

        onSearchError: error => {
          onSearchUpdate({ error, isSearching: false });
        },

        onEnd: () => {
          onSearchUpdate({});
        },

        onError: () => {
          onError('Sorry, there was an error processing your request.');
        },

        onCheckpoint: checkpointId => {
          onCheckpoint(checkpointId);
        },
      });
    } catch {
      onError('Sorry, there was an error connecting to the server.');
    }
  };

  return { streamChat };
};
