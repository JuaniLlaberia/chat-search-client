'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Source } from '@/types/index';

interface SourcePreviewProps {
  sources: Source[];
  onViewAllSources: () => void;
}

export const SourcePreview = ({
  sources,
  onViewAllSources,
}: SourcePreviewProps) => {
  return (
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
        className='h-16 flex flex-col justify-between py-2 px-2.5 bg-accent col-span-2 rounded-lg text-sm hover:bg-muted-foreground/20 cursor-pointer'
        onClick={onViewAllSources}
      >
        See all
        <span className='text-xs font-medium'>
          +{sources.slice(3).length} sources
        </span>
      </li>
    </ul>
  );
};
