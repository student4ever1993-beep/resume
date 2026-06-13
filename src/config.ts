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

export interface ProjectConfig {
  name: string
  tag: string
  image: string
  description: string
  techStack: string[]
  ctaText: string
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
  siteTitle: "Alya Alsiyabi — Developer & Systems Analyst",
  siteDescription: "Alya Alsiyabi is a Process Engineer, System Analyst, and Full-Stack Developer based in Muscat, Oman. Specializing in ASP.NET Core, Laravel, React, and digital transformation solutions.",
}

// ─── Navigation ────────────────────────────────────────────

export const navigationConfig: NavigationConfig = {
  brandName: "ALYA.",
  links: [
    { label: "ABOUT", target: "#manifesto" },
    { label: "SKILLS", target: "#skills" },
    { label: "PROJECTS", target: "#projects" },
    { label: "CONTACT", target: "#contact" },
  ],
}

// ─── Hero ──────────────────────────────────────────────────

export const heroConfig: HeroConfig = {
  videoPath: "videos/hero.mp4",
  eyebrow: "SYSTEMS ANALYST & DEVELOPER",
  titleLine: "ALYA ALSIYABI",
  titleEmphasis: "Building Digital Solutions",
  subtitleLine1: "Process Engineer turned full-stack developer.",
  subtitleLine2: "Designing systems, writing code, and driving digital transformation in Muscat, Oman.",
  ctaText: "View My Work",
  ctaTargetId: "#projects",
}

// ─── About / Manifesto ─────────────────────────────────────

export const manifestoConfig: ManifestoConfig = {
  sectionLabel: "ABOUT ME",
  text: "With a foundation in Process Engineering and a master's journey in Digital Transformation, I bridge the gap between complex systems and elegant software. At AMAN Consultancy, I gather requirements, architect solutions, and build full-stack applications using ASP.NET Core, Laravel, and modern JavaScript frameworks. I speak three languages, hold certifications in AI and business analysis, and believe that great software is born from understanding people first.",
}

// ─── Skills / Anatomy ──────────────────────────────────────

export const anatomyConfig: AnatomyConfig = {
  sectionLabel: "EXPERTISE",
  title: "Skills & Technologies",
  pillars: [
    {
      label: "01 — INTERFACE",
      title: "Frontend Development",
      body: "Building responsive, interactive user interfaces with React, Angular, Next.js, HTML5, CSS3, and JavaScript. I transform complex requirements into clean, accessible, and performant web experiences that users genuinely enjoy.",
    },
    {
      label: "02 — ARCHITECTURE",
      title: "Backend Systems",
      body: "Developing robust server-side applications with ASP.NET Core MVC, Laravel, and clean architecture principles. From database design to RESTful APIs, I build systems that scale and maintain well over time.",
    },
    {
      label: "03 — INSIGHTS",
      title: "Data & Analytics",
      body: "Creating data-driven solutions using Power BI, SQL, and modern visualization techniques. I turn raw data into actionable business intelligence that drives strategic decision-making.",
    },
    {
      label: "04 — CRAFT",
      title: "Design & Tools",
      body: "Proficient in Figma, Canva, and Photoshop for UI/UX design. Combined with Microsoft Office Suite, ChemCad, and strong business analysis skills, I deliver end-to-end digital solutions.",
    },
  ],
}

// ─── Projects ──────────────────────────────────────────────

export const projectsConfig: ProjectsConfig = {
  sectionLabel: "SELECTED WORK",
  title: "Featured Projects",
  projects: [
    {
      name: "AMAN Consultancy Platform",
      tag: "FULL-STACK APPLICATION",
      image: "images/project-aman.jpg",
      description: "A comprehensive business consultancy platform built for AMAN Consultancy and Business Development. The system streamlines client requirement gathering, proposal generation, and project tracking. Features include stakeholder interview management, system specification workflows, and automated proposal generation.",
      techStack: ["ASP.NET Core MVC", "Clean Architecture", "Laravel", "SQL Server", "JavaScript"],
      ctaText: "View Details",
    },
    {
      name: "Digital Transformation Dashboard",
      tag: "DATA ANALYTICS",
      image: "images/project-dashboard.jpg",
      description: "An interactive business intelligence dashboard developed to visualize digital transformation KPIs. Integrates multiple data sources into unified reporting views with real-time metrics, trend analysis, and executive summaries for strategic planning.",
      techStack: ["Power BI", "React", "REST APIs", "Figma", "Data Modeling"],
      ctaText: "View Details",
    },
  ],
}

// ─── Contact ───────────────────────────────────────────────

export const contactConfig: ContactConfig = {
  sectionLabel: "GET IN TOUCH",
  title: "Let's Build Something Together",
  subtitle: "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.",
  items: [
    { icon: "Phone", value: "+968-9511-9284" },
    { icon: "Mail", value: "Alya_alsiyabi93@outlook.com" },
    { icon: "MapPin", value: "Al-Seeb, Muscat, Oman" },
  ],
  socialLinks: [
    { label: "LinkedIn", href: "#" },
    { label: "GitHub", href: "#" },
    { label: "WhatsApp", href: "#" },
  ],
}

// ─── Footer ────────────────────────────────────────────────

export const footerConfig: FooterConfig = {
  brandName: "ALYA.",
  brandTaglineLines: ["Process Engineer.", "System Analyst.", "Developer."],
  columns: [
    {
      heading: "NAVIGATE",
      links: [
        { label: "About", href: "#manifesto" },
        { label: "Skills", href: "#skills" },
        { label: "Projects", href: "#projects" },
        { label: "Contact", href: "#contact" },
      ],
    },
    {
      heading: "EXPERTISE",
      links: [
        { label: "Frontend", href: "#skills" },
        { label: "Backend", href: "#skills" },
        { label: "Data Analytics", href: "#skills" },
        { label: "Design", href: "#skills" },
      ],
    },
    {
      heading: "CONNECT",
      links: [
        { label: "Email", href: "mailto:Alya_alsiyabi93@outlook.com" },
        { label: "LinkedIn", href: "#" },
        { label: "GitHub", href: "#" },
        { label: "WhatsApp", href: "#" },
      ],
    },
  ],
  copyright: "\u00A9 2025 Alya Alsiyabi. All rights reserved.",
}
