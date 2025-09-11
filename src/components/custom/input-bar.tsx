'use client';

import { ArrowRight } from 'lucide-react';
import { KeyboardEvent } from 'react';
import { Button } from '../ui/button';

interface InputBarProps {
  currentMessage: string;
  setCurrentMessage: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const InputBar = ({
  currentMessage,
  setCurrentMessage,
  onSubmit,
}: InputBarProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentMessage(e.target.value);
  };

  const handleEnterPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      if (e.shiftKey) {
        setCurrentMessage(currentMessage + '\n');
      } else if (currentMessage.trim() !== '') {
        onSubmit(e);
      }
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className='w-full p-5 border border-border bg-muted/25 mb-5 md:mb-0 rounded-xl mt-3'
    >
      <div className='flex gap-2 relative'>
        <textarea
          autoFocus
          placeholder='What do you have in mind?'
          className='outline-none bg-transparent border-transparent w-full pr-10 h-16 max-h-36 resize-none placeholder:text-muted-foreground'
          value={currentMessage}
          onChange={handleChange}
          onKeyDown={handleEnterPress}
        />
        <div
          className={`
          absolute right-0 transition-all duration-300
          ${
            currentMessage
              ? 'translate-y-0 opacity-100'
              : 'translate-y-full opacity-0'
          }
        `}
        >
          <Button
            size='icon'
            variant='special'
            type='submit'
            disabled={!currentMessage}
            className='cursor-pointer'
          >
            <ArrowRight className='size-6' strokeWidth={2.5} />
          </Button>
        </div>
      </div>
      <div className='flex items-center justify-between'>
        {currentMessage && (
          <p className='text-xs text-muted-foreground font-light'>
            Use{' '}
            <span className='bg-muted p-1 px-1.5 rounded-md text-primary'>
              Shift
            </span>{' '}
            +{' '}
            <span className='bg-muted p-1 px-1.5 rounded-md text-primary'>
              Enter
            </span>{' '}
            for a new line
          </p>
        )}
        <div className='py-2' />
      </div>
    </form>
  );
};

export default InputBar;
