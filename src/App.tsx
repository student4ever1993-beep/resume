import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
import { ThemeProvider } from './context/ThemeContext';
import HeroSphere from './effects/HeroSphere';

function App() {
  useLenis();
  const { t, i18n } = useTranslation();

  // Tab title and meta description follow the selected language
  // (<html lang/dir> is handled in i18n.ts).
  useEffect(() => {
    document.title = t('site.title');

    let metaDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = t('site.description');
  }, [t, i18n.language]);

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
