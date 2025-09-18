'use client';

import {
  ArrowRight,
  CalendarRange,
  Check,
  Globe,
  Landmark,
  LucideIcon,
  MicIcon,
  MicOff,
  Newspaper,
  Search,
  Shapes,
  X,
} from 'lucide-react';
import { type KeyboardEvent, useState } from 'react';

import Hint from '../ui/hint';
import SearchSuggestions from './search-suggestions';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '../ui/button';
import { useSpeechAPI } from '@/hooks/use-speech-api';
import { Switch } from '../ui/switch';
import { useChatActions } from '@/features/chat/api/use-chat-actions';
import { cn } from '@/lib/utils';

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

const MODES: {
  title: string;
  description: string;
  value: 'informative' | 'timeline';
  Icon: LucideIcon;
}[] = [
  {
    title: 'Informative',
    description: 'Answers for questions and searches',
    value: 'informative',
    Icon: Search,
  },
  {
    title: 'Timeline',
    description: 'Build a timeline containing detailed events',
    value: 'timeline',
    Icon: CalendarRange,
  },
];

const InputBar = ({
  includeSuggestions = false,
}: {
  includeSuggestions: boolean;
}) => {
  const [input, setInput] = useState<string>('');
  const [topic, setTopic] = useState<'general' | 'news' | 'finance'>('general');
  const [mode, setMode] = useState<'informative' | 'timeline'>('informative');

  const { hasRecognitionSupport, startListening, stopListening, isListening } =
    useSpeechAPI({ onTextChange: setInput });

  const { sendMessage, isLoading } = useChatActions({
    topic,
    mode,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      await sendMessage(input, topic, mode);
      setInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleEnterPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        setInput(prev => prev + '\n');
      } else if (input.trim() !== '') {
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
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleEnterPress}
          />
        </div>
        <div className='flex items-center justify-end md:justify-between'>
          <p className='text-xs text-muted-foreground font-light hidden md:block'>
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
            {mode !== 'informative' && (
              <div className='flex items-center'>
                <div className='flex items-center justify-between gap-3 text-sm border rounded-lg border-purple-700 bg-purple-800/20 py-0.5 px-2 mr-2'>
                  <div className='flex items-center gap-2'>
                    <CalendarRange className='size-4 text-muted-foreground' />
                    <p>Timeline</p>
                  </div>
                  <button
                    className='text-muted-foreground p-1   hover:bg-purple-800/30 rounded hover:cursor-pointer'
                    onClick={() => setMode('informative')}
                  >
                    <X className='size-4' />
                  </button>
                </div>
              </div>
            )}
            <Popover>
              <Hint label='Change mode'>
                <PopoverTrigger asChild>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='group cursor-pointer'
                  >
                    <span className='sr-only'>Change chat mode</span>
                    <Shapes
                      className='size-6 text-muted-foreground/70 group-hover:text-muted-foreground'
                      strokeWidth={2.5}
                    />
                  </Button>
                </PopoverTrigger>
              </Hint>
              <PopoverContent align='end' className='p-2 w-82'>
                <ul className='space-y-2'>
                  {MODES.map(({ title, description, value, Icon }, i) => (
                    <li
                      key={i}
                      className={cn(
                        'flex items-center justify-between gap-4 hover:cursor-pointer p-2 border border-transparent rounded transition-colors',
                        mode === value
                          ? 'border-purple-700 bg-purple-800/20 hover:bg-purple-800/25'
                          : 'hover:bg-accent/25'
                      )}
                      onClick={() => setMode(value)}
                    >
                      <div className='flex items-start gap-3'>
                        <Icon className='size-4 mt-0.5 text-muted-foreground' />
                        <p className='flex flex-col text-xs font-medium'>
                          {title}
                          <span className='text-xs font-normal text-muted-foreground'>
                            {description}
                          </span>
                        </p>
                      </div>
                      {mode === value && (
                        <Check className='size-4 text-muted-foreground' />
                      )}
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
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
              disabled={!input || isLoading}
              className='cursor-pointer'
            >
              <ArrowRight className='size-6' strokeWidth={2.5} />
            </Button>
          </div>
        </div>
      </form>
      {includeSuggestions && <SearchSuggestions setSearch={setInput} />}
    </>
  );
};

export default InputBar;
