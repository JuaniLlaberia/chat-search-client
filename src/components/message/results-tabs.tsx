'use client';

import { TabsContent } from '@/components/ui/tabs';
import { Source } from '@/types/index';
import { SourcePreview } from './source-preview';
import { ContentDisplay } from './message-content';

interface ResultsTabProps {
  sources?: Source[];
  content?: string;
  isLoading?: boolean;
  isSearching?: boolean;
  onViewAllSources: () => void;
}

export const ResultsTab = ({
  sources,
  content,
  isLoading,
  isSearching,
  onViewAllSources,
}: ResultsTabProps) => {
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
    </TabsContent>
  );
};
