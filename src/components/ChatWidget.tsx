import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Send, User, Loader2 } from 'lucide-react';
import { contactConfig } from '../config';
import Phoenix3D from '../effects/Phoenix3D';
import PhoenixIcon from './PhoenixIcon';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

export default function ChatWidget() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeProvider, setActiveProvider] = useState<'smart' | 'ollama' | 'huggingface'>('smart');

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: isRtl
        ? 'مرحباً! أنا مساعد العنقاء الذكي (Phoenix AI) الخاص بعلياء السيابية. كيف يمكنني مساعدتك اليوم في استكشاف خبراتها في تحليل النظم والتحول الرقمي؟'
        : "Hello! I am Alya's Phoenix AI Assistant. How can I help you explore her systems analysis experience, technical skills, or projects today?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickQuestions = isRtl
    ? [
        { label: '💼 خبرات علياء في أمان', query: 'خبرات' },
        { label: '⚡ المهارات والتحول الرقمي', query: 'مهارات' },
        { label: '✉️ البريد والسيرة الذاتية', query: 'تواصل' },
      ]
    : [
        { label: '💼 Alya\'s Experience at AMAN', query: 'experience' },
        { label: '⚡ Skills & Tech Stack', query: 'skills' },
        { label: '✉️ Contact Info & CV', query: 'contact' },
      ];

  // System Prompt for LLM (Ollama / HuggingFace)
  const systemPrompt = `You are Alya Al-Siyabi's Portfolio Phoenix AI Assistant.
Alya Al-Siyabi is a Systems Analyst & Software Developer at AMAN Business Consulting in Muscat, Oman, with over 8+ years of experience in Enterprise Digital Transformation, Systems Architecture, React, Three.js, and Cloud Solutions.
Be professional, concise, polite, and answer questions accurately. Language: ${isRtl ? 'Arabic' : 'English'}.`;

  // 1. Ollama Integration (Local Server)
  const callOllamaAPI = async (userMsg: string): Promise<string | null> => {
    try {
      const ollamaUrl = import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434/api/chat';
      const model = import.meta.env.VITE_OLLAMA_MODEL || 'llama3';

      const res = await fetch(ollamaUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMsg },
          ],
          stream: false,
        }),
      });

      if (!res.ok) return null;
      const data = await res.json();
      return data.message?.content || null;
    } catch {
      return null;
    }
  };

  // 2. Hugging Face Inference API Integration
  const callHuggingFaceAPI = async (userMsg: string): Promise<string | null> => {
    try {
      const hfToken = import.meta.env.VITE_HF_API_KEY;
      if (!hfToken) return null;

      const model = import.meta.env.VITE_HF_MODEL || 'Qwen/Qwen2.5-Coder-7B-Instruct';
      const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${hfToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `<|system|>\n${systemPrompt}\n<|user|>\n${userMsg}\n<|assistant|>`,
          parameters: { max_new_tokens: 250, temperature: 0.7 },
        }),
      });

      if (!res.ok) return null;
      const data = await res.json();
      if (Array.isArray(data) && data[0]?.generated_text) {
        const text = data[0].generated_text;
        return text.split('<|assistant|>').pop()?.trim() || text;
      }
      return null;
    } catch {
      return null;
    }
  };

  // 3. Built-in Smart Fallback Engine
  const getFallbackResponse = (userMsg: string): string => {
    const lower = userMsg.toLowerCase();

    if (lower.includes('experience') || lower.includes('خبرة') || lower.includes('خبرات') || lower.includes('aman') || lower.includes('أمان')) {
      return isRtl
        ? 'تمتلك علياء السيابية أكثر من 5 سنوات من الخبرة الشاملة كمحللة نظم ومطورة برمجيات في شركة أمان للاستشارات وتطوير الأعمال بمحافظة مسقط، سلطنة عمان.'
        : 'Alya Al-Siyabi has over 8+ years of comprehensive experience as a Systems Analyst and Software Developer at AMAN Business Consulting in Muscat, Oman.';
    }

    if (lower.includes('skill') || lower.includes('مهار') || lower.includes('تقني') || lower.includes('tech')) {
      return isRtl
        ? 'تتخصص علياء في قيادة التحول الرقمي، تحليل وإدارة نظم المشاريع، React، Three.js، قواعد البيانات المؤسسية، والأمن السيبراني.'
        : 'Alya specializes in Digital Transformation Leadership, Enterprise Systems Analysis, React, Three.js, Cloud Integration, and Data Security.';
    }

    if (lower.includes('contact') || lower.includes('تواصل') || lower.includes('email') || lower.includes('إيميل') || lower.includes('cv') || lower.includes('سيرة')) {
      return isRtl
        ? `يمكنك التواصل مع علياء مباشرة عبر البريد الإلكتروني: ${contactConfig.items.find(i => i.icon === 'Mail')?.value || 'aman@example.com'} أو تحميل سريتها الذاتية من الصفحة الرئيسية.`
        : `You can reach Alya via email at ${contactConfig.items.find(i => i.icon === 'Mail')?.value || 'aman@example.com'} or download her CV directly from the Hero section.`;
    }

    return isRtl
      ? 'شكراً لتواصلك! يمكنك استكشاف أقسام الموقع لمعرفة المزيد عن مشاريع علياء وخبراتها المهنية.'
      : "Thank you for asking! Feel free to explore the portfolio sections or use the quick buttons below to learn more about Alya's career.";
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    // Try Ollama first
    let reply = await callOllamaAPI(query);
    if (reply) {
      setActiveProvider('ollama');
    } else {
      // Try HuggingFace next
      reply = await callHuggingFaceAPI(query);
      if (reply) {
        setActiveProvider('huggingface');
      } else {
        // Fallback to built-in smart engine
        reply = getFallbackResponse(query);
        setActiveProvider('smart');
      }
    }

    setIsLoading(false);
    const botReply: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'bot',
      text: reply,
    };
    setMessages((prev) => [...prev, botReply]);
  };

  return (
    <>
      {/* Floating 3D Phoenix Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 z-50 p-2.5 rounded-full bg-gradient-to-tr from-[#800000] via-[#ff3300] to-[#ffaa00] text-white shadow-[0_0_30px_rgba(255,85,0,0.65)] border border-[#ffaa00]/40 hover:scale-110 hover:shadow-[0_0_40px_rgba(255,140,0,0.85)] transition-all duration-300 flex items-center justify-center ${
          isRtl ? 'left-6' : 'right-6'
        }`}
        aria-label="Open Phoenix AI Assistant"
      >
        {isOpen ? (
          <div className="w-10 h-10 flex items-center justify-center text-white">
            <X size={24} />
          </div>
        ) : (
          <Phoenix3D size={52} interactive={true} />
        )}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 pointer-events-none">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-orange-500"></span>
        </span>
      </button>

      {/* Glassmorphic Chat Drawer */}
      {isOpen && (
        <div
          className={`fixed bottom-24 z-50 w-[90vw] sm:w-[390px] h-[530px] rounded-3xl border border-[var(--border-highlight)] bg-[var(--glass-bg)] backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
            isRtl ? 'left-6' : 'right-6'
          }`}
          style={{
            fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-primary)] bg-gradient-to-r from-[rgba(255,69,0,0.15)] via-[rgba(255,140,0,0.08)] to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#990000] via-[#ff3300] to-[#ffaa00] p-0.5 shadow-[0_0_12px_rgba(255,69,0,0.5)] flex items-center justify-center">
                <Phoenix3D size={38} interactive={false} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-heading)] flex items-center gap-1.5">
                  {isRtl ? 'مساعد العنقاء الذكي' : 'Phoenix AI Assistant'}
                </h3>
                <span className="text-[10px] text-amber-500 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block animate-pulse"></span>
                  {activeProvider === 'ollama' ? 'Ollama LLM' : activeProvider === 'huggingface' ? 'HuggingFace AI' : 'Smart Phoenix Engine'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:bg-[var(--glass-bg)] transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#990000] to-[#ff6600] border border-[#ffaa00]/40 flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_8px_rgba(255,69,0,0.4)]">
                    <PhoenixIcon size={16} />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-[var(--accent-gold)] to-[#b8860b] text-[#050508] font-medium rounded-br-none'
                      : 'border border-[var(--border-primary)] bg-[var(--glass-bg)] text-[var(--text-heading)] rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-[var(--border-highlight)] text-[var(--text-heading)] flex items-center justify-center shrink-0 mt-0.5">
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-amber-500 font-medium p-2">
                <Loader2 size={15} className="animate-spin text-orange-500" />
                <span>{isRtl ? 'العنقاء يفكر...' : 'Phoenix is thinking...'}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-3 py-2 border-t border-[var(--border-primary)] flex flex-wrap gap-1.5 bg-[rgba(0,0,0,0.1)]">
            {quickQuestions.map((q) => (
              <button
                key={q.query}
                onClick={() => handleSend(q.query)}
                className="px-2.5 py-1 rounded-full border border-orange-500/30 bg-[var(--glass-bg)] text-[10px] font-medium text-amber-400 hover:border-amber-400 hover:bg-orange-500/10 transition-colors"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-[var(--border-primary)] flex items-center gap-2 bg-[var(--bg-primary)]"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isRtl ? 'اكتب سؤالك هنا...' : 'Ask a question...'}
              className="flex-1 px-3.5 py-2 rounded-xl border border-[var(--border-primary)] bg-[var(--glass-bg)] text-xs text-[var(--text-heading)] focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="p-2 rounded-xl bg-gradient-to-r from-[#ff4500] to-[#ffaa00] text-[#050508] font-bold hover:scale-105 transition-transform disabled:opacity-50 shadow-[0_0_10px_rgba(255,69,0,0.4)]"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

