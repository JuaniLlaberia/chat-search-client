'use client';

import ReactMarkdown from 'react-markdown';
import { AnimatedShinyText } from '../magicui/animated-shiny-text';

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

interface ContentDisplayProps {
  content?: string;
  isLoading?: boolean;
  isSearching?: boolean;
  isGeneratingTimeline?: boolean;
}

export const ContentDisplay = ({
  content,
  isLoading,
  isSearching,
  isGeneratingTimeline,
}: ContentDisplayProps) => {
  if (isSearching && isLoading && !isGeneratingTimeline) {
    return (
      <AnimatedShinyText className='inline-flex items-center justify-center px-2 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400'>
        Searching for results...
      </AnimatedShinyText>
    );
  }

  if (isLoading && !isSearching && !isGeneratingTimeline) {
    return (
      <AnimatedShinyText className='inline-flex items-center justify-center px-2 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400'>
        Building answer...
      </AnimatedShinyText>
    );
  }

  if (!isLoading && !isSearching && content) {
    return <ReactMarkdown>{formatMarkdown(content)}</ReactMarkdown>;
  }

  return null;
};
