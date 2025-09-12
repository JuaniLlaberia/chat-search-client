import { Source } from '@/types/index';

interface StreamHandlers {
  onContent: (content: string) => void;
  onSearchStart: () => void;
  onSearchResults: (sources: Source[], images: string[]) => void;
  onSearchError: (error: string) => void;
  onEnd: () => void;
  onError: (error: Event) => void;
  onCheckpoint: (checkpointId: string) => void;
}

export class ChatService {
  private eventSource: EventSource | null = null;

  async streamChat(
    userInput: string,
    checkpointId: string | null,
    handlers: StreamHandlers
  ) {
    try {
      let url = `http://127.0.0.1:8000/chat_stream/${encodeURIComponent(
        userInput
      )}`;
      if (checkpointId) {
        url += `?checkpoint_id=${encodeURIComponent(checkpointId)}`;
      }

      this.eventSource = new EventSource(url);
      let streamedContent = '';

      this.eventSource.onmessage = event => {
        try {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case 'checkpoint':
              console.log('Checkpoint', data.checkpoint_id);
              handlers.onCheckpoint(data.checkpoint_id);
              break;

            case 'content':
              streamedContent += data.content;
              handlers.onContent(streamedContent);
              break;

            case 'search_start':
              handlers.onSearchStart();
              break;

            case 'search_results':
              const sources =
                typeof data.sources === 'string'
                  ? JSON.parse(data.sources)
                  : data.sources;
              const images =
                typeof data.images === 'string'
                  ? JSON.parse(data.images)
                  : data.images;

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
        }
      };

      this.eventSource.onerror = error => {
        console.log(error);
        console.error('EventSource error:', error);
        handlers.onError(error);
        this.close();
      };
    } catch (error) {
      console.error('Error setting up EventSource:', error);
      throw error;
    }
  }

  close() {
    if (this.eventSource) {
      console.log('CLOSSING');
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}
