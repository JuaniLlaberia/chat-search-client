'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/lib/utils';

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot='tabs'
      className={cn('w-full', className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  const [underlineStyle, setUnderlineStyle] = React.useState({
    width: 0,
    left: 0,
  });
  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const updateUnderline = () => {
      if (!listRef.current) return;

      const activeTab = listRef.current.querySelector(
        '[data-state="active"]'
      ) as HTMLButtonElement;
      if (activeTab) {
        setUnderlineStyle({
          width: activeTab.offsetWidth,
          left: activeTab.offsetLeft,
        });
      }
    };

    // Initial update
    updateUnderline();

    // Observer for state changes
    const observer = new MutationObserver(() => {
      updateUnderline();
    });

    if (listRef.current) {
      observer.observe(listRef.current, {
        attributes: true,
        subtree: true,
        attributeFilter: ['data-state'],
      });
    }

    // Handle resize
    window.addEventListener('resize', updateUnderline);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateUnderline);
    };
  }, []);

  return (
    <div className='relative border-b border-border'>
      <TabsPrimitive.List
        ref={listRef}
        data-slot='tabs-list'
        className={cn('flex space-x-8', className)}
        {...props}
      />
      {/* Animated Underline */}
      <div
        className='absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-out'
        style={{
          width: underlineStyle.width,
          transform: `translateX(${underlineStyle.left}px)`,
        }}
      />
    </div>
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot='tabs-trigger'
      className={cn(
        className,
        'relative px-1 py-4 text-sm font-medium transition-colors duration-200',
        'hover:text-foreground focus:outline-none focus:text-foreground',
        'data-[state=active]:text-foreground text-muted-foreground',
        'disabled:pointer-events-none disabled:opacity-50'
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot='tabs-content'
      className={cn('mt-6 outline-none', className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
