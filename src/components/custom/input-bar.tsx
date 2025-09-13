'use client';

import {
  ArrowRight,
  Globe,
  Landmark,
  LucideIcon,
  MicIcon,
  MicOff,
  Newspaper,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { type KeyboardEvent, useState } from 'react';

import Hint from '../ui/hint';
import SearchSuggestions from './search-suggestions';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '../ui/button';
import { useChat } from '@/contexts/chat-context';
import { useChatStream } from '@/hooks/use-chat-stream';
import { useSpeechAPI } from '@/hooks/use-speech-api';
import { Switch } from '../ui/switch';

const TOPICS: {
  title: string;
  description: string;
  value: 'general' | 'news' | 'finance';
  Icon: LucideIcon;
}[] = [
  {
    title: 'Web',
    description: 'Search the entire internet',
    value: 'general',
    Icon: Globe,
  },
  {
    title: 'News',
    description: 'Search articles and news',
    value: 'news',
    Icon: Newspaper,
  },
  {
    title: 'Finance',
    description: 'Search financial data',
    value: 'finance',
    Icon: Landmark,
  },
];

const InputBar = ({
  includeSuggestions = false,
}: {
  includeSuggestions: boolean;
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const [localMessage, setLocalMessage] = useState<string>('');
  const [topic, setTopic] = useState<'general' | 'news' | 'finance'>('general');

  const { hasRecognitionSupport, startListening, stopListening, isListening } =
    useSpeechAPI({ onTextChange: setLocalMessage });

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

    await streamChat(localMessage, checkpointId, topic);
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
            <Popover>
              <Hint label='Set source to search'>
                <PopoverTrigger asChild>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='group cursor-pointer'
                  >
                    <span className='sr-only'>Set source to search</span>
                    <Globe
                      className='size-6 text-muted-foreground/70 group-hover:text-muted-foreground'
                      strokeWidth={2.5}
                    />
                  </Button>
                </PopoverTrigger>
              </Hint>
              <PopoverContent align='end'>
                <ul className='space-y-5'>
                  {TOPICS.map(({ title, description, value, Icon }, i) => (
                    <li
                      key={i}
                      className='flex items-start justify-between gap-4 hover:cursor-pointer'
                      onClick={() => setTopic(value)}
                    >
                      <div className='flex items-start gap-2'>
                        <Icon className='size-4 mt-0.5 text-muted-foreground' />
                        <p className='flex flex-col text-xs font-medium'>
                          {title}
                          <span className='text-xs font-normal text-muted-foreground'>
                            {description}
                          </span>
                        </p>
                      </div>
                      <Switch
                        className='mt-0.5'
                        checked={topic === value}
                        onCheckedChange={() => setTopic(value)}
                      />
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
            <Hint label='Speaker mode'>
              <Button
                size='icon'
                variant='ghost'
                className='group cursor-pointer'
                onClick={e => {
                  e.preventDefault();
                  return isListening ? stopListening() : startListening();
                }}
                disabled={!hasRecognitionSupport}
              >
                <span className='sr-only'>
                  {hasRecognitionSupport
                    ? 'Set speaker mode on/off'
                    : 'You browser does not have support'}
                </span>
                {isListening ? (
                  <MicOff
                    className='size-6 text-muted-foreground/70 group-hover:text-muted-foreground'
                    strokeWidth={2.5}
                  />
                ) : (
                  <MicIcon
                    className='size-6 text-muted-foreground/70 group-hover:text-muted-foreground'
                    strokeWidth={2.5}
                  />
                )}
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
