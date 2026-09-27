import { lazy, Suspense, useCallback, useEffect, useId, useRef, useState } from 'react';
import { Bot, ChevronDown, Cpu, Mic, MicOff, ScrollText, Send, Square, Volume2, VolumeX, X } from 'lucide-react';
import { useAssistantChat, type ModelProvider } from '../assistant/useAssistantChat';
import { SpeechOutput } from '../avatar/speech';
import { useSpeechRecognition } from '../avatar/useSpeechRecognition';
import type { AvatarDriver, AvatarState } from '../avatar/types';

// 3D avatar front-end for the AI assistant. Conversation logic is in useAssistantChat;
// this component handles presentation, voice (TTS + mic) and the avatar's state.

const AvatarCanvas = lazy(() => import('../avatar/AvatarCanvas'));

const MUTE_KEY = 'alya-assistant-muted';
const readMuted = () => {
  try {
    return localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
};

const STATE_DOT: Record<AvatarState, string> = {
  idle: 'bg-amber-400',
  listening: 'bg-teal-400',
  thinking: 'bg-violet-400',
  speaking: 'bg-amber-300',
};

type VoiceState = 'idle' | 'preparing' | 'speaking';

// Speak in the language of the reply itself (the model may answer in either language).
const detectLang = (text: string): 'en' | 'ar' => (/[\u0600-\u06FF]/.test(text) ? 'ar' : 'en');

export default function ChatWidget() {
  const { isRtl, messages, isLoading, selectedModel, setSelectedModel, modelLabels, quickQuestions, handleSend } =
    useAssistantChat();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [inputActive, setInputActive] = useState(false);
  const [muted, setMuted] = useState(readMuted);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [showTranscript, setShowTranscript] = useState(false);
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [loadAvatar, setLoadAvatar] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const greetedRef = useRef(false);
  const wasOpenRef = useRef(false);
  const panelId = useId();
  const titleId = useId();

  const [speech] = useState(() => new SpeechOutput());
  // Shared with the render loop; mutated freely without re-rendering React.
  const driverRef = useRef<AvatarDriver>({
    state: 'idle',
    expanded: false,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    pointer: null,
    pointerMovedAt: 0,
    sampleMouth: speech.sampleMouth,
    gestureQueue: [],
  });

  const speak = useCallback(
    (text: string) => {
      if (muted) return;
      void speech.speak(text, detectLang(text), {
        onStart: () => setVoiceState('speaking'),
        onEnd: () => setVoiceState('idle'),
      });
      setVoiceState('preparing');
    },
    [muted, speech],
  );

  const send = useCallback(
    async (text: string) => {
      const query = text.trim();
      if (!query || isLoading) return;
      speech.unlock();
      speech.stop();
      driverRef.current.gestureQueue.push('nod');
      setInput('');
      const reply = await handleSend(query);
      if (reply) speak(reply);
    },
    [handleSend, isLoading, speak, speech],
  );

  const mic = useSpeechRecognition({ lang: isRtl ? 'ar-OM' : 'en-US', onFinal: (text) => void send(text) });

  // ── Avatar state ──
  const avatarState: AvatarState =
    voiceState === 'speaking'
      ? 'speaking'
      : isLoading || voiceState === 'preparing'
        ? 'thinking'
        : mic.listening || (inputActive && input.length > 0)
          ? 'listening'
          : 'idle';

  useEffect(() => {
    driverRef.current.state = avatarState;
    driverRef.current.expanded = isOpen;
  }, [avatarState, isOpen]);

  // Lazy-load the 3D avatar once the page is idle, so it never competes with first paint.
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const start = () => (w.requestIdleCallback ? w.requestIdleCallback(() => setLoadAvatar(true), { timeout: 3000 }) : setTimeout(() => setLoadAvatar(true), 1500));
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    return () => window.removeEventListener('load', start);
  }, []);

  // Eyes follow the pointer ("looks toward the user").
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      driverRef.current.pointer = { x: e.clientX, y: e.clientY };
      driverRef.current.pointerMovedAt = performance.now();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useEffect(() => () => speech.dispose(), [speech]);

  useEffect(() => {
    if (isOpen) transcriptEndRef.current?.scrollIntoView({ block: 'end' });
  }, [messages, isOpen, showTranscript]);

  // Focus management: input on open, launcher on close.
  useEffect(() => {
    if (isOpen) inputRef.current?.focus({ preventScroll: true });
    else if (wasOpenRef.current) launcherRef.current?.focus({ preventScroll: true });
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  const open = () => {
    setLoadAvatar(true);
    setIsOpen(true);
    speech.unlock();
    if (!greetedRef.current) {
      greetedRef.current = true;
      driverRef.current.gestureQueue.push('wave');
      const greeting = messages[0]?.text;
      if (greeting) speak(greeting);
    }
  };

  const close = useCallback(() => {
    speech.stop();
    mic.stop();
    setShowModelMenu(false);
    setIsOpen(false);
  }, [mic, speech]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showModelMenu) setShowModelMenu(false);
        else close();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, showModelMenu, close]);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    if (next) speech.stop();
    try {
      localStorage.setItem(MUTE_KEY, next ? '1' : '0');
    } catch {
      // storage unavailable (private mode): the preference just won't persist
    }
  };

  const toggleMic = () => {
    if (mic.listening) return mic.stop();
    speech.unlock();
    speech.stop();
    mic.start();
  };

  const t = (en: string, ar: string) => (isRtl ? ar : en);
  const statusLabel: Record<AvatarState, string> = {
    idle: t('Ready to help', 'جاهز للمساعدة'),
    listening: t('Listening…', 'أستمع…'),
    thinking: voiceState === 'preparing' ? t('Preparing voice…', 'أجهّز الصوت…') : t('Thinking…', 'أفكر…'),
    speaking: t('Speaking…', 'أتحدث…'),
  };

  const lastBot = [...messages].reverse().find((m) => m.sender === 'bot');
  const awaitingReply = isLoading || voiceState === 'preparing';
  const hasUserMessages = messages.some((m) => m.sender === 'user');
  const side = isRtl ? 'left-3 sm:left-6' : 'right-3 sm:right-6';

  return (
    <div
      className={`fixed z-50 bottom-3 sm:bottom-6 ${side} border shadow-2xl transition-[width,height,border-radius,box-shadow] duration-500 ease-out ${
        isOpen
          ? 'overflow-hidden w-[calc(100vw-1.5rem)] sm:w-[400px] h-[min(88dvh,680px)] rounded-[28px] border-[var(--border-highlight)] bg-[var(--glass-bg)] backdrop-blur-xl flex flex-col'
          : 'w-[96px] h-[96px] rounded-full border-[#ffe082]/60 bg-[#0b0b10] shadow-[0_0_30px_rgba(212,175,55,0.55)] hover:shadow-[0_0_42px_rgba(255,215,0,0.8)]'
      }`}
      style={{ fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif' }}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* ── Avatar stage (same element in both modes, so the 3D scene is never re-created) ── */}
      <div
        className={`relative shrink-0 ${isOpen ? 'flex-1 min-h-[200px]' : 'w-full h-full'}`}
        style={{
          background:
            'radial-gradient(circle at 50% 42%, rgba(212,175,55,0.28), rgba(212,175,55,0.06) 45%, transparent 70%)',
        }}
      >
        {/* In launcher mode the robot is inset from the gold frame so its dark edges never touch it. */}
        <div
          className={`absolute transition-[inset] duration-500 ${isOpen ? 'inset-0' : 'inset-[10px]'}`}
          style={isOpen ? { maskImage: 'linear-gradient(to bottom, black 78%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, black 78%, transparent)' } : undefined}
        >
          {loadAvatar && !avatarFailed ? (
            <Suspense fallback={<AvatarPlaceholder />}>
              <AvatarCanvas driverRef={driverRef} onError={() => setAvatarFailed(true)} />
            </Suspense>
          ) : (
            <AvatarPlaceholder />
          )}
        </div>

        {!isOpen && (
          <>
            <button
              ref={launcherRef}
              type="button"
              onClick={open}
              onPointerEnter={() => setLoadAvatar(true)}
              onFocus={() => setLoadAvatar(true)}
              aria-label={t("Open Alya's AI assistant", 'افتح مساعد علياء الذكي')}
              aria-expanded={false}
              title={t("Talk to Alya's AI assistant", 'تحدث مع مساعد علياء الذكي')}
              className="absolute inset-0 rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/70"
            />
            <span className="pointer-events-none absolute top-1 right-1 flex h-3.5 w-3.5" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200 opacity-75 motion-reduce:hidden" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400" />
            </span>
          </>
        )}

        {isOpen && (
          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
            <div className="flex flex-col gap-1.5 min-w-0">
              <h2 id={titleId} className="text-xs font-bold text-[var(--text-heading)] drop-shadow">
                {t('Alya AI Assistant', 'مساعد علياء الذكي')}
              </h2>
              <div
                className="inline-flex items-center gap-1.5 self-start rounded-full border border-[var(--border-primary)] bg-[var(--glass-bg)] px-2.5 py-1 text-[10px] font-semibold text-[var(--text-heading)]"
                aria-hidden="true"
              >
                <span className={`h-2 w-2 rounded-full ${STATE_DOT[avatarState]} ${avatarState !== 'idle' ? 'animate-pulse' : ''}`} />
                {statusLabel[avatarState]}
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowModelMenu((v) => !v)}
                  aria-haspopup="listbox"
                  aria-expanded={showModelMenu}
                  aria-label={t(`AI model: ${modelLabels[selectedModel]}`, `النموذج: ${modelLabels[selectedModel]}`)}
                  className="flex items-center gap-1 text-[10px] font-medium text-amber-500 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
                >
                  <Cpu size={11} aria-hidden="true" />
                  <span className="truncate max-w-[150px]">{modelLabels[selectedModel]}</span>
                  <ChevronDown size={11} aria-hidden="true" />
                </button>
                {showModelMenu && (
                  <div role="listbox" aria-label={t('Choose AI model', 'اختر النموذج')} className="absolute top-5 start-0 z-10 w-56 py-1 rounded-xl border border-[var(--border-highlight)] bg-[var(--bg-primary)] shadow-2xl">
                    {(Object.keys(modelLabels) as ModelProvider[]).map((prov) => (
                      <button
                        key={prov}
                        type="button"
                        role="option"
                        aria-selected={selectedModel === prov}
                        onClick={() => {
                          setSelectedModel(prov);
                          setShowModelMenu(false);
                        }}
                        className={`w-full text-start px-3 py-1.5 text-[11px] font-medium flex items-center justify-between focus:outline-none focus-visible:bg-[var(--glass-bg)] ${
                          selectedModel === prov ? 'text-amber-400 bg-[rgba(255,140,0,0.12)]' : 'text-[var(--text-primary)] hover:bg-[var(--glass-bg)]'
                        }`}
                      >
                        <span>{modelLabels[prov]}</span>
                        {selectedModel === prov && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <IconButton
                label={muted ? t('Unmute voice', 'تشغيل الصوت') : t('Mute voice', 'كتم الصوت')}
                pressed={muted}
                onClick={toggleMute}
              >
                {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </IconButton>
              <IconButton label={t('Close assistant', 'إغلاق المساعد')} onClick={close}>
                <X size={15} />
              </IconButton>
            </div>
          </div>
        )}
      </div>

      {/* ── Conversation controls ── */}
      {isOpen && (
        <section id={panelId} aria-labelledby={titleId} className="flex flex-col min-h-0 shrink-0">
          {/* Screen-reader announcements for state changes */}
          <p className="sr-only" aria-live="polite">
            {statusLabel[avatarState]}
          </p>

          <div className="px-4 pb-2">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <button
                type="button"
                onClick={() => setShowTranscript((v) => !v)}
                aria-expanded={showTranscript}
                className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-heading)] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
              >
                <ScrollText size={12} aria-hidden="true" />
                {showTranscript ? t('Hide transcript', 'إخفاء المحادثة') : t('Show transcript', 'عرض المحادثة')}
              </button>
              {(voiceState !== 'idle') && (
                <button
                  type="button"
                  onClick={() => speech.stop()}
                  className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 px-2.5 py-0.5 text-[10px] font-semibold text-amber-400 hover:bg-amber-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  <Square size={9} fill="currentColor" aria-hidden="true" />
                  {t('Stop speaking', 'إيقاف الكلام')}
                </button>
              )}
            </div>

            <div className={`overflow-y-auto overscroll-contain pe-1 ${showTranscript ? 'max-h-[34dvh]' : 'max-h-[7.5rem]'}`}>
              {showTranscript ? (
                <ol className="space-y-2" aria-label={t('Conversation transcript', 'نص المحادثة')}>
                  {messages.map((m) => (
                    <li key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <span className="sr-only">{m.sender === 'user' ? t('You:', 'أنت:') : t('Assistant:', 'المساعد:')}</span>
                      <p
                        className={`max-w-[88%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                          m.sender === 'user'
                            ? 'bg-gradient-to-r from-[var(--accent-gold)] to-[#b5560b] text-[#050505] font-medium'
                            : 'border border-[var(--border-primary)] bg-[var(--glass-bg)] text-[var(--text-heading)]'
                        }`}
                      >
                        {m.text}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <div aria-live="polite" aria-atomic="true">
                  {awaitingReply ? (
                    <p className="flex items-center gap-1 py-2" aria-label={statusLabel.thinking}>
                      {[0, 1, 2].map((i) => (
                        <span key={i} className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </p>
                  ) : (
                    <p className="text-[13px] leading-relaxed text-[var(--text-heading)]">{lastBot?.text}</p>
                  )}
                </div>
              )}
              <div ref={transcriptEndRef} />
            </div>
          </div>

          {!hasUserMessages && (
            <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto no-scrollbar" role="group" aria-label={t('Suggested questions', 'أسئلة مقترحة')}>
              {quickQuestions.map((q) => (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => void send(q.query)}
                  disabled={isLoading}
                  className="shrink-0 px-2.5 py-1 rounded-full border border-amber-500/30 bg-[var(--glass-bg)] text-[10px] font-semibold text-amber-400 hover:border-amber-400 hover:bg-amber-500/10 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  {q.label}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="m-3 mt-1 flex items-center gap-1.5 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-1.5 focus-within:border-amber-500"
          >
            {mic.supported && (
              <button
                type="button"
                onClick={toggleMic}
                aria-pressed={mic.listening}
                aria-label={mic.listening ? t('Stop listening', 'إيقاف الاستماع') : t('Speak your question', 'تحدث بسؤالك')}
                className={`p-2.5 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  mic.listening ? 'bg-teal-500 text-white animate-pulse' : 'text-amber-400 hover:bg-amber-500/10'
                }`}
              >
                {mic.listening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            )}
            <label htmlFor={`${panelId}-input`} className="sr-only">
              {t('Message the assistant', 'اكتب رسالتك للمساعد')}
            </label>
            <input
              ref={inputRef}
              id={`${panelId}-input`}
              type="text"
              value={mic.listening && mic.interim ? mic.interim : input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setInputActive(true)}
              onBlur={() => setInputActive(false)}
              readOnly={mic.listening}
              placeholder={
                mic.listening
                  ? t('Listening… speak now', 'أستمع… تحدث الآن')
                  : t('Ask about systems transformation & hiring...', 'اسأل عن حلول تحول النظم والخبرات...')
              }
              className="flex-1 min-w-0 bg-transparent px-2 py-2 text-xs text-[var(--text-heading)] placeholder:text-[var(--text-muted)] focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label={t('Send message to assistant', 'إرسال الرسالة للمساعد')}
              className="p-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#050508] hover:scale-105 transition-transform disabled:opacity-40 disabled:hover:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <Send size={15} className={isRtl ? '-scale-x-100' : ''} />
            </button>
          </form>
          {mic.error && (
            <p role="alert" className="px-4 pb-3 -mt-1 text-[10px] text-rose-400">
              {mic.error === 'permission'
                ? t('Microphone access was blocked. You can still type your question.', 'تم رفض الوصول إلى الميكروفون. يمكنك كتابة سؤالك.')
                : t("Sorry, I couldn't hear that. Please try again or type.", 'لم أتمكن من السماع. حاول مجدداً أو اكتب سؤالك.')}
            </p>
          )}
        </section>
      )}
    </div>
  );
}

function AvatarPlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#9a7516] via-[#d4af37] to-[#ffd700] flex items-center justify-center text-[#050508] shadow-[0_0_20px_rgba(212,175,55,0.6)]">
        <Bot size={28} />
      </div>
    </div>
  );
}

function IconButton({ label, pressed, onClick, children }: { label: string; pressed?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      className="p-2 rounded-full border border-[var(--border-primary)] bg-[var(--glass-bg)] text-[var(--text-heading)] hover:border-amber-400 hover:text-amber-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
    >
      {children}
    </button>
  );
}
