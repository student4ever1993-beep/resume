import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      site: {
        title: "Alya Al Siyabi — Systems Analyst & Developer",
        description: "Alya Al Siyabi is a Systems Analyst and Developer at AMAN, based in Muscat, Oman."
      },
      nav: {
        about: "ABOUT",
        experience: "EXPERIENCE",
        skills: "SKILLS",
        projects: "PROJECTS",
        contact: "CONTACT"
      },
      hero: {
        eyebrow: "SYSTEMS ANALYST & DEVELOPER",
        titleLine: "ALYA AL SIYABI",
        titleEmphasis: "Digital Transformation",
        subtitleLine1: "Systems Analyst at AMAN.",
        subtitleLine2: "Based in Muscat, Oman.",
        ctaText: "View My Work",
        tagline: "Let's build the next challenge together",
        contactCta: "Contact Me"
      },
      manifesto: {
        sectionLabel: "ABOUT ME",
        text: "With over 5 years of professional experience in Systems Analysis, combined with a background in Chemical Engineering and Digital Marketing, I bring a unique blend of technical and analytical expertise. Currently pursuing a Master's in Digital Transformation and Innovation at UTAS, I have participated in numerous workshops and training programs inside and outside Oman, continuously demonstrating creative initiatives and ideas for tackling complex challenges.",
        introQuote: "Bridging the gap between process engineering, software systems, and digital strategy.",
        stats: {
          experience: { value: "5+ Years", label: "Systems Analysis" },
          masters: { value: "MSc UTAS", label: "Digital Innovation" },
          bachelors: { value: "BSc GUtech", label: "Process Engineering" },
          projects: { value: "11+ Systems", label: "Delivered Projects" }
        }
      },
      experience: {
        sectionLabel: "CAREER",
        title: "Professional Experience",
        entries: [
          {
            title: "Systems Analyst  & Coder",
            company: "AMAN",
            period: "2021 – Present"
          },
          {
            title: "Chemical Engineer Trainee",
            company: "Tkavin Engineering Consultancy",
            period: "2018 – 2019"
          },
          {
            title: "Digital Marketing",
            company: "The World of Muscat Real-estate",
            period: "2017 – 2018"
          },
          {
            title: "Chemical Engineer Trainee",
            company: "Public Authority for Water",
            period: "2016"
          }
        ]
      },
      skills: {
        sectionLabel: "EXPERTISE",
        title: "Technical Skills",
        pillars: [
          {
            label: "01 — DESIGN",
            title: "Design Tools",
            body: "Proficient in Figma for UI/UX design, Adobe Photoshop for image editing, Canva for marketing materials, and Microsoft Visio for system architecture and process flow diagrams."
          },
          {
            label: "02 — FRAMEWORKS",
            title: "Programming Frameworks",
            body: "Experienced with Laravel for PHP applications, ASP.NET 5 using MVC and Clean Architecture patterns, Next.js for React-based web applications, and Angular for enterprise frontend development."
          },
          {
            label: "03 — LANGUAGES",
            title: "Programming Languages",
            body: "Strong command of HTML, CSS, PHP, JavaScript, C#, and MySQL. Building complete web applications from frontend interfaces to backend databases and API integrations."
          },
          {
            label: "04 — SYSTEMS",
            title: "Systems & Tools",
            body: "Skilled in system design and system testing methodologies. Proficient with GitHub and GitLab for version control, Power BI for data visualization and reporting, and WordPress for content management."
          },
          {
            label: "05 — ENGINEERING",
            title: "Process Engineering",
            body: "Background in chemical process engineering using ChemCad for process simulation and MATLAB for numerical analysis and data processing."
          }
        ]
      },
      education: {
        sectionLabel: "EDUCATION",
        title: "Certifications & Education",
        entries: [
          {
            degree: "Master of Digital Transformation and Innovation",
            institution: "University of Technology and Applied Sciences (UTAS)",
            period: "2026 – 2027",
            status: "In Progress"
          },
          {
            degree: "Bachelor of Science in Process Engineering",
            institution: "German University of Technology in Oman (GUtech)",
            period: "2012 – 2017"
          }
        ],
        workshopsLabel: "CONTINUOUS LEARNING",
        workshopsTitle: "Workshops & Training",
        workshops: [
          "Enterprise Bot Advanced and Enterprise Bot Basics",
          "Entry Certificate in Business Analysis (ECBA)",
          "IC3 Digital Literacy Certification",
          "Introduction to LangChain & Introduction to LangGraph",
          "Social Media in Marketing",
          "OVY Program for Entrepreneurial Development in Frontier Technology",
          "Modern Measurement Techniques, Aachen University, Germany",
          "Introduction to Cyber Security",
          "Introduction to PMP",
          "KLI Linux Beginner Course",
          "Earth Observation Workshops / Training",
          "Dubai Future Foundation Program"
        ]
      },
      projects: {
        sectionLabel: "WORK EXPERIENCE",
        title: "Relevant Projects",
        clientLabel: "Client",
        list: [
          {
            name: "Elite Company",
            role: "Developer / Systems Analyst",
            contribution: "Participated in design and development; contributed to demo using Power BI and building system",
            client: "Ministry of Commerce, Industry, and Investment Promotion (MOCIP)"
          },
          {
            name: "Agrohub",
            role: "Developer",
            contribution: "Main developer",
            client: "ADC Somalia"
          },
          {
            name: "Fostering System",
            role: "Developer / Systems Analyst",
            contribution: "Participated in design and development, contributed to demo",
            client: "Small and Medium Enterprise Development Authority (ASMED)"
          },
          {
            name: "Al-Washaq System",
            role: "Developer / Systems Analyst",
            contribution: "Developed system modules",
            client: "Environmental Authority (EA)"
          },
          {
            name: "Consultancy Hub and Job Portal",
            role: "Developer",
            contribution: "Developed application functionality",
            client: "Aman"
          },
          {
            name: "Simple Ticketing System",
            role: "Developer",
            contribution: "Developed core features",
            client: "Aman"
          },
          {
            name: "Rakeeza Website",
            role: "Web Developer",
            contribution: "Developed and maintained website",
            client: "Rakeeza"
          },
          {
            name: "Aluminum Watad Website",
            role: "Web Developer",
            contribution: "Developed and maintained website",
            client: "Aluminum Watad"
          },
          {
            name: "Alfaisal Medical Services Website",
            role: "Web Developer",
            contribution: "Developed and maintained website",
            client: "Alfaisal Medical Services"
          },
          {
            name: "AI Chatbots (TRA & DXB Chat)",
            role: "Tester",
            contribution: "Tested AI chatbots",
            client: "TRA / Dubai Airports"
          },
          {
            name: "Multiple RFPs",
            role: "Systems Analyst",
            contribution: "Conducted requirements analysis",
            client: "Various"
          }
        ]
      },
      contact: {
        sectionLabel: "GET IN TOUCH",
        title: "Let's Connect",
        subtitle: "Open to discussing new projects, collaboration opportunities, or systems analysis consulting."
      },
      footer: {
        tagline: ["Systems Analyst.", "Developer.", "Process Engineer."],
        columns: {
          navigate: "NAVIGATE",
          connect: "CONNECT"
        },
        copyright: "© 2025 Alya Al Siyabi. All rights reserved."
      }
    }
  },
  ar: {
    translation: {
      site: {
        title: "علياء السيابية — محلل نظم ومطورة برمجيات",
        description: "علياء السيابية هي محلل نظم ومطورة في شركة أمان للاستشارات وتطوير الأعمال، مقيمة في مسقط، سلطنة عمان."
      },
      nav: {
        about: "نبذة عني",
        experience: "الخبرة المهنية",
        skills: "المهارات التقنية",
        projects: "المشاريع",
        contact: "اتصل بي"
      },
      hero: {
        eyebrow: "محلل نظم ومطورة برمجيات",
        titleLine: "علياء السيابية",
        titleEmphasis: "التحول الرقمي",
        subtitleLine1: "محلل نظم في شركة أمان للاستشارات وتطوير الأعمال.",
        subtitleLine2: "مسقط، سلطنة عمان.",
        ctaText: "عرض أعمالي",
        tagline: "لنبني التحدي القادم معاً",
        contactCta: "تواصل معي"
      },
      manifesto: {
        sectionLabel: "نبذة عني",
        text: "مع أكثر من 5 سنوات من الخبرة المهنية في تحليل النظم، بالإضافة إلى خلفية في الهندسة الكيميائية والتسويق الرقمي، أمتلك مزيجاً فريداً من الخبرات التقنية والتحليلية. أتابع حالياً دراسة الماجستير في التحول الرقمي والابتكار في جامعة التقنية والعلوم التطبيقية (UTAS)، وشاركت في العديد من ورش العمل والبرامج التدريبية داخل وخارج سلطنة عمان، مع السعي المستمر لتقديم مبادرات وأفكار إبداعية لمواجهة التحديات المعقدة.",
        introQuote: "ربط الفجوة بين هندسة العمليات، النظم البرمجية، واستراتيجيات التحول الرقمي.",
        stats: {
          experience: { value: "٥+ سنوات", label: "البرمجة وتحليل النظم والعمليات" },
          masters: { value: "ماجستير UTAS", label: "الابتكار الرقمي" },
          bachelors: { value: "بكالوريوس GUtech", label: "هندسة العمليات" },
          projects: { value: "١١+ مشروعاً", label: "الأنظمة المنفذة" }
        }
      },
      experience: {
        sectionLabel: "المسار المهني",
        title: "الخبرة المهنية",
        entries: [
          {
            title: "محلل نظم ومبرمجة –  التحول الرقمي",
            company: "أمان للاستشارات وتطوير الأعمال",
            period: "2021 – الحالي"
          },
          {
            title: "مهندسة كيميائية متدربة",
            company: "تكافيين للاستشارات الهندسية",
            period: "2018 – 2019"
          },
          {
            title: "التسويق الرقمي",
            company: "عالم مسقط للعقارات",
            period: "2017 – 2018"
          },
          {
            title: "مهندسة كيميائية متدربة",
            company: "الهيئة العامة للمياه (ديم)",
            period: "2016"
          }
        ]
      },
      skills: {
        sectionLabel: "الخبرات والمهارات",
        title: "المهارات التقنية",
        pillars: [
          {
            label: "01 — التصميم",
            title: "أدوات التصميم",
            body: "متمرسة في استخدام Figma لتصميم واجهات وتجربة المستخدم، وPhotoshop لتحرير الصور، وCanva لتصميم المواد التسويقية، وMicrosoft Visio لرسم بنية النظم ومخططات سير العمليات."
          },
          {
            label: "02 — إطارات العمل",
            title: "إطارات عمل البرمجة",
            body: "ذات خبرة في Laravel لتطبيقات PHP، وASP.NET 5 باستخدام نمط MVC وبنية الهندسة النظيفة (Clean Architecture)، وNext.js لتطبيقات الويب المعتمدة على React، وAngular لتطوير الواجهات الأمامية للمؤسسات."
          },
          {
            label: "03 — لغات البرمجة",
            title: "لغات البرمجة",
            body: "إجادة تامة للغات HTML وCSS وPHP وJavaScript و#C وقواعد بيانات MySQL. بناء تطبيقات ويب متكاملة من الواجهات الأمامية وحتى خوادم قواعد البيانات وتكامل الواجهات البرمجية (APIs)."
          },
          {
            label: "04 — النظم والأدوات",
            title: "النظم والأدوات",
            body: "مهارة عالية في تصميم النظم ومنهجيات اختبار النظم. متمرسة في استخدام GitHub وGitLab لإدارة النسخ، وPower BI لتحليل وعرض البيانات والتقارير، ونظام WordPress لإدارة المحتوى."
          },
          {
            label: "05 — هندسة العمليات",
            title: "هندسة العمليات الكيميائية",
            body: "خلفية في هندسة العمليات الكيميائية باستخدام برنامج ChemCad لمحاكاة العمليات وبرنامج MATLAB للتحليل العددي ومعالجة البيانات."
          }
        ]
      },
      education: {
        sectionLabel: "التعليم والشهادات",
        title: "الشهادات والتعليم",
        entries: [
          {
            degree: "ماجستير التحول الرقمي والابتكار",
            institution: "جامعة التقنية والعلوم التطبيقية (UTAS)",
            period: "2026 – 2027",
            status: "قيد الدراسة"
          },
          {
            degree: "بكالوريوس العلوم في هندسة العمليات",
            institution: "الجامعة الألمانية للتكنولوجيا في عمان (جيوتك)",
            period: "2012 – 2017"
          }
        ],
        workshopsLabel: "التعليم المستمر",
        workshopsTitle: "ورش العمل والتدريب",
        workshops: [
          "برنامج بوت المؤسسات المتقدم والأساسي (Enterprise Bot)",
          "شهادة في تحليل الأعمال (ECBA)",
          "الرخصة الدولية لقيادة الحاسب الآلي (IC3)",
          "مقدمة في LangChain ومقدمة في LangGraph",
          "وسائل التواصل الاجتماعي في التسويق",
          "برنامج OVY لتطوير ريادة الأعمال في التكنولوجيا المتقدمة",
          "تقنيات القياس الحديثة، جامعة آخن، ألمانيا",
          "مقدمة في الأمن السيبراني",
          "مقدمة في إدارة المشاريع الاحترافية (PMP)",
          "دورة مبتدئ في نظام التشغيل Linux",
          "ورش عمل وتدريب رصد الأرض",
          "برنامج مؤسسة دبي للمستقبل"
        ]
      },
      projects: {
        sectionLabel: "المشاريع والخبرات العملية",
        title: "المشاريع ذات الصلة",
        clientLabel: "الجهة المستفيدة",
        list: [
          {
            name: "الشركات المجيدة  (Elite Company)",
            role: "مطور / محلل نظم",
            contribution: "المساهمة في التصميم والتطوير وبناء النظام واستخدام Power BI للعرض التوضيحي",
            client: "وزارة التجارة والصناعة وترويج الاستثمار"
          },
          {
            name: "أجروهب (Agrohub)",
            role: "مطور برمجيات",
            contribution: "المطور الرئيسي للمشروع",
            client: "مركز تطوير الزراعة بالصومال (ADC Somalia)"
          },
          {
            name: "نظام تصعيد (Tassaid)",
            role: "مطور / محلل نظم",
            contribution: "المساهمة في التصميم والتطوير وإعداد العرض التوضيحي للنظام",
            client: "هيئة تنمية المؤسسات الصغيرة والمتوسطة (ريادة)"
          },
          {
            name: "نظام الوشق (Al-Washaq)",
            role: "مطور / محلل نظم",
            contribution: "تطوير وبناء الوحدات البرمجية للنظام",
            client: "هيئة البيئة"
          },
          {
            name: "منصة الاستشارات وبوابة الوظائف",
            role: "مطور برمجيات",
            contribution: "تطوير الوظائف البرمجية والميزات للمنصة",
            client: "شركة أمان"
          },
          {
            name: "نظام التذاكر البسيط",
            role: "مطور برمجيات",
            contribution: "تطوير الميزات والوظائف الأساسية للنظام",
            client: "شركة أمان"
          },
          {
            name: "موقع ركيزة الإلكتروني",
            role: "مطور ويب",
            contribution: "تطوير وصيانة الموقع الإلكتروني بالكامل",
            client: "شركة ركيزة"
          },
          {
            name: "موقع ألمنيوم وتد",
            role: "مطور ويب",
            contribution: "تطوير وصيانة الموقع الإلكتروني",
            client: "شركة ألمنيوم وتد"
          },
          {
            name: "موقع الفيصل للخدمات الطبية",
            role: "مطور ويب",
            contribution: "تطوير وصيانة الموقع الإلكتروني للشركة",
            client: "مجموعة الفيصل للخدمات الطبية"
          },
          {
            name: "روبوتات الدردشة التفاعلية (TRA & DXB Chat)",
            role: "فاحص جودة وأنظمة",
            contribution: "اختبار جودة ورصد أداء روبوتات الدردشة بالذكاء الاصطناعي",
            client: "هيئة تنظيم الاتصالات / مطارات دبي"
          },
          {
            name: "كراسات الشروط الفنية المتعددة (RFPs)",
            role: "محلل نظم",
            contribution: "إجراء تحليل المتطلبات ودراسة كراسات الشروط الفنية والمناقصات",
            client: "جهات متعددة"
          }
        ]
      },
      contact: {
        sectionLabel: "تواصل معي",
        title: "لنعمل معاً",
        subtitle: "أرحب دائماً بمناقشة المشاريع الجديدة، فرص التعاون، أو الاستشارات الفنية والتقنية."
      },
      footer: {
        tagline: ["محللة نظم.", "مطورة برمجيات.", "مهندسة عمليات."],
        columns: {
          navigate: "التنقل",
          connect: "روابط التواصل"
        },
        copyright: "© 2025 علياء السيابية. جميع الحقوق محفوظة."
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

// Handle direction change based on language
i18n.on('languageChanged', (lng) => {
  const dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;

  // Apply fonts or classes if needed
  if (lng === 'ar') {
    document.documentElement.classList.add('rtl-font');
  } else {
    document.documentElement.classList.remove('rtl-font');
  }
});

export default i18n;
