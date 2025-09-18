'use client';

import { useEffect, useRef } from 'react';
import { redirect } from 'next/navigation';

import Message from '@/components/message/message';
import { useChat } from '@/contexts/chat-context';

const MessageArea = () => {
  const { messages } = useChat();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  if (messages.length === 0) redirect('/');

  useEffect(() => {
    if (messages.length > 1)
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className='flex items-start justify-center'>
      <ul className='w-full md:max-w-3xl p-2 py-6'>
        {messages.map(
          (
            {
              id,
              type,
              content,
              search,
              sources,
              followupQuestions,
              images,
              events,
              isLoading,
              isSearching,
              isGeneratingTimeline,
            },
            i
          ) => (
            <Message
              key={id}
              id={id}
              type={type}
              search={search}
              sources={sources}
              content={content}
              events={events}
              followupQuestions={followupQuestions}
              images={images}
              isLoading={isLoading}
              isSearching={isSearching}
              isGeneratingTimeline={isGeneratingTimeline}
              isLastMessage={i + 1 === messages.length}
            />
          )
        )}
        <div ref={bottomRef} />
      </ul>
    </div>
  );
};

export default MessageArea;
