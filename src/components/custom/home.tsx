'use client';

import InputBar from '@/components/custom/input-bar';
import MessageArea from '@/components/custom/message-area';
import { useChat } from '@/hooks/use-chat';
import { useChatStream } from '@/hooks/use-chat-stream';

const Home = () => {
  const {
    messages,
    currentMessage,
    setCurrentMessage,
    checkpointId,
    setCheckpointId,
    addUserMessage,
    addAIMessagePlaceholder,
    updateLastAIMessage,
    setLastAIMessageError,
  } = useChat();

  const { streamChat } = useChatStream({
    onContent: content => {
      updateLastAIMessage({ content, isLoading: false });
    },
    onSearchUpdate: searchInfo => {
      updateLastAIMessage({ searchInfo });
    },
    onCheckpoint: newCheckpointId => {
      setCheckpointId(newCheckpointId);
    },
    onError: errorMessage => {
      setLastAIMessageError(errorMessage);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentMessage.trim()) {
      const userInput = currentMessage;

      // Add user message
      addUserMessage(userInput);
      setCurrentMessage('');

      // Add AI placeholder
      addAIMessagePlaceholder();

      // Start streaming
      await streamChat(userInput, checkpointId);
    }
  };

  return (
    <div className='flex justify-center bg-[#0A0A0A] min-h-screen py-8 px-4'>
      <div className='w-[70%] flex flex-col h-[90vh]'>
        <MessageArea messages={messages} />
        <InputBar
          currentMessage={currentMessage}
          setCurrentMessage={setCurrentMessage}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Home;
