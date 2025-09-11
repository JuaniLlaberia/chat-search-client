interface StreamHandlers {
  onContent: (content: string) => void;
  onSearchStart: (query: string) => void;
  onSearchResults: (urls: string[]) => void;
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
              handlers.onCheckpoint(data.checkpoint_id);
              break;

            case 'content':
              streamedContent += data.content;
              handlers.onContent(streamedContent);
              break;

            case 'search_start':
              handlers.onSearchStart(data.query);
              break;

            case 'search_results':
              const urls =
                typeof data.urls === 'string'
                  ? JSON.parse(data.urls)
                  : data.urls;
              handlers.onSearchResults(urls);
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
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}
