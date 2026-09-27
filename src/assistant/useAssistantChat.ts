import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { contactConfig } from '../config';

// Conversation logic for Alya's AI assistant (the "AI Agent").
// The UI (3D avatar, voice) lives in components/ChatWidget.tsx and only calls handleSend().

export interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

export type ModelProvider = 'groq' | 'gpt20b';

const MAX_SENTENCES = 2;
const MAX_WORDS = 45;

// Safety net for when the model ignores the length rule or hits max_tokens mid-sentence:
// keep whole sentences only, up to MAX_SENTENCES / MAX_WORDS. A sentence ends at . ! ? ؟
// followed by a space or the end, so "ASP.NET", "Next.js" and email addresses stay intact.
function shortenReply(text: string): string {
  const clean = text.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
  const ends = [...clean.matchAll(/[.!?؟]+["')\]]*(?=\s|$)/g)].map((m) => m.index + m[0].length);
  if (!ends.length) return clean;

  let cut = ends[0];
  for (let i = 1; i < Math.min(ends.length, MAX_SENTENCES); i++) {
    if (clean.slice(0, ends[i]).split(' ').length > MAX_WORDS) break;
    cut = ends[i];
  }
  return clean.slice(0, cut);
}

export function useAssistantChat() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelProvider>('groq');

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: isRtl
        ? 'مرحباً! أنا مساعد علياء الذكي للاستشارات والتطوير. كيف يمكنني مساعدتك اليوم في استكشاف خبراتها في تحليل النظم والتحول الرقمي؟'
        : "Hello! I am Alya's AI Strategy Assistant. How can I help you explore her systems analysis experience, technical skills, or project portfolio today?",
    },
  ]);

  const quickQuestions = isRtl
    ? [
        { label: '🚀 كيف تقود علياء التحول الرقمي؟', query: 'كيف تقود علياء التحول الرقمي في المؤسسات؟' },
        { label: '💼 خبرتها في شركة أمان بمسقط', query: 'حدثني عن خبرة علياء البالغة 5 سنوات في شركة أمان بمسقط' },
        { label: '⚡ المهارات والتقنيات البرمجية', query: 'ما هي المهارات والتقنيات البرمجية التي تبرع فيها علياء؟' },
        { label: '✉️ التواصل وحجز استشارة', query: 'كيف يمكنني التواصل مع علياء أو طلب سيرتها الذاتية؟' },
      ]
    : [
        { label: '🚀 Digital Transformation Leadership', query: 'How does Alya drive enterprise digital transformation?' },
        { label: '💼 5+ Yrs Experience at AMAN', query: 'Tell me about Alya\'s 5+ years experience as Systems Analyst at AMAN in Muscat.' },
        { label: '⚡ Technical Skills & Frameworks', query: 'What technical skills and architecture frameworks does Alya master?' },
        { label: '✉️ Hire Alya / Contact CV', query: 'How can I contact Alya or download her CV for a job opportunity?' },
      ];

  // High-Impact Marketing System Prompt — grounded in Alya's actual CV, third-person voice
  const marketingSystemPrompt = `You are Alya Al-Siyabi's Career Marketing AI Assistant. Speak ABOUT Alya in the third person (never as "I"). Answer ONLY using the verified facts below — never invent employers, titles, technologies, or years of experience. Be enthusiastic, confident, and professional. Be brief: reply in 1–2 short sentences (35 words max), answer the question directly, and never open with filler like "Certainly!" or "I'd be happy to help". Summarize lists by naming only the 2–3 most relevant items. Answer in ${isRtl ? 'Arabic' : 'English'}.
${isRtl ? 'مهم: اسمها بالعربية هو "علياء السيابية" — اكتبيه بهذا الشكل حصراً، ولا تكتبيه أبداً "أليا" أو أي تهجئة أخرى. أجب بجملة أو جملتين قصيرتين فقط (35 كلمة كحد أقصى)، وادخل في الإجابة مباشرة دون مقدمات مثل "بالطبع، يمكنني مساعدتك".' : ''}

VERIFIED PROFILE:
- Identity: Process Engineer turned Systems Analyst & Programmer, based in Al-Seeb, Muscat, Oman.
- Current role: Systems Analyst & Programmer at AMAN Consultancy and Business Development, Muscat (2021–Present). Handles requirements gathering, system design (flowcharts & data models), technical client proposals, full-stack development with ASP.NET Core MVC (Clean Architecture) and Laravel, is growing skills in Next.js/Angular/Power BI, integrates AI APIs, and tests applications.
- Prior roles: Process Engineer Trainee at T-kavin Engineering Consultancy & Public Authority for Water (5-month traineeship, 2018–2019) — P&ID diagrams, SCADA monitoring, water meter verification; Digital Marketing at The World of Muscat Real Estate (2016–2019) — social media management and campaign design.
- Education: Master of Digital Transformation and Innovation, University of Technology and Applied Sciences (UTAS), 2026–2027 (in progress); BSc Process Engineering, German University of Technology (GUtech), 2011–2017.
- Certifications: Dubai Center for AI Accelerator Program, ECBA, OXY Program for Entrepreneurial Development in Frontier Technology, Measurement Techniques Course, IC3, IELTS.
- Languages: Arabic (native), English (fluent), German (fluent).
- Skills: PHP, C#, JavaScript, HTML/CSS, ASP.NET Core MVC, Laravel, Next.js, Angular, React, Power BI, ChemCad, Figma, Canva, Photoshop.
- Key projects: government portal for the Environment Authority (washaq.ea.gov.om); client platforms for Rakeeza and Aluminum Watad; healthcare platform for Alfaisal Medical Services; AMAN in-house consultancy hub (ach.aman.om) plus testing/development on aman.om; Elite Companies system for MOCIIP (designed the system, built a Power BI demo, owned product through staging); an AI-powered candidate-evaluation tool for AMAN using the Gemini and ChatGPT APIs; the Fostering System for SMEDA (programmer & product owner, in staging); Generative-AI complaint system testing for TRA and chatbot evaluation for Dubai Airports (DXP); and an agricultural data-collection & analytics platform for ADC Somalia as main developer.
- Contact: Alya_alsiyabi93@outlook.com.

If asked about something not covered above, say that detail isn't confirmed and suggest contacting Alya directly rather than guessing.

REMEMBER: 1–2 short sentences, 35 words max. Replies are read aloud, so no markdown or bullet lists.`;

  // 1. Groq API Call via Vercel / Dev Server Function (/api/groq)
  const callGroqAPI = async (userMsg: string, modelId: string = 'allam-2-7b'): Promise<string | null> => {
    try {
      const res = await fetch('/api/groq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelId,
          messages: [
            { role: 'system', content: marketingSystemPrompt },
            { role: 'user', content: userMsg },
          ],
          temperature: 0.6,
          max_tokens: 250,
          // gpt-oss is a reasoning model: without this, hidden reasoning can use the whole
          // token budget and leave an empty answer.
          ...(modelId.startsWith('openai/gpt-oss') && { reasoning_effort: 'low' }),
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        const err = await res.text();
        console.error('Groq API Error via /api/groq:', res.status, err);
        return null;
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || data.choices?.[0]?.message?.reasoning;
      return content ? shortenReply(content) : null;
    } catch (err) {
      console.error('Groq Fetch Exception:', err);
      return null;
    }
  };

  // 2. Marketing Smart Fallback Engine (General Error Fallback)
  const getMarketingFallback = (userMsg: string): string => {
    const lower = userMsg.toLowerCase();

    if (lower.includes('digital') || lower.includes('transformation') || lower.includes('تحول') || lower.includes('رقمي')) {
      return isRtl
        ? 'علياء عملت كمحللة أنظمة تجمع بين خلفيتها كمهندسة عمليات وخبرتها البرمجية، حيث تحلل احتياجات المؤسسات وتصمم أنظمة رقمية (مخططات، نماذج بيانات، مواصفات) بدلاً من العمليات اليدوية. وهي حالياً تكمل ماجستير التحول الرقمي والابتكار في UTAS. هل ترغب بمعرفة تفاصيل أحد مشاريعها؟'
        : "Alya bridges her Process Engineering background with systems analysis—gathering requirements, mapping workflows, and designing system specifications (flowcharts, data models) for government, healthcare, and private clients. She's currently completing a Master's in Digital Transformation and Innovation at UTAS. Want details on a specific project?";
    }

    if (lower.includes('experience') || lower.includes('خبرة') || lower.includes('خبرات') || lower.includes('aman') || lower.includes('أمان')) {
      return isRtl
        ? 'منذ عام 2021 وعلياء تعمل كمحللة أنظمة ومبرمجة في شركة أمان للاستشارات وتطوير الأعمال بمسقط، حيث تجمع المتطلبات وتصمم الأنظمة وتطور الواجهات الأمامية والخلفية باستخدام ASP.NET Core وLaravel، بالإضافة إلى دمج واجهات برمجة الذكاء الاصطناعي. يمكنك تحميل سيرتها الذاتية الكاملة من قسم Hero!'
        : "Since 2021, Alya has worked as a Systems Analyst & Programmer at AMAN Consultancy and Business Development in Muscat—gathering requirements, designing systems, and building full-stack features with ASP.NET Core MVC and Laravel, plus integrating AI APIs. Download her full CV from the Hero section!";
    }

    if (lower.includes('skill') || lower.includes('مهار') || lower.includes('تقني') || lower.includes('react') || lower.includes('three')) {
      return isRtl
        ? 'تجمع علياء بين البرمجة (PHP وC# وJavaScript، مع ASP.NET Core MVC وLaravel وNext.js وAngular وReact) وأدوات مثل Power BI وFigma، إلى جانب خلفيتها الهندسية في ChemCad. هل ترغب بالتواصل معها لمناقشة مشروعك؟'
        : 'Alya combines programming (PHP, C#, JavaScript, with ASP.NET Core MVC, Laravel, Next.js, Angular, React) with tools like Power BI and Figma, plus an engineering background using ChemCad. Shall we connect you with her?';
    }

    if (lower.includes('contact') || lower.includes('hire') || lower.includes('email') || lower.includes('تواصل') || lower.includes('توظيف') || lower.includes('بريد')) {
      return isRtl
        ? `علياء مستعدة لقيادة نجاح مشروعك القادم! يمكنك التواصل معها مباشرة عبر البريد الإلكتروني: ${contactConfig.items.find(i => i.icon === 'Mail')?.value || 'Alya_alsiyabi93@outlook.com'}`
        : `Alya is ready to bring her systems analysis and development skills to your team! You can email her directly at ${contactConfig.items.find(i => i.icon === 'Mail')?.value || 'Alya_alsiyabi93@outlook.com'} or request her full portfolio.`;
    }

    return isRtl
      ? 'علياء السيابية محللة أنظمة ومبرمجة مقرها مسقط، بخلفية في هندسة العمليات وخبرة منذ 2021 في تحليل الأنظمة وتطوير البرمجيات لدى شركة أمان. يمكنك طرح أي سؤال عن مشاريعها أو مهاراتها!'
      : 'Alya Al-Siyabi is a Muscat-based Systems Analyst & Programmer with a Process Engineering background, working at AMAN since 2021 on requirements analysis, system design, and full-stack development. Feel free to ask about her projects or skills!';
  };

  const handleSend = async (query: string): Promise<string | null> => {
    if (!query.trim() || isLoading) return null;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    let reply: string | null = null;

    if (selectedModel === 'groq') {
      reply = await callGroqAPI(query, 'allam-2-7b');
    } else if (selectedModel === 'gpt20b') {
      reply = await callGroqAPI(query, 'openai/gpt-oss-20b');
    }

    // Fallback if API returned null
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
    return reply;
  };

  const modelLabels: Record<ModelProvider, string> = {
    groq: 'ALLaM 2.0 (Arabic & English 0.1s)',
    gpt20b: 'GPT-OSS 20B (Groq LPU)',
  };

  return {
    isRtl,
    messages,
    isLoading,
    selectedModel,
    setSelectedModel,
    modelLabels,
    quickQuestions,
    handleSend,
  };
}
