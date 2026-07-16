export interface SiteConfig {
  language: string
  siteTitle: string
  siteDescription: string
}

export interface NavigationLink {
  label: string
  target: string
}

export interface NavigationConfig {
  brandName: string
  links: NavigationLink[]
}

export interface HeroConfig {
  videoPath: string
  eyebrow: string
  titleLine: string
  titleEmphasis: string
  subtitleLine1: string
  subtitleLine2: string
  ctaText: string
  ctaTargetId: string
  tagline: string
  contactCta: string
}

export interface ManifestoConfig {
  sectionLabel: string
  text: string
}

export interface AnatomyPillar {
  label: string
  title: string
  body: string
}

export interface AnatomyConfig {
  sectionLabel: string
  title: string
  pillars: AnatomyPillar[]
}

export interface ExperienceEntry {
  title: string
  company: string
  period: string
}

export interface ExperienceConfig {
  sectionLabel: string
  title: string
  entries: ExperienceEntry[]
}

export interface EducationEntry {
  degree: string
  institution: string
  period: string
  status?: string
}

export interface EducationConfig {
  sectionLabel: string
  title: string
  entries: EducationEntry[]
}

export interface WorkshopsConfig {
  sectionLabel: string
  title: string
  items: string[]
}

export interface ProjectConfig {
  name: string
  role: string
  contribution: string
  client: string
  image?: string
}

export interface ProjectsConfig {
  sectionLabel: string
  title: string
  projects: ProjectConfig[]
}

export interface ContactConfig {
  sectionLabel: string
  title: string
  subtitle: string
  items: {
    icon: string
    value: string
  }[]
  socialLinks: {
    label: string
    href: string
  }[]
}

export interface FooterColumn {
  heading: string
  links: {
    label: string
    href: string
  }[]
}

export interface FooterConfig {
  brandName: string
  brandTaglineLines: string[]
  columns: FooterColumn[]
  copyright: string
}

// ─── Site Config ───────────────────────────────────────────

export const siteConfig: SiteConfig = {
  language: "en",
  siteTitle: "Alya Al Siyabi — Systems Analyst & Developer",
  siteDescription: "Alya Al Siyabi is a Systems Analyst and Developer at AMAN, based in Muscat, Oman. Specializing in digital transformation, web development, and process engineering.",
}

// ─── Navigation ────────────────────────────────────────────

export const navigationConfig: NavigationConfig = {
  brandName: "ALYA.",
  links: [
    { label: "ABOUT", target: "#manifesto" },
    { label: "EXPERIENCE", target: "#experience" },
    { label: "SKILLS", target: "#skills" },
    { label: "PROJECTS", target: "#projects" },
    { label: "CONTACT", target: "#contact" },
  ],
}

// ─── Hero ──────────────────────────────────────────────────

export const heroConfig: HeroConfig = {
  videoPath: "videos/hero.mp4",
  eyebrow: "SYSTEMS ANALYST & DEVELOPER",
  titleLine: "ALYA AL SIYABI",
  titleEmphasis: "Digital Transformation",
  subtitleLine1: "Systems Analyst at AMAN.",
  subtitleLine2: "Based in Muscat, Oman.",
  ctaText: "View My Work",
  ctaTargetId: "#projects",
  tagline: "Let's build the next challenge together",
  contactCta: "Contact Me",
}

// ─── About / Manifesto ─────────────────────────────────────

export const manifestoConfig: ManifestoConfig = {
  sectionLabel: "ABOUT ME",
  text: "With over 5 years of professional experience in Systems Analysis, combined with a background in Chemical Engineering and Digital Marketing, I bring a unique blend of technical and analytical expertise. Currently pursuing a Master's in Digital Transformation and Innovation at UTAS, I have participated in numerous workshops and training programs inside and outside Oman, continuously demonstrating creative initiatives and ideas for tackling complex challenges.",
}

// ─── Professional Experience ───────────────────────────────

export const experienceConfig: ExperienceConfig = {
  sectionLabel: "CAREER",
  title: "Professional Experience",
  entries: [
    {
      title: "Systems Analyst  & Coder",
      company: "AMAN",
      period: "2021 – Present",
    },
    {
      title: "Chemical Engineer Trainee",
      company: "Tkavin Engineering Consultancy",
      period: "2018 – 2019",
    },
    {
      title: "Digital Marketing",
      company: "The World of Muscat Real-estate",
      period: "2017 – 2018",
    },
    {
      title: "Chemical Engineer Trainee",
      company: "Public Authority for Water",
      period: "2016",
    },
  ],
}

// ─── Skills / Anatomy ──────────────────────────────────────

export const anatomyConfig: AnatomyConfig = {
  sectionLabel: "EXPERTISE",
  title: "Technical Skills",
  pillars: [
    {
      label: "01 — DESIGN",
      title: "Design Tools",
      body: "Proficient in Figma for UI/UX design, Adobe Photoshop for image editing, Canva for marketing materials, and Microsoft Visio for system architecture and process flow diagrams.",
    },
    {
      label: "02 — FRAMEWORKS",
      title: "Programming Frameworks",
      body: "Experienced with Laravel for PHP applications, ASP.NET 5 using MVC and Clean Architecture patterns, Next.js for React-based web applications, and Angular for enterprise frontend development.",
    },
    {
      label: "03 — LANGUAGES",
      title: "Programming Languages",
      body: "Strong command of HTML, CSS, PHP, JavaScript, C#, and MySQL. Building complete web applications from frontend interfaces to backend databases and API integrations.",
    },
    {
      label: "04 — SYSTEMS",
      title: "Systems & Tools",
      body: "Skilled in system design and system testing methodologies. Proficient with GitHub and GitLab for version control, Power BI for data visualization and reporting, and WordPress for content management.",
    },
    {
      label: "05 — ENGINEERING",
      title: "Process Engineering",
      body: "Background in chemical process engineering using ChemCad for process simulation and MATLAB for numerical analysis and data processing.",
    },
  ],
}

