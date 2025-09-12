'use client';

import { useEffect, useRef } from 'react';
import { redirect } from 'next/navigation';

import Message from './message';
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
      <ul className='w-full md:max-w-[50%] p-2 py-6'>
        {messages.map(
          (
            { id, content, search, sources, images, isLoading, isSearching },
            i
          ) => (
            <Message
              key={id}
              id={id}
              search={search}
              sources={sources}
              content={content}
              images={images}
              isLoading={isLoading}
              isSearching={isSearching}
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
