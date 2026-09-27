import { useCallback, useEffect, useRef, useState } from 'react';

// Microphone input via the browser Web Speech API (Chrome, Edge, Safari). No backend needed.
// `supported` is false in browsers without it (e.g. Firefox); the UI hides the mic button.

interface RecognitionResultEvent {
  resultIndex: number;
  results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
}

interface Recognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: RecognitionResultEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}

type RecognitionCtor = new () => Recognition;

const getCtor = (): RecognitionCtor | undefined => {
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition || w.webkitSpeechRecognition;
};

export function useSpeechRecognition({ lang, onFinal }: { lang: string; onFinal: (text: string) => void }) {
  const [supported] = useState(() => typeof window !== 'undefined' && !!getCtor());
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<Recognition | null>(null);
  const onFinalRef = useRef(onFinal);
  useEffect(() => {
    onFinalRef.current = onFinal;
  }, [onFinal]);

  const stop = useCallback(() => recognitionRef.current?.stop(), []);

  const start = useCallback(() => {
    const Ctor = getCtor();
    if (!Ctor || recognitionRef.current) return;
    const rec = new Ctor();
    rec.lang = lang;
    rec.interimResults = true;
    rec.continuous = false;
    rec.onresult = (e) => {
      let text = '';
      let final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) final += r[0].transcript;
        else text += r[0].transcript;
      }
      setInterim(text);
      if (final.trim()) onFinalRef.current(final.trim());
    };
    rec.onerror = (e) => setError(e.error === 'not-allowed' ? 'permission' : e.error);
    rec.onend = () => {
      recognitionRef.current = null;
      setListening(false);
      setInterim('');
    };
    recognitionRef.current = rec;
    setError(null);
    setListening(true);
    rec.start();
  }, [lang]);

  useEffect(() => () => recognitionRef.current?.abort(), []);

  return { supported, listening, interim, error, start, stop };
}
