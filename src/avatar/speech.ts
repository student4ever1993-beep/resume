import { avatarConfig } from './config';
import type { MouthSample } from './types';

// Speech output for the avatar.
//   1. Server TTS (/api/tts) → Web Audio → AnalyserNode. The analyser drives the lip sync:
//      loudness opens the mouth, the high/low frequency balance makes it wide (e/i) or round (o/u).
//   2. If the server TTS fails, the browser's speechSynthesis voice is used and the mouth is
//      animated from word-boundary events instead.

export interface SpeakCallbacks {
  /** Audio actually started playing. */
  onStart?: () => void;
  /** Finished, stopped, or failed. */
  onEnd?: () => void;
}

/** Remove markdown, URLs and emoji so the voice reads naturally. */
export function toSpeakableText(text: string) {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[*_`#>~]/g, '')
    .replace(/\p{Extended_Pictographic}️?/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export class SpeechOutput {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: AudioBufferSourceNode | null = null;
  private timeData: Float32Array<ArrayBuffer> = new Float32Array(0);
  private freqData: Uint8Array<ArrayBuffer> = new Uint8Array(0);
  private abort: AbortController | null = null;
  private token = 0;
  private synthActive = false;
  private synthBoundaryAt = 0;
  /** Running loudness peak, so lip sync adapts to quiet or loud TTS voices. */
  private peak = 0.1;
  private callbacks: SpeakCallbacks = {};

  /** Must be called from a user gesture (click / key press) so audio may play later. */
  unlock() {
    if (!this.ctx) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      this.ctx = new Ctor();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 1024;
      this.analyser.smoothingTimeConstant = 0.35;
      this.analyser.connect(this.ctx.destination);
      this.timeData = new Float32Array(this.analyser.fftSize);
      this.freqData = new Uint8Array(this.analyser.frequencyBinCount);
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
  }

  async speak(text: string, lang: 'en' | 'ar', callbacks: SpeakCallbacks = {}) {
    this.stop();
    const token = ++this.token;
    this.callbacks = callbacks;
    const speakable = toSpeakableText(text);
    if (!speakable) return this.finish(token);

    try {
      this.abort = new AbortController();
      const timeout = setTimeout(() => this.abort?.abort(), avatarConfig.ttsTimeoutMs);
      const res = await fetch(avatarConfig.ttsEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: speakable, lang }),
        signal: this.abort.signal,
      });
      clearTimeout(timeout);
      if (!res.ok || !(res.headers.get('content-type') || '').startsWith('audio/')) {
        throw new Error(`TTS responded ${res.status}: ${await res.text().catch(() => '')}`);
      }
      const bytes = await res.arrayBuffer();
      if (token !== this.token) return;

      this.unlock();
      if (!this.ctx || !this.analyser) throw new Error('Web Audio unavailable');
      const buffer = await this.ctx.decodeAudioData(bytes);
      if (token !== this.token) return;

      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(this.analyser);
      source.onended = () => this.finish(token);
      this.source = source;
      source.start();
      callbacks.onStart?.();
    } catch (error) {
      if (token !== this.token) return; // stopped by the user
      console.warn('Server TTS unavailable, using the browser voice:', error);
      this.speakWithBrowser(speakable, lang, token);
    }
  }

  private speakWithBrowser(text: string, lang: 'en' | 'ar', token: number) {
    if (!('speechSynthesis' in window)) return this.finish(token);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
    const voice = window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith(lang));
    if (voice) utterance.voice = voice;
    utterance.rate = 1;
    // Some browsers/devices have no voices and never fire onstart/onend: give up gracefully
    // so the avatar returns to idle (the reply is still shown as text).
    const startTimeout = setTimeout(() => {
      if (token !== this.token || this.synthActive) return;
      window.speechSynthesis.cancel();
      this.finish(token);
    }, 3000);
    utterance.onstart = () => {
      clearTimeout(startTimeout);
      if (token !== this.token) return;
      this.synthActive = true;
      this.synthBoundaryAt = performance.now();
      this.callbacks.onStart?.();
    };
    utterance.onboundary = () => (this.synthBoundaryAt = performance.now());
    utterance.onend = utterance.onerror = () => {
      clearTimeout(startTimeout);
      this.finish(token);
    };
    window.speechSynthesis.speak(utterance);
  }

  private finish(token: number) {
    if (token !== this.token) return;
    this.source = null;
    this.synthActive = false;
    const { onEnd } = this.callbacks;
    this.callbacks = {};
    onEnd?.();
  }

  stop() {
    this.token++;
    this.abort?.abort();
    this.abort = null;
    if (this.source) {
      this.source.onended = null;
      try {
        this.source.stop();
      } catch {
        // already stopped
      }
      this.source = null;
    }
    if (this.synthActive || window.speechSynthesis?.speaking) window.speechSynthesis.cancel();
    this.synthActive = false;
    // Notify the previous speak() caller that speech ended.
    const { onEnd } = this.callbacks;
    this.callbacks = {};
    onEnd?.();
  }

  /** Called every animation frame while the avatar is speaking. */
  sampleMouth = (): MouthSample => {
    if (this.source && this.analyser) {
      this.analyser.getFloatTimeDomainData(this.timeData);
      let sum = 0;
      for (let i = 0; i < this.timeData.length; i++) sum += this.timeData[i] * this.timeData[i];
      const rms = Math.sqrt(sum / this.timeData.length);

      this.analyser.getByteFrequencyData(this.freqData);
      const binHz = (this.ctx?.sampleRate ?? 48000) / this.analyser.fftSize;
      const band = (lo: number, hi: number) => {
        let s = 0;
        const a = Math.floor(lo / binHz);
        const b = Math.min(this.freqData.length - 1, Math.ceil(hi / binHz));
        for (let i = a; i <= b; i++) s += this.freqData[i];
        return s / Math.max(1, b - a + 1);
      };
      const low = band(250, 1000);
      const high = band(1800, 4500);

      this.peak = Math.max(rms, this.peak * 0.995, 0.06);
      const open = Math.min(1, Math.max(0, (rms - 0.012) / (this.peak * 0.9)));
      const wide = Math.min(1, Math.max(0, high / (low + 1) * 1.6));
      return { open, wide };
    }
    if (this.synthActive) {
      // No audio stream available: approximate syllables, with a burst after each word boundary.
      const t = performance.now() / 1000;
      const sinceWord = (performance.now() - this.synthBoundaryAt) / 1000;
      const syllable = 0.5 + 0.5 * Math.sin(t * 17) * Math.sin(t * 6.3 + 1);
      const envelope = sinceWord < 0.6 ? 1 : 0.35;
      return { open: Math.max(0, syllable * 0.75 * envelope), wide: 0.5 + 0.4 * Math.sin(t * 3.7) };
    }
    return { open: 0, wide: 0.5 };
  };

  dispose() {
    this.stop();
    void this.ctx?.close();
    this.ctx = null;
  }
}
