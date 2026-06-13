import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Cuboid, ExternalLink, LayoutList, Sparkles, X } from 'lucide-react'
import Experience3D from './Experience3D'
import { tourStops } from './PortfolioZones'
import { anatomyConfig, contactConfig, manifestoConfig, projectsConfig, siteConfig } from '@/config'

type ViewMode = 'interactive' | 'classic'

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('interactive')
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [activeTourIndex, setActiveTourIndex] = useState(0)

  const project = useMemo(
    () => projectsConfig.projects.find((item) => item.name === selectedProject),
    [selectedProject],
  )

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      setCursor({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener('pointermove', handlePointerMove)
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [])

  return (
    <main className="min-h-screen overflow-hidden bg-void text-platinum">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-50 opacity-70"
        style={{
          background: `radial-gradient(420px circle at ${cursor.x}px ${cursor.y}px, rgba(0, 212, 255, 0.14), transparent 42%)`,
        }}
      />

      <section className="relative min-h-screen">
        {viewMode === 'interactive' ? (
          <div className="fixed inset-0 h-screen w-screen">
            <Experience3D interactive activeTourStopId={tourStops[activeTourIndex].id} onProjectSelect={setSelectedProject} />
          </div>
        ) : (
          <ClassicPortfolio />
        )}

        <header className="pointer-events-none fixed left-0 right-0 top-0 z-30 flex items-center justify-between px-5 py-4 md:px-8">
          <div className="pointer-events-auto">
            <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-cyan">Interactive portfolio</p>
            <h1 className="mt-1 font-display text-xl text-warm-white md:text-2xl">Alya Alsiyabi</h1>
          </div>
          <div className="pointer-events-auto flex items-center gap-2 border border-cyan/15 bg-void/70 p-1 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setViewMode('interactive')}
              className={`flex h-9 items-center gap-2 px-3 font-mono text-[11px] uppercase tracking-[0.14em] transition ${viewMode === 'interactive' ? 'bg-cyan text-void' : 'text-silver hover:text-platinum'}`}
            >
              <Cuboid className="size-4" />
              3D
            </button>
            <button
              type="button"
              onClick={() => setViewMode('classic')}
              className={`flex h-9 items-center gap-2 px-3 font-mono text-[11px] uppercase tracking-[0.14em] transition ${viewMode === 'classic' ? 'bg-cyan text-void' : 'text-silver hover:text-platinum'}`}
            >
              <LayoutList className="size-4" />
              2D
            </button>
          </div>
        </header>

        {viewMode === 'interactive' && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-5 left-5 right-5 z-30 border border-cyan/15 bg-void/78 p-4 backdrop-blur-md md:bottom-8 md:left-8 md:right-auto md:w-[560px]"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan">Default tour</p>
                <h2 className="mt-1 font-display text-2xl text-warm-white">{tourStops[activeTourIndex].title}</h2>
              </div>
              <p className="font-mono text-sm text-cyan">{tourStops[activeTourIndex].number}/04</p>
            </div>
            <div className="mb-4 grid grid-cols-4 gap-2">
              {tourStops.map((stop, index) => (
                <button
                  key={stop.id}
                  type="button"
                  onClick={() => setActiveTourIndex(index)}
                  className={`h-10 border px-2 font-mono text-[10px] uppercase tracking-[0.12em] transition ${activeTourIndex === index ? 'border-cyan bg-cyan text-void' : 'border-cyan/15 text-silver hover:text-platinum'}`}
                >
                  {stop.title}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setActiveTourIndex((index) => Math.max(0, index - 1))}
                disabled={activeTourIndex === 0}
                className="grid size-10 place-items-center border border-cyan/20 text-cyan transition hover:bg-cyan hover:text-void disabled:pointer-events-none disabled:opacity-35"
              >
                <ArrowLeft className="size-4" />
              </button>
              <p className="text-sm leading-6 text-silver">Follow the portfolio in order: About Me, Education, Skills, then Projects. Click project images at the final stop for details.</p>
              <button
                type="button"
                onClick={() => setActiveTourIndex((index) => Math.min(tourStops.length - 1, index + 1))}
                disabled={activeTourIndex === tourStops.length - 1}
                className="grid size-10 place-items-center border border-cyan/20 text-cyan transition hover:bg-cyan hover:text-void disabled:pointer-events-none disabled:opacity-35"
              >
                <ArrowRight className="size-4" />
              </button>
            </div>
          </motion.div>
        )}
      </section>

      <AnimatePresence>
        {project && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-void/76 px-5 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.article
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              className="relative w-full max-w-2xl border border-cyan/20 bg-charcoal p-6 shadow-glow md:p-8"
            >
              <button type="button" onClick={() => setSelectedProject(null)} className="absolute right-4 top-4 grid size-9 place-items-center border border-cyan/20 text-silver transition hover:text-platinum">
                <X className="size-4" />
              </button>
              <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-cyan">{project.tag}</p>
              <h2 className="mt-3 pr-10 font-display text-3xl text-warm-white">{project.name}</h2>
              <p className="mt-4 leading-7 text-silver">{project.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span key={tech} className="border border-cyan/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

function ClassicPortfolio() {
  return (
    <div className="relative z-10 mx-auto max-w-6xl px-5 pb-24 pt-32 md:px-8">
      <section className="min-h-[72vh] max-w-4xl pt-14">
        <div className="mb-6 flex items-center gap-2 text-cyan">
          <Sparkles className="size-5" />
          <p className="font-mono text-xs uppercase tracking-[0.28em]">{siteConfig.siteDescription}</p>
        </div>
        <h2 className="font-display text-5xl leading-tight text-warm-white md:text-7xl">Digital solutions shaped by engineering thinking.</h2>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-silver">{manifestoConfig.text}</p>
      </section>

      <section className="grid gap-5 py-16 md:grid-cols-2" id="skills">
        {anatomyConfig.pillars.map((pillar) => (
          <article key={pillar.title} className="border border-cyan/15 bg-charcoal/70 p-5 backdrop-blur">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan">{pillar.label}</p>
            <h3 className="mt-3 font-display text-2xl text-warm-white">{pillar.title}</h3>
            <p className="mt-3 leading-7 text-silver">{pillar.body}</p>
          </article>
        ))}
      </section>

      <section className="py-16" id="projects">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan">{projectsConfig.sectionLabel}</p>
        <h2 className="mt-3 font-display text-4xl text-warm-white">{projectsConfig.title}</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {projectsConfig.projects.slice(0, 8).map((project) => (
            <article key={project.name} className="border border-cyan/15 bg-charcoal/70 p-5 backdrop-blur">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">{project.tag}</p>
              <h3 className="mt-3 font-display text-2xl text-warm-white">{project.name}</h3>
              <p className="mt-3 leading-7 text-silver">{project.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span key={tech} className="border border-cyan/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-cyan">
                    {tech}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="py-16" id="contact">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan">{contactConfig.sectionLabel}</p>
        <h2 className="mt-3 font-display text-4xl text-warm-white">{contactConfig.title}</h2>
        <p className="mt-4 max-w-2xl leading-7 text-silver">{contactConfig.subtitle}</p>
        <a className="mt-8 inline-flex items-center gap-2 border border-cyan/25 px-5 py-3 font-mono text-xs uppercase tracking-[0.18em] text-cyan transition hover:bg-cyan hover:text-void" href="mailto:Alya_alsiyabi93@outlook.com">
          Contact Alya
          <ExternalLink className="size-4" />
        </a>
      </section>
    </div>
  )
}
