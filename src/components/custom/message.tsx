'use client';

import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Globe, Image as ImageIcon, Text, Workflow } from 'lucide-react';
import { memo } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatedShinyText } from '../magicui/animated-shiny-text';
import { cn } from '@/lib/utils';
import { Source } from '@/types/index';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const formatMarkdown = (text: string) => {
  return text
    .split('\n')
    .map(line => {
      if (/^\s*\*([^*])/.test(line)) {
        return `- ${line.trim().slice(1).trim()}`;
      }
      return line;
    })
    .join('\n');
};

interface MessageProps {
  id: string;
  search: string;
  content: string;
  sources?: Source[];
  images?: string[];
  isLoading?: boolean;
  isSearching?: boolean;
  isLastMessage: boolean;
}

const Message = ({
  id,
  search,
  sources,
  images,
  content,
  isLoading,
  isSearching,
  isLastMessage,
}: MessageProps) => {
  const [activeTab, setActiveTab] = useState<string>('results');

  return (
    <li key={id} className={cn(isLastMessage ? 'h-[85vh] mb-0' : 'mb-8')}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                <span className='text-muted-foreground'>
                  · {sources.length}
                </span>
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
        <TabsContent value='results' className='space-y-6'>
          {sources && sources.length > 0 && (
            <ul className='grid grid-cols-11 gap-2.5'>
              {sources.slice(0, 3).map(({ site, title, url, site_icon }, i) => (
                <li
                  key={i}
                  className='h-16 flex flex-col gap-2 py-2 px-2.5 bg-accent col-span-3 rounded-lg hover:bg-muted-foreground/20'
                >
                  <Link href={url} target='_blank' className='space-y-2'>
                    <span className='flex items-center gap-2 text-muted-foreground text-xs font-medium'>
                      <Avatar className='size-4'>
                        <AvatarImage className='rounded-full' src={site_icon} />
                        <AvatarFallback className='bg-purple-500 rounded-full'>
                          {site[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {site}
                    </span>
                    <p className='line-clamp-1 text-sm'>{title}</p>
                  </Link>
                </li>
              ))}
              <li
                className='h-16 flex flex-col justify-between py-2 px-2.5 bg-accent col-span-2 rounded-lg text-sm hover:bg-muted-foreground/20'
                onClick={() => setActiveTab('sources')}
              >
                See all
                <span className='text-xs font-medium'>
                  +{sources.slice(3).length} sources
                </span>
              </li>
            </ul>
          )}
          {!isLoading && !isSearching && content && (
            <ReactMarkdown>{formatMarkdown(content)}</ReactMarkdown>
          )}
          {isSearching && isLoading && (
            <AnimatedShinyText className='inline-flex items-center justify-center px-2 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400'>
              Searching for results...
            </AnimatedShinyText>
          )}
          {isLoading && !isSearching && (
            <AnimatedShinyText className='inline-flex items-center justify-center px-2 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400'>
              Building answer...
            </AnimatedShinyText>
          )}
        </TabsContent>
        {images && images.length > 0 && (
          <TabsContent value='images'>
            <div className='pb-48'>
              <h2 className='text-lg font-medium mb-4'>Images</h2>
              <div className='grid grid-cols-2 gap-4'>
                {images.map(img => (
                  <li key={img}>
                    <Link
                      href={img}
                      target='_blank'
                      className='relative h-48 w-auto bg-accent rounded-lg flex items-center justify-center overflow-hidden'
                    >
                      <Image src={img} alt='' fill />
                    </Link>
                  </li>
                ))}
              </div>
            </div>
          </TabsContent>
        )}
        {sources && sources.length > 0 && (
          <TabsContent value='sources'>
            <div className='pb-48'>
              <h2 className='text-lg font-medium mb-4'>All Sources</h2>
              <ul className='space-y-4'>
                {sources.map(({ site, url, title, site_icon }, i) => (
                  <li
                    key={i}
                    className='px-0.5 py-2.5 border-b border-border hover:bg-accent/25 last:border-0'
                  >
                    <Link href={url} target='_blank'>
                      <span className='flex items-center gap-3 mb-2'>
                        <Avatar>
                          <AvatarImage
                            className='size-6 rounded-full'
                            src={site_icon}
                          />
                          <AvatarFallback className='size-6 bg-purple-500 rounded-full'>
                            {site[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className='font-medium'>{site}</h3>
                      </span>
                      <p className='text-sm text-muted-foreground'>{title}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        )}
        <TabsContent value='steps'>
          <div className='pb-48'>
            <div className='relative'>
              <div className='absolute left-[11px] top-4 bottom-4 w-0.5 bg-border' />

              <div className='space-y-8'>
                {[
                  {
                    title: 'Starting Search...',
                    content: (
                      <p className='text-sm text-muted-foreground leading-relaxed'>
                        {search}
                      </p>
                    ),
                  },
                  {
                    title: `Reading ${sources?.length} Sources...`,
                    content: (
                      <ul className='space-y-2'>
                        {sources?.map(({ site_icon, url, site }) => (
                          <li key={url} className='flex items-center gap-2'>
                            <Avatar className='size-4'>
                              <AvatarImage
                                className='rounded-full'
                                src={site_icon}
                              />
                              <AvatarFallback className='bg-purple-500 rounded-full'>
                                {site[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <p className='line-clamp-1 text-sm text-muted-foreground leading-relaxed'>
                              {url}
                            </p>
                          </li>
                        ))}
                      </ul>
                    ),
                  },
                  {
                    title: 'Results Found',
                  },
                  {
                    title: 'Building answer...',
                  },
                ].map((step, i) => (
                  <div
                    key={i}
                    className='relative flex items-start gap-6 -z-10'
                  >
                    <div className='relative z-10 size-6 bg-background border-2 border-primary rounded-full flex items-center justify-center'>
                      <div className='size-2 bg-primary rounded-full' />
                    </div>

                    <div className='flex-1 pb-2'>
                      <h3 className='font-semibold text-foreground mb-3 text-base'>
                        {step.title}
                      </h3>
                      {step.content && (
                        <div className='bg-accent/50 rounded-lg p-4 border border-border/50'>
                          {step.content}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </li>
  );
};

export default memo(Message);
