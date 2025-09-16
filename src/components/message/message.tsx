'use client';

import { useState, memo } from 'react';

import MessageFooter from './message-footer';
import { Tabs } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Message as MessageType } from '@/types/index';
import { MessageHeader } from './message-header';
import { ResultsTab } from './results-tabs';
import { ImagesTab } from './images-tab';
import { SourcesTab } from './sources-tab';
import { StepsTab } from './steps-tab';

interface MessageProps extends MessageType {
  isLastMessage: boolean;
}

const Message = ({
  id,
  search,
  sources,
  images,
  content,
  followupQuestions,
  isLoading,
  isSearching,
  isLastMessage,
}: MessageProps) => {
  const [activeTab, setActiveTab] = useState<string>('results');

  return (
    <li key={id} className={cn(isLastMessage ? 'h-[85vh] mb-0' : 'mb-8')}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className='pb-48'>
        <MessageHeader
          search={search}
          sources={sources}
          images={images}
          isLoading={isLoading}
        />
        <ResultsTab
          sources={sources}
          search={search}
          content={content}
          isLoading={isLoading}
          isSearching={isSearching}
          onViewAllSources={() => setActiveTab('sources')}
        />
        {images && images.length > 0 && <ImagesTab images={images} />}
        {sources && sources.length > 0 && <SourcesTab sources={sources} />}
        <StepsTab search={search} sources={sources} />
        <MessageFooter
          isVisible={activeTab === 'results'}
          isLoading={isLoading}
          isSearching={isSearching}
          search={search}
          content={content}
          followupQuestions={followupQuestions}
        />
      </Tabs>
    </li>
  );
};

export default memo(Message);
