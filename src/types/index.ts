export interface Source {
  site: string;
  site_icon?: string;
  title: string;
  url: string;
}

export interface TimelineEvent {
  start_date: string;
  endDate: string;
  title: string;
  content: string;
}

export interface Message {
  // Default data
  id: string;
  type: 'informative' | 'timeline';
  isLoading?: boolean;
  search: string;
  content: string;
  followupQuestions?: string[];
  // Search data
  sources?: Source[];
  images?: string[];
  isSearching?: boolean;
  // Timeline data
  events?: TimelineEvent[];
  isGeneratingTimeline?: boolean;
  // Error data
  error?: string;
}
