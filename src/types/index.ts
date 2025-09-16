export interface Source {
  site: string;
  site_icon?: string;
  title: string;
  url: string;
}

export interface Message {
  id: string;
  type?: string;
  isLoading?: boolean;
  search: string;
  content: string;
  followupQuestions?: string[];
  sources?: Source[];
  images?: string[];
  isSearching?: boolean;
  error?: string;
}
