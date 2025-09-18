import InputBar from '@/components/custom/input-bar';

export default function Home() {
  return (
    <section className='h-screen flex items-center justify-center'>
      <div className='w-full px-4 lg:px-0 max-w-2xl space-y-8'>
        <h1 className='text-3xl lg:text-4xl text-center'>
          What can I help with?
        </h1>
        <InputBar includeSuggestions />
      </div>
    </section>
  );
}
