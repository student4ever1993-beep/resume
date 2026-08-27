import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Send, User, Loader2, Cpu, ChevronDown } from 'lucide-react';
import { contactConfig } from '../config';
import Phoenix3D from '../effects/Phoenix3D';
import PhoenixIcon from './PhoenixIcon';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

type ModelProvider = 'groq' | 'gpt20b' | 'ollama' | 'smart';

export default function ChatWidget() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelProvider>('groq');
  const [showModelMenu, setShowModelMenu] = useState(false);

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
        { label: '🚀 كيف تقود علياء التحول الرقمي؟', query: 'كيف تقود علياء التحول الرقمي في المؤسسات؟' },
        { label: '💼 خبرتها في شركة أمان بمسقط', query: 'حدثني عن خبرة علياء البالغة 5 سنوات في شركة أمان بمسقط' },
        { label: '⚡ تقنيات React & Three.js', query: 'ما هي المهارات والتقنيات البرمجية التي تبرع فيها علياء؟' },
        { label: '✉️ التواصل وحجز استشارة', query: 'كيف يمكنني التواصل مع علياء أو طلب سيرتها الذاتية؟' },
      ]
    : [
        { label: '🚀 Digital Transformation Leadership', query: 'How does Alya drive enterprise digital transformation?' },
        { label: '💼 5+ Yrs Experience at AMAN', query: 'Tell me about Alya\'s 5+ years experience as Systems Analyst at AMAN in Muscat.' },
        { label: '⚡ React & 3D WebGL Capabilities', query: 'What technical skills and architecture frameworks does Alya master?' },
        { label: '✉️ Hire Alya / Contact CV', query: 'How can I contact Alya or download her CV for a job opportunity?' },
      ];

  // High-Impact Marketing System Prompt
  const marketingSystemPrompt = `You are Alya Al-Siyabi's Career Marketing & Technical Phoenix AI Ambassador.
Alya Al-Siyabi is a Senior Systems Analyst & Software Engineer at AMAN Business Consulting in Muscat, Oman, with over 5+ years of enterprise experience in Digital Transformation, Systems Architecture, React, Three.js 3D WebGL, Cloud Solutions, and Data Security.
Your goal is to MARKET Alya's skills persuasively to clients, partners, and employers. Be enthusiastic, confident, and professional. Keep answers under 3 concise, impactful sentences. Answer in ${isRtl ? 'Arabic' : 'English'}.`;

  // 1. Groq API Call (allam-2-7b / gpt-oss-20b)
  const callGroqAPI = async (userMsg: string, modelId: string = 'allam-2-7b'): Promise<string | null> => {
    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY || '';
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelId,
          messages: [
            { role: 'system', content: marketingSystemPrompt },
            { role: 'user', content: userMsg },
          ],
          temperature: 0.6,
          max_tokens: 220,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error('Groq API Error:', res.status, err);
        return null;
      }
      const data = await res.json();
      return data.choices?.[0]?.message?.content || null;
    } catch (err) {
      console.error('Groq Fetch Exception:', err);
      return null;
    }
  };

  // 2. Ollama API Call
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
            { role: 'system', content: marketingSystemPrompt },
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

  // 3. Marketing Smart Fallback Engine
  const getMarketingFallback = (userMsg: string): string => {
    const lower = userMsg.toLowerCase();

    if (lower.includes('digital') || lower.includes('transformation') || lower.includes('تحول') || lower.includes('رقمي')) {
      return isRtl
        ? 'تتميز علياء بالقدرة على إحداث تحول رقمي متكامل للمؤسسات، حيث تحول العمليات اليدوية المعقدة إلى نظم رقمية عالية الكفاءة مع خفض تكاليف التشغيل. هل ترغب في الاطلاع على نتائج مشاريعها السابقة؟'
        : "Alya excels at driving complete digital transformation—converting complex manual workflows into high-efficiency automated systems that reduce IT operational costs. Would you like to review her case studies?";
    }

    if (lower.includes('experience') || lower.includes('خبرة') || lower.includes('خبرات') || lower.includes('aman') || lower.includes('أمان')) {
      return isRtl
        ? 'مع أكثر من 5 سنوات من التميز في شركة أمان للاستشارات وتطوير الأعمال بمحافظة مسقط، قادت علياء تحليل وتصميم البنى التحتية البرمجية المعقدة للمؤسسات. يمكنك تحميل سريتها الذاتية فوراً من الصفحة الرئيسية!'
        : 'With over 5+ years of excellence at AMAN Business Consulting in Muscat, Oman, Alya has spearheaded enterprise systems analysis and cloud solution architectures. Download her CV from the Hero section to learn more!';
    }

    if (lower.includes('skill') || lower.includes('مهار') || lower.includes('تقني') || lower.includes('react') || lower.includes('three')) {
      return isRtl
        ? 'تجمع علياء بين البرمجة المتقدمة (React، Three.js WebGL) والتخطيط الاستراتيجي للنظم وتحليل البيانات لتوفير تجارب متطورة. هل ترغب في التواصل معها لمناقشة مشروعك؟'
        : 'Alya combines cutting-edge engineering (React, Three.js WebGL) with strategic systems architecture and data security to deliver high-performance solutions. Shall we connect you with her?';
    }

    return isRtl
      ? `علياء مستعدة لقيادة نجاح مشروعك القادم! يمكنك التواصل معها مباشرة عبر البريد الإلكتروني: ${contactConfig.items.find(i => i.icon === 'Mail')?.value || 'aman@example.com'}`
      : `Alya is ready to bring strategic technology leadership to your team! You can email her directly at ${contactConfig.items.find(i => i.icon === 'Mail')?.value || 'aman@example.com'} or request her full portfolio.`;
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

    let reply: string | null = null;

    if (selectedModel === 'groq') {
      reply = await callGroqAPI(query, 'allam-2-7b');
    } else if (selectedModel === 'gpt20b') {
      reply = await callGroqAPI(query, 'openai/gpt-oss-20b');
    } else if (selectedModel === 'ollama') {
      reply = await callOllamaAPI(query);
    }

    // Fallback if selected API failed or if smart model selected
    if (!reply) {
      reply = getMarketingFallback(query);
    }

    setIsLoading(false);
    const botReply: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'bot',
      text: reply,
    };
    setMessages((prev) => [...prev, botReply]);
  };

  const modelLabels: Record<ModelProvider, string> = {
    groq: 'ALLaM 2.0 (Arabic & English 0.1s)',
    gpt20b: 'GPT-OSS 20B (Groq LPU)',
    ollama: 'Ollama Unlimited Local',
    smart: 'Smart Marketing AI Engine',
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
          className={`fixed bottom-24 z-50 w-[90vw] sm:w-[410px] h-[550px] rounded-3xl border border-[var(--border-highlight)] bg-[var(--glass-bg)] backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
            isRtl ? 'left-6' : 'right-6'
          }`}
          style={{
            fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-primary)] bg-gradient-to-r from-[rgba(255,69,0,0.15)] via-[rgba(255,140,0,0.08)] to-transparent">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#990000] via-[#ff3300] to-[#ffaa00] p-0.5 shadow-[0_0_12px_rgba(255,69,0,0.5)] flex items-center justify-center">
                <Phoenix3D size={38} interactive={false} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[var(--text-heading)] flex items-center gap-1.5">
                  {isRtl ? 'مساعد العنقاء الذكي' : 'Phoenix AI Assistant'}
                </h3>

                {/* Model Selector Dropdown Badge */}
                <div className="relative inline-block">
                  <button
                    onClick={() => setShowModelMenu(!showModelMenu)}
                    className="text-[10px] text-amber-500 font-medium flex items-center gap-1 hover:underline focus:outline-none"
                  >
                    <Cpu size={11} />
                    <span>{modelLabels[selectedModel]}</span>
                    <ChevronDown size={11} />
                  </button>

                  {/* Dropdown Menu */}
                  {showModelMenu && (
                    <div className="absolute top-6 left-0 z-50 w-56 py-1 rounded-xl border border-[var(--border-highlight)] bg-[var(--bg-primary)] shadow-2xl backdrop-blur-md">
                      {(['groq', 'gpt20b', 'ollama', 'smart'] as ModelProvider[]).map((prov) => (
                        <button
                          key={prov}
                          onClick={() => {
                            setSelectedModel(prov);
                            setShowModelMenu(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-[11px] font-medium transition-colors flex items-center justify-between ${
                            selectedModel === prov
                              ? 'text-amber-400 bg-[rgba(255,140,0,0.12)]'
                              : 'text-[var(--text-primary)] hover:bg-[var(--glass-bg)]'
                          }`}
                        >
                          <span>{modelLabels[prov]}</span>
                          {selectedModel === prov && <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:bg-[var(--glass-bg)] transition-colors"
            >
              <X size={15} />
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
                  className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-[var(--accent-gold)] to-[#b5560b] text-[#050505] font-medium rounded-br-none'
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

          {/* Marketing Quick Suggestions Chips */}
          <div className="px-3 py-2 border-t border-[var(--border-primary)] flex flex-wrap gap-1.5 bg-[rgba(0,0,0,0.1)]">
            {quickQuestions.map((q) => (
              <button
                key={q.label}
                onClick={() => handleSend(q.query)}
                className="px-2.5 py-1 rounded-full border border-orange-500/30 bg-[var(--glass-bg)] text-[10px] font-semibold text-amber-400 hover:border-amber-400 hover:bg-orange-500/10 transition-colors"
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
              placeholder={isRtl ? 'اسأل عن حلول تحول النظم والخبرات...' : 'Ask about systems transformation & hiring...'}
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
