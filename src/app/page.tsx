import InputBar from '@/components/custom/input-bar';

export default function Home() {
  return (
    <section className='h-screen flex items-center justify-center'>
      <div className='w-full max-w-[40%] space-y-8'>
        <h1 className='text-4xl text-center'>What can I help with?</h1>
        <InputBar includeSuggestions />
      </div>
    </section>
  );
}
