import { Dispatch, SetStateAction, useEffect, useState } from 'react';

let recognition: any = null;
if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
}

const useSpeechAPI = ({
  onTextChange,
}: {
  onTextChange: Dispatch<SetStateAction<string>>;
}) => {
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event: SpeechRecognitionResult) => {
      // @ts-expect-error The typing for this API is not 100% ok.
      onTextChange(event.results[0][0].transcript);

      recognition.stop();
      setIsListening(false);
    };
  }, [onTextChange]);

  const startListening = () => {
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognition.stop();
  };

  return {
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport: !!recognition,
  };
};

export { useSpeechAPI };