// ─── Education ─────────────────────────────────────────────

export const educationConfig: EducationConfig = {
  sectionLabel: "EDUCATION",
  title: "Certifications & Education",
  entries: [
    {
      degree: "Master of Digital Transformation and Innovation",
      institution: "University of Technology and Applied Sciences (UTAS)",
      period: "2026 – 2027",
      status: "In Progress",
    },
    {
      degree: "Bachelor of Science in Process Engineering",
      institution: "German University of Technology in Oman (GUtech)",
      period: "2012 – 2017",
    },
  ],
}

// ─── Workshops & Training ──────────────────────────────────

export const workshopsConfig: WorkshopsConfig = {
  sectionLabel: "CONTINUOUS LEARNING",
  title: "Workshops & Training",
  items: [
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
    "Dubai Future Foundation Program",
  ],
}

// ─── Projects / Work Experience ────────────────────────────

export const projectsConfig: ProjectsConfig = {
  sectionLabel: "WORK EXPERIENCE",
  title: "Relevant Projects",
  projects: [
    {
      name: "Elite Company",
      role: "Developer / Systems Analyst",
      contribution: "Participated in design and development; contributed to demo using Power BI and building system",
      client: "Ministry of Commerce, Industry, and Investment Promotion (MOCIP)",
      image: "images/elite.png",
    },
    {
      name: "Agrohub",
      role: "Developer",
      contribution: "Main developer",
      client: "ADC Somalia",
      image: "images/agro.png",
    },
    {
      name: "Fostering System",
      role: "Developer / Systems Analyst",
      contribution: "Participated in design and development, contributed to demo",
      client: "Small and Medium Enterprise Development Authority (ASMED)",
      image: "images/Tassaid.png",
    },
    {
      name: "Al-Washaq System",
      role: "Developer / Systems Analyst",
      contribution: "Developed system modules",
      client: "Environmental Authority (EA)",
      image: "images/washaq.png",
    },
    {
      name: "Consultancy Hub and Job Portal",
      role: "Developer",
      contribution: "Developed application functionality",
      client: "Aman",
      image: "images/jobportaman.png",
    },
    {
      name: "Simple Ticketing System",
      role: "Developer",
      contribution: "Developed core features",
      client: "Aman",
    },
    {
      name: "Rakeeza Website",
      role: "Web Developer",
      contribution: "Developed and maintained website",
      client: "Rakeeza",
      image: "images/rakeeza.png",
    },
    {
      name: "Aluminum Watad Website",
      role: "Web Developer",
      contribution: "Developed and maintained website",
      client: "Aluminum Watad",
      image: "images/watad.png",
    },
    {
      name: "Alfaisal Medical Services Website",
      role: "Web Developer",
      contribution: "Developed and maintained website",
      client: "Alfaisal Medical Services",
    },
    {
      name: "AI Chatbots (TRA & DXB Chat)",
      role: "Tester",
      contribution: "Tested AI chatbots",
      client: "TRA / Dubai Airports",
      image: "images/tra_chatbot.png",
    },
    {
      name: "Multiple RFPs",
      role: "Systems Analyst",
      contribution: "Conducted requirements analysis",
      client: "Various",
    },
  ],
}

// ─── Contact ───────────────────────────────────────────────

export const contactConfig: ContactConfig = {
  sectionLabel: "GET IN TOUCH",
  title: "Let's Connect",
  subtitle: "Open to discussing new projects, collaboration opportunities, or systems analysis consulting.",
  items: [
    { icon: "Mail", value: "Alya_alsiyabi93@outlook.com" },
    { icon: "MapPin", value: "Al-Seeb, Muscat, Oman" },
  ],
  socialLinks: [
    { label: "LinkedIn", href: "#" },
    { label: "GitHub", href: "#" },
  ],
}

// ─── Footer ────────────────────────────────────────────────

export const footerConfig: FooterConfig = {
  brandName: "ALYA.",
  brandTaglineLines: ["Systems Analyst.", "Developer.", "Process Engineer."],
  columns: [
    {
      heading: "NAVIGATE",
      links: [
        { label: "About", href: "#manifesto" },
        { label: "Experience", href: "#experience" },
        { label: "Skills", href: "#skills" },
        { label: "Projects", href: "#projects" },
        { label: "Contact", href: "#contact" },
      ],
    },
    {
      heading: "CONNECT",
      links: [
        { label: "Email", href: "mailto:Alya_alsiyabi93@outlook.com" },
        { label: "LinkedIn", href: "#" },
        { label: "GitHub", href: "#" },
      ],
    },
  ],
  copyright: "\u00A9 2025 Alya Al Siyabi. All rights reserved.",
}
