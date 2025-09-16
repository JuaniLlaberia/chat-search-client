import { useState, useCallback } from 'react';

interface SpeechOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  voiceName?: string;
}

export const useSpeechSynthesis = (defaultOptions: SpeechOptions = {}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback(
    (text: string, opts: SpeechOptions = {}) => {
      if (!text) return;
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const options = { ...defaultOptions, ...opts };

      if (options.lang) utterance.lang = options.lang;
      if (options.rate) utterance.rate = options.rate;
      if (options.pitch) utterance.pitch = options.pitch;
      if (options.volume !== undefined) utterance.volume = options.volume;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      speechSynthesis.speak(utterance);
    },
    [defaultOptions]
  );

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking };
};
