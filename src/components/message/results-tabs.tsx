'use client';

import { Copy, Repeat2, Volume2, VolumeOffIcon } from 'lucide-react';

import Hint from '../ui/hint';
import { TabsContent } from '@/components/ui/tabs';
import { Source } from '@/types/index';
import { SourcePreview } from './source-preview';
import { ContentDisplay } from './message-content';
import { Button } from '../ui/button';
import { useSpeechSynthesis } from '@/hooks/use-speech-synthesis';
import { useCopyToClipboard } from '@/hooks/use-clipboard';
import { useChatActions } from '@/features/chat/api/use-chat-actions';

interface ResultsTabProps {
  sources?: Source[];
  content: string;
  search: string;
  isLoading?: boolean;
  isSearching?: boolean;
  onViewAllSources: () => void;
}

export const ResultsTab = ({
  sources,
  content,
  search,
  isLoading,
  isSearching,
  onViewAllSources,
}: ResultsTabProps) => {
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
    <TabsContent value='results' className='space-y-6 pb-48'>
      {sources && sources.length > 0 && (
        <SourcePreview sources={sources} onViewAllSources={onViewAllSources} />
      )}
      <ContentDisplay
        content={content}
        isLoading={isLoading}
        isSearching={isSearching}
      />
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
    </TabsContent>
  );
};
