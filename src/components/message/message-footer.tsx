'use client';

import {
  ArrowRight,
  Copy,
  MessageCircleQuestionMark,
  Repeat2,
  Volume2,
  VolumeOffIcon,
} from 'lucide-react';

import Hint from '../ui/hint';
import { Button } from '../ui/button';
import { useSpeechSynthesis } from '@/hooks/use-speech-synthesis';
import { useCopyToClipboard } from '@/hooks/use-clipboard';
import { useChatActions } from '@/features/chat/api/use-chat-actions';

interface MessageFooterProps {
  isVisible: boolean;
  isLoading?: boolean;
  isSearching?: boolean;
  search: string;
  content: string;
  followupQuestions?: string[];
}

const MessageFooter = ({
  isVisible,
  isLoading,
  isSearching,
  content,
  search,
  followupQuestions,
}: MessageFooterProps) => {
  const { speak, stop, isSpeaking } = useSpeechSynthesis({
    lang: 'en-US',
    rate: 1,
    pitch: 1,
    volume: 1,
  });
  const { copy } = useCopyToClipboard(content);

  const { sendMessage, isLoading: isLoadingAction } = useChatActions({
    topic: 'general',
  });

  return (
    <div className='mt-6 space-y-6'>
      {!isLoading && !isSearching && content && (
        <ul className='flex items-center gap-2'>
          <li>
            <Hint label='Copy' side='bottom'>
              <Button
                variant='ghost'
                size='icon-sm'
                className='cursor-pointer'
                onClick={copy}
              >
                <span className='sr-only'>Copy content</span>
                <Copy />
              </Button>
            </Hint>
          </li>
          <li>
            <Hint label='Try again' side='bottom'>
              <Button
                variant='ghost'
                size='icon-sm'
                className='cursor-pointer'
                disabled={isLoadingAction}
                onClick={() => sendMessage(search)}
              >
                <span className='sr-only'>Try again</span>
                <Repeat2 />
              </Button>
            </Hint>
          </li>
          <li>
            <Hint label='Read aloud' side='bottom'>
              <Button
                variant='ghost'
                size='icon-sm'
                className='cursor-pointer'
                onClick={() => (isSpeaking ? stop() : speak(content))}
              >
                <span className='sr-only'>Read content aloud</span>
                {isSpeaking ? <VolumeOffIcon /> : <Volume2 />}
              </Button>
            </Hint>
          </li>
        </ul>
      )}
      {followupQuestions && !isLoading && !isSearching && isVisible && (
        <div>
          <h3 className='flex items-center gap-2 text-lg font-medium mb-3'>
            <span>
              <MessageCircleQuestionMark className='size-5' />
            </span>
            Followup
          </h3>
          <ul>
            {followupQuestions.map(question => (
              <li
                key={question}
                className='flex items-center justify-between gap-8 text-muted-foreground pr-3 py-3 border-b border-border first:border-t last:border-0 group hover:bg-accent/25 hover:text-primary hover:cursor-pointer'
                onClick={() => sendMessage(question)}
              >
                {question}
                <ArrowRight className='size-4 transition-transform group-hover:translate-x-1' />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MessageFooter;
