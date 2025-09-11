'use client';

import Link from 'next/link';
import { Sparkles, User } from 'lucide-react';
import { Message, SearchInfo } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AnimatedShinyText } from '../magicui/animated-shiny-text';

interface MessageAreaProps {
  messages: Message[];
}

interface SearchStagesProps {
  searchInfo: SearchInfo;
}

const SearchStages = ({ searchInfo }: SearchStagesProps) => {
  if (!searchInfo || !searchInfo.stages || searchInfo.stages.length === 0)
    return null;

  return (
    <div className='mb-3 mt-1 relative pl-4'>
      <div className='flex flex-col space-y-4 text-sm text-gray-700'>
        {searchInfo.stages.includes('searching') && (
          <div className='relative'>
            <div className='absolute -left-3 top-1 w-2.5 h-2.5 bg-purple-400 rounded-full z-10 shadow-sm' />

            <div className='flex flex-col'>
              <AnimatedShinyText className='mx-2 mb-2 text-muted-foreground'>
                Searching the web...
              </AnimatedShinyText>
              <div className='flex flex-wrap gap-2 pl-2 mt-1'>
                <div className='bg-gray-100 text-xs px-3 py-1.5 rounded border border-gray-200 inline-flex items-center'>
                  <svg
                    className='w-3 h-3 mr-1.5 text-gray-500'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                    ></path>
                  </svg>
                  {searchInfo.query}
                </div>
              </div>
            </div>
          </div>
        )}

        {searchInfo.stages.includes('reading') && (
          <div className='relative'>
            <div className='absolute -left-3 top-1 w-2.5 h-2.5 bg-purple-400 rounded-full z-10 shadow-sm' />

            <div className='flex flex-col'>
              <AnimatedShinyText className='mx-2 mb-2 text-muted-foreground'>
                Reading...
              </AnimatedShinyText>

              {searchInfo.urls && searchInfo.urls.length > 0 && (
                <div className='pl-2 space-y-1'>
                  <ul className='flex flex-wrap gap-2'>
                    {Array.isArray(searchInfo.urls) ? (
                      searchInfo.urls.map((url, index) => (
                        <Link
                          key={index}
                          href={url}
                          target='_blank'
                          className='bg-muted/25 text-muted-foreground text-xs px-3 py-1.5 rounded border border-border truncate max-w-[200px] transition-all duration-200 hover:bg-muted/50 cursor-pointer'
                        >
                          {typeof url === 'string'
                            ? url
                            : JSON.stringify(url).substring(0, 30)}
                        </Link>
                      ))
                    ) : (
                      <div className='bg-gray-100 text-xs px-3 py-1.5 rounded border border-gray-200 truncate max-w-[200px] transition-all duration-200 hover:bg-gray-50'>
                        {JSON.stringify(searchInfo.urls).substring(0, 30)}
                      </div>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {searchInfo.stages.includes('writing') && (
          <div className='relative'>
            <div className='absolute -left-3 top-1 w-2.5 h-2.5 bg-purple-400 rounded-full z-10 shadow-sm'></div>
            <AnimatedShinyText className='mx-2 mb-2 text-muted-foreground'>
              Writing answer...
            </AnimatedShinyText>
          </div>
        )}

        {/* Error Message */}
        {searchInfo.stages.includes('error') && (
          <div className='relative'>
            <div className='absolute -left-3 top-1 w-2.5 h-2.5 bg-red-400 rounded-full z-10 shadow-sm'></div>
            <span className='font-medium'>Search error</span>
            <div className='pl-4 text-xs text-red-500 mt-1'>
              {searchInfo.error || 'An error occurred during search.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MessageArea = ({ messages }: MessageAreaProps) => {
  return (
    <div
      className='flex-grow overflow-y-auto no-scrollbar'
      style={{ minHeight: 0 }}
    >
      <ul className='p-6'>
        {messages.map(message => (
          <li
            key={message.id}
            className={`flex ${
              message.isUser ? 'justify-end' : 'justify-start'
            } mb-5`}
          >
            <div className='flex flex-col max-w-md'>
              {!message.isUser && message.searchInfo && (
                <SearchStages searchInfo={message.searchInfo} />
              )}

              {/* Message Content */}
              <div className='flex gap-3 items-start bg-muted/25 border border-border rounded-xl p-3 pr-4'>
                <Avatar>
                  {message.isUser ? (
                    <>
                      <AvatarFallback>
                        <User className='size-4' fill='white' />
                      </AvatarFallback>
                    </>
                  ) : (
                    <AvatarFallback>
                      <Sparkles className='size-4' fill='white' />
                    </AvatarFallback>
                  )}
                </Avatar>
                {message.isLoading ? (
                  <AnimatedShinyText className='inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400'>
                    Finder is thinking...
                  </AnimatedShinyText>
                ) : (
                  message.content || (
                    // Fallback if content is empty but not in loading state
                    <span className='text-gray-400 text-xs italic'>
                      Waiting for response...
                    </span>
                  )
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageArea;
