'use client';

import { useRef } from 'react';
import { ChatService } from '@/services/chat-service';
import { SearchInfo } from '@/types';

interface UseChatStreamProps {
  onContent: (content: string) => void;
  onSearchUpdate: (searchInfo: SearchInfo) => void;
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
  const searchDataRef = useRef<SearchInfo | null>(null);

  const streamChat = async (userInput: string, checkpointId: string | null) => {
    const chatService = chatServiceRef.current;

    try {
      // Reset search data for new stream
      searchDataRef.current = null;

      await chatService.streamChat(userInput, checkpointId, {
        onContent: content => {
          onContent(content);
        },

        onSearchStart: query => {
          const newSearchInfo: SearchInfo = {
            stages: ['searching'],
            query,
            urls: [],
          };
          searchDataRef.current = newSearchInfo;
          onSearchUpdate(newSearchInfo);
        },

        onSearchResults: urls => {
          const newSearchInfo: SearchInfo = {
            stages: searchDataRef.current
              ? [...searchDataRef.current.stages, 'reading']
              : ['reading'],
            query: searchDataRef.current?.query || '',
            urls,
          };
          searchDataRef.current = newSearchInfo;
          onSearchUpdate(newSearchInfo);
        },

        onSearchError: error => {
          const newSearchInfo: SearchInfo = {
            stages: searchDataRef.current
              ? [...searchDataRef.current.stages, 'error']
              : ['error'],
            query: searchDataRef.current?.query || '',
            urls: [],
            error,
          };
          searchDataRef.current = newSearchInfo;
          onSearchUpdate(newSearchInfo);
        },

        onEnd: () => {
          if (searchDataRef.current) {
            const finalSearchInfo: SearchInfo = {
              ...searchDataRef.current,
              stages: [...searchDataRef.current.stages, 'writing'],
            };
            onSearchUpdate(finalSearchInfo);
          }

          // Reset for next conversation
          searchDataRef.current = null;
        },

        onError: () => {
          onError('Sorry, there was an error processing your request.');
        },

        onCheckpoint: checkpointId => {
          onCheckpoint(checkpointId);
        },
      });
    } catch (error) {
      console.error('Error setting up EventSource:', error);
      onError('Sorry, there was an error connecting to the server.');
    }
  };

  return { streamChat };
};
