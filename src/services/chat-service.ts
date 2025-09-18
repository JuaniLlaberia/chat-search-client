import { Source, TimelineEvent } from '@/types/index';

interface StreamHandlers {
  onContent: (content: string) => void;
  onFollowupQuestions: (questions: string[]) => void;
  onSearchStart: () => void;
  onSearchResults: (sources: Source[], images: string[]) => void;
  onTimelineStart: () => void;
  onTimelineResults: (
    events: TimelineEvent[],
    isGeneratingTimeline?: boolean
  ) => void;
  onSearchError: (error: string) => void;
  onEnd: () => void;
  onError: (error: Event) => void;
  onCheckpoint: (checkpointId: string) => void;
}

export class ChatService {
  private eventSource: EventSource | null = null;
  private isConnected = false;

  async streamChat(
    userInput: string,
    checkpointId: string | null,
    topic: 'general' | 'news' | 'finance' = 'general',
    mode: 'informative' | 'timeline',
    handlers: StreamHandlers
  ) {
    this.close();

    try {
      const url = this.buildUrl(userInput, checkpointId, topic, mode);
      this.eventSource = new EventSource(url);
      this.isConnected = true;
      let streamedContent = '';

      this.eventSource.onopen = () => {
        console.log('EventSource connection opened');
      };

      this.eventSource.onmessage = event => {
        try {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case 'checkpoint':
              handlers.onCheckpoint(data.checkpoint_id);
              break;

            case 'content':
              streamedContent += data.content;
              handlers.onContent(streamedContent);
              break;

            case 'timeline_generation_start':
              handlers.onTimelineStart();
              break;

            case 'timeline_content':
              const events = this.parseJsonField(data.events);
              handlers.onTimelineResults(events);
              break;

            case 'followup_questions':
              handlers.onFollowupQuestions(data.questions);
              break;

            case 'search_start':
              handlers.onSearchStart();
              break;

            case 'search_results':
              const sources = this.parseJsonField(data.sources);
              const images = this.parseJsonField(data.images);
              handlers.onSearchResults(sources, images);
              break;

            case 'search_error':
              handlers.onSearchError(data.error);
              break;

            case 'end':
              handlers.onEnd();
              this.close();
              break;
          }
        } catch (error) {
          console.error('Error parsing event data:', error);
          handlers.onError(error as Event);
        }
      };

      this.eventSource.onerror = error => {
        console.error('EventSource error:', error);
        handlers.onError(error);
        this.close();
      };
    } catch (error) {
      console.error('Error setting up EventSource:', error);
      this.close();
      throw error;
    }
  }

  private buildUrl(
    userInput: string,
    checkpointId: string | null,
    topic: string,
    mode: string
  ): string {
    const url = `http://127.0.0.1:8000/chat_stream/${encodeURIComponent(
      userInput
    )}`;
    const params: string[] = [];

    if (checkpointId) {
      params.push(`checkpoint_id=${encodeURIComponent(checkpointId)}`);
    }
    if (topic) {
      params.push(`topic=${encodeURIComponent(topic)}`);
    }
    if (mode) {
      params.push(`mode=${encodeURIComponent(mode)}`);
    }

    return params.length > 0 ? `${url}?${params.join('&')}` : url;
  }

  private parseJsonField<T = unknown>(field: string | T): T {
    return typeof field === 'string' ? JSON.parse(field) : field;
  }

  close() {
    if (this.eventSource && this.isConnected) {
      console.log('Closing EventSource connection');
      this.eventSource.close();
      this.eventSource = null;
      this.isConnected = false;
    }
  }

  isActive(): boolean {
    return this.isConnected && this.eventSource !== null;
  }
}
