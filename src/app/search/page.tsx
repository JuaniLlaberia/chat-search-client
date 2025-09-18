import InputBar from '@/components/custom/input-bar';
import MessageArea from '@/components/custom/message-area';

const SearchPage = () => {
  return (
    <section className='min-h-screen flex flex-col'>
      <div className='flex-1 pb-24'>
        <MessageArea />
      </div>
      <div className='fixed bottom-0 left-0 right-0 bg-background backdrop-blur-sm p-2 lg:p-4 pt-0 z-10'>
        <div className='w-full max-w-3xl mx-auto'>
          <InputBar includeSuggestions={false} />
        </div>
      </div>
    </section>
  );
};

export default SearchPage;
