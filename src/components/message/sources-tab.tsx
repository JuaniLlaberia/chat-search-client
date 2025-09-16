'use client';

import Link from 'next/link';
import { TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Source } from '@/types/index';

interface SourcesTabProps {
  sources: Source[];
}

export const SourcesTab = ({ sources }: SourcesTabProps) => {
  return (
    <TabsContent value='sources'>
      <div>
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
  );
};
