'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { useChat } from '@/contexts/chat-context';
import { useChatStream } from './use-chat-stream';

interface UseChatActionsOptions {
  redirectPath?: string;
  topic?: 'general' | 'news' | 'finance';
  mode?: 'informative' | 'timeline';
  autoRedirect?: boolean;
}

export const useChatActions = (options: UseChatActionsOptions = {}) => {
  const router = useRouter();
  const {
    checkpointId,
    setCheckpointId,
    createMessage,
    updateMessage,
    setMessageError,
    isLoading,
    messages,
    clearMessages,
  } = useChat();

  const { streamChat, stopStream, isStreaming } = useChatStream({
    onContent: content => {
      updateMessage({ content, isLoading: false });
    },
    onFollowupQuestions: questions => {
      updateMessage({ followupQuestions: questions });
    },
    onTimelineUpdate: ({ events, isGeneratingTimeline }) => {
      updateMessage({ events, isGeneratingTimeline });
    },
    onSearchUpdate: searchInfo => {
      updateMessage({ ...searchInfo });
    },
    onCheckpoint: newCheckpointId => {
      setCheckpointId(newCheckpointId);
    },
    onError: errorMessage => {
      setMessageError(errorMessage);
    },
  });

  const sendMessage = useCallback(
    async (
      message: string,
      customTopic?: 'general' | 'news' | 'finance',
      mode: 'informative' | 'timeline' = 'informative'
    ) => {
      if (!message.trim()) {
        throw new Error('Message cannot be empty');
      }

      const { redirectPath = '/search', autoRedirect = true } = options;
      if (
        autoRedirect &&
        redirectPath &&
        window.location.pathname !== redirectPath
      ) {
        router.push(redirectPath);
      }

      createMessage(message, mode);

      try {
        await streamChat(
          message,
          checkpointId,
          customTopic || options.topic || 'general',
          mode || options.mode || 'informative'
        );
      } catch (error) {
        setMessageError('Failed to send message');
        throw error;
      }
    },
    [router, createMessage, streamChat, checkpointId, setMessageError, options]
  );

  const retryLastMessage = useCallback(() => {
    if (messages.length === 0) return;
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.search) {
      sendMessage(lastMessage.search);
    }
  }, [messages, sendMessage]);

  return {
    // State
    messages,
    isLoading,
    checkpointId,
    isStreaming: isStreaming(),

    // Actions
    sendMessage,
    retryLastMessage,
    stopStream,
    clearMessages,

    // Direct access if needed
    createMessage,
    updateMessage,
    setMessageError,
  };
};
