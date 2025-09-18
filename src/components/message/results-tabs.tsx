import MessageTimeline from './message-timeline';
import { TabsContent } from '@/components/ui/tabs';
import { Source, TimelineEvent } from '@/types/index';
import { SourcePreview } from './source-preview';
import { ContentDisplay } from './message-content';
import { AnimatedShinyText } from '../magicui/animated-shiny-text';

interface ResultsTabProps {
  type: 'informative' | 'timeline';
  sources?: Source[];
  events?: TimelineEvent[];
  content: string;
  search: string;
  isLoading?: boolean;
  isSearching?: boolean;
  isGeneratingTimeline?: boolean;
  onViewAllSources: () => void;
}

export const ResultsTab = ({
  type,
  sources,
  content,
  events,
  isLoading,
  isSearching,
  isGeneratingTimeline,
  onViewAllSources,
}: ResultsTabProps) => {
  return (
    <TabsContent value='results' className='space-y-6'>
      {sources && sources.length > 0 && (
        <SourcePreview sources={sources} onViewAllSources={onViewAllSources} />
      )}
      {/* Regular components */}
      <ContentDisplay
        content={content}
        isLoading={isLoading}
        isSearching={isSearching}
        isGeneratingTimeline={isGeneratingTimeline}
      />
      {/* Timeline components */}
      {type === 'timeline' &&
        events &&
        events?.length > 0 &&
        !isGeneratingTimeline && <MessageTimeline events={events} />}
      {type === 'timeline' &&
        isGeneratingTimeline &&
        !isLoading &&
        !isSearching && (
          <AnimatedShinyText className='inline-flex items-center justify-center px-2 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400'>
            Generating timeline...
          </AnimatedShinyText>
        )}
    </TabsContent>
  );
};
