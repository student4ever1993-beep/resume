import { useEffect } from 'react';
import { useLenis } from './hooks/useLenis';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import Manifesto from './sections/Manifesto';
import Experience from './sections/Experience';
import Anatomy from './sections/Anatomy';
import Education from './sections/Education';
import Projects from './sections/Projects';
import Contact from './sections/Contact';
import ChatWidget from './components/ChatWidget';
import ParchmentUnroll from './effects/ParchmentUnroll';
import { siteConfig } from './config';
import { ThemeProvider } from './context/ThemeContext';
import HeroSphere from './effects/HeroSphere';

function App() {
  useLenis();

  useEffect(() => {
    document.title = siteConfig.siteTitle || '';
    document.documentElement.lang = siteConfig.language || '';

    let metaDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = siteConfig.siteDescription || '';
  }, []);

  return (
    <ThemeProvider>
      <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', backgroundColor: 'var(--bg-primary)', transition: 'background-color 0.4s ease' }}>
        <HeroSphere showSphere={false} />
      </div>
      <Navigation />
      <ParchmentUnroll />
      <main>
        <Hero />
        <Manifesto />
        <Experience />
        <Anatomy />
        <Education />
        <Projects />
        <Contact />
      </main>
      <ChatWidget />
    </ThemeProvider>
  );
}

export default App;
