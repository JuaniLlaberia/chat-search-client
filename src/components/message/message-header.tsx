'use client';

import { Globe, Image as ImageIcon, Text, Workflow } from 'lucide-react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Source } from '@/types/index';

interface MessageHeaderProps {
  search: string;
  sources?: Source[];
  images?: string[];
  isLoading?: boolean;
}

export const MessageHeader = ({
  search,
  sources,
  images,
  isLoading,
}: MessageHeaderProps) => {
  return (
    <header className='sticky top-0 bg-background z-10'>
      <h1 className='text-2xl font-medium py-2'>{search}</h1>
      <TabsList>
        <TabsTrigger
          value='results'
          className='flex items-center justify-center gap-1.5'
        >
          <Text className='size-3' /> Results
        </TabsTrigger>
        {images && images.length > 0 && (
          <TabsTrigger
            value='images'
            className='flex items-center justify-center gap-1.5'
            disabled={isLoading}
          >
            <ImageIcon className='size-3' /> Images
          </TabsTrigger>
        )}
        {sources && sources.length > 0 && (
          <TabsTrigger
            value='sources'
            className='flex items-center justify-center gap-1.5'
            disabled={isLoading}
          >
            <Globe className='size-3' /> Sources
            <span className='text-muted-foreground'>· {sources.length}</span>
          </TabsTrigger>
        )}
        <TabsTrigger
          value='steps'
          className='flex items-center justify-center gap-1.5'
          disabled={isLoading}
        >
          <Workflow className='size-3' /> Steps
        </TabsTrigger>
      </TabsList>
    </header>
  );
};
