'use client';

import { TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Source } from '@/types/index';

interface StepsTabProps {
  search: string;
  sources?: Source[];
}

export const StepsTab = ({ search, sources }: StepsTabProps) => {
  const steps = [
    {
      title: 'Starting Search...',
      content: (
        <p className='text-sm text-muted-foreground leading-relaxed'>
          {search}
        </p>
      ),
    },
    {
      title: `Reading ${sources?.length || 0} Sources...`,
      content: (
        <ul className='space-y-2'>
          {sources?.map(({ site_icon, url, site }) => (
            <li key={url} className='flex items-center gap-2'>
              <Avatar className='size-4'>
                <AvatarImage className='rounded-full' src={site_icon} />
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
  ];

  return (
    <TabsContent value='steps'>
      <div className='pb-48'>
        <div className='relative'>
          <div className='absolute left-[11px] top-4 bottom-4 w-0.5 bg-border' />

          <div className='space-y-8'>
            {steps.map((step, i) => (
              <div key={i} className='relative flex items-start gap-6 -z-10'>
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
  );
};
