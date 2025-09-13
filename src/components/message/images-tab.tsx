'use client';

import Link from 'next/link';
import Image from 'next/image';
import { TabsContent } from '@/components/ui/tabs';

interface ImagesTabProps {
  images: string[];
}

export const ImagesTab = ({ images }: ImagesTabProps) => {
  return (
    <TabsContent value='images'>
      <div className='pb-48'>
        <h2 className='text-lg font-medium mb-4'>Images</h2>
        <div className='grid grid-cols-2 gap-4'>
          {images.map((img, index) => (
            <li key={img || index}>
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
  );
};
