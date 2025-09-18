'use client';

import { Cloud, Globe2, MapPin, PiggyBankIcon, Search } from 'lucide-react';
import type { Dispatch, ReactElement, SetStateAction } from 'react';

type Suggestion = {
  icon: ReactElement;
  label: string;
  search: string;
};

const SUGGESTIONS: Suggestion[] = [
  {
    icon: <Cloud className='size-4' />,
    label: 'Weather',
    search: 'What is the weather near me?',
  },
  {
    icon: <MapPin className='size-4' />,
    label: 'Location',
    search: 'Where can I find ',
  },
  {
    icon: <Search className='size-4' />,
    label: 'Search',
    search: 'Search for ',
  },
  {
    icon: <Globe2 className='size-4' />,
    label: 'World news',
    search: 'What is going on around the world?',
  },
  {
    icon: <PiggyBankIcon className='size-4' />,
    label: 'Finances',
    search: 'How are the markets doing?',
  },
];

const SearchSuggestions = ({
  setSearch,
}: {
  setSearch: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <ul className='flex justify-center flex-wrap gap-4 mt-8'>
      {SUGGESTIONS.map(({ icon, label, search }) => (
        <li
          key={label}
          className='flex items-center gap-2 px-3    py-1 border border-border rounded-lg bg-muted/25 text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 hover:cursor-pointer'
          onClick={() => setSearch(search)}
        >
          {icon} {label}
        </li>
      ))}
    </ul>
  );
};

export default SearchSuggestions;
