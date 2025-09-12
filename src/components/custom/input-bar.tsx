'use client';

import { ArrowRight, Globe, MicIcon, Paperclip } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { type KeyboardEvent, useState } from 'react';

import Hint from '../ui/hint';
import SearchSuggestions from './search-suggestions';
import { Button } from '../ui/button';
import { useChat } from '@/contexts/chat-context';
import { useChatStream } from '@/hooks/use-chat-stream';

const InputBar = ({
  includeSuggestions = false,
}: {
  includeSuggestions: boolean;
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const [localMessage, setLocalMessage] = useState<string>('');

  const {
    checkpointId,
    setCheckpointId,

    createMessage,
    updateMessage,
    setMessageError,
  } = useChat();

  const { streamChat } = useChatStream({
    onContent: content => {
      updateMessage({ content, isLoading: false });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localMessage.trim()) return;

    if (pathname !== '/search') router.push('/search');

    createMessage(localMessage);
    setLocalMessage('');

    await streamChat(localMessage, checkpointId);
  };

  const handleEnterPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        setLocalMessage(prev => prev + '\n');
      } else if (localMessage.trim() !== '') {
        handleSubmit(e);
      }
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className='w-full p-5 border border-border bg-muted/25 mb-5 md:mb-0 rounded-xl mt-3 z-[100]'
      >
        <div className='flex gap-2 relative'>
          <textarea
            autoFocus
            placeholder='What do you have in mind?'
            className='outline-none bg-transparent border-transparent w-full pr-10 h-16 resize-none placeholder:text-muted-foreground'
            value={localMessage}
            onChange={e => setLocalMessage(e.target.value)}
            onKeyDown={handleEnterPress}
          />
        </div>
        <div className='flex items-center justify-between'>
          <p className='text-xs text-muted-foreground font-light'>
            Use{' '}
            <span className='bg-muted p-1 px-1.5 rounded-md text-primary'>
              Shift
            </span>{' '}
            +{' '}
            <span className='bg-muted p-1 px-1.5 rounded-md text-primary'>
              Enter
            </span>{' '}
            for a new line
          </p>
          <div className='flex gap-1'>
            <Hint label='Set sources to search'>
              <Button
                size='icon'
                variant='ghost'
                className='group cursor-pointer'
              >
                <span className='sr-only'>Set sources to search</span>
                <Globe
                  className='size-6 text-muted-foreground/70 group-hover:text-muted-foreground'
                  strokeWidth={2.5}
                />
              </Button>
            </Hint>
            <Hint label='Attach file'>
              <Button
                size='icon'
                variant='ghost'
                className='group cursor-pointer'
              >
                <span className='sr-only'>Attach file</span>
                <Paperclip
                  className='size-6 text-muted-foreground/70 group-hover:text-muted-foreground'
                  strokeWidth={2.5}
                />
              </Button>
            </Hint>
            <Hint label='Speaker mode'>
              <Button
                size='icon'
                variant='ghost'
                className='group cursor-pointer'
              >
                <span className='sr-only'>Set speaker mode on/off</span>
                <MicIcon
                  className='size-6 text-muted-foreground/70 group-hover:text-muted-foreground'
                  strokeWidth={2.5}
                />
              </Button>
            </Hint>
            <Button
              size='icon'
              variant='special'
              type='submit'
              disabled={!localMessage}
              className='cursor-pointer'
            >
              <ArrowRight className='size-6' strokeWidth={2.5} />
            </Button>
          </div>
        </div>
      </form>
      {includeSuggestions && <SearchSuggestions setSearch={setLocalMessage} />}
    </>
  );
};

export default InputBar;
