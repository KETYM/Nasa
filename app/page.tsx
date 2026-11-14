import { ExperiencePreview } from "@/components/landing/experience-preview";
import { FeatureCard } from "@/components/landing/feature-card";
import { SectionHeading } from "@/components/landing/section-heading";
import { ecosystems } from "@/features/ecosystems/catalog";

const navItems = [
  { label: "OUR PLANET", href: "#ecosystems" },
  { label: "THE EXPERIENCE", href: "#experience" },
  { label: "ABOUT", href: "#about" },
];

export default function Home() {
  return (
    <div id="top" className="min-h-screen bg-[#04171d] text-stone-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#03161d]/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <a href="#top" className="text-sm font-medium uppercase tracking-[0.35em] text-[#f0e8d8]">
            EARTH JUKEBOX
          </a>

          <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[0.7rem] font-medium uppercase tracking-[0.25em] text-slate-200/80 transition hover:text-[#f8f3e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9b36c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#03161d]"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <section className="relative isolate overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-80"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,_rgba(17,76,98,0.75),_rgba(4,23,29,0.86)_42%,_rgba(4,23,29,0.96))]" />
          <div className="grain-overlay absolute inset-0 opacity-50" />

          <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:px-8 lg:py-28">
            <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="max-w-2xl">
                <p className="mb-5 inline-flex rounded-full border border-[#d9b36c]/40 bg-[#d9b36c]/10 px-4 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.28em] text-[#f4dfb1]">
                  NASA Space Apps Challenge 2026
                </p>

                <h1 className="text-5xl font-semibold tracking-[-0.06em] text-[#f8f1e6] sm:text-6xl lg:text-7xl">
                  EARTH JUKEBOX
                </h1>

                <p className="mt-6 text-xl italic text-[#f1d9aa] sm:text-2xl">
                  &ldquo;Somewhere, there is a place called home.&rdquo;
                </p>

                <p className="mt-6 max-w-xl text-lg leading-8 text-slate-200/80">
                  Discover the sounds of our living planet through movement, science and sound.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <a
                    href="#ecosystems"
                    className="inline-flex items-center justify-center rounded-full bg-[#d8b26d] px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#061d28] transition hover:bg-[#e2c889] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f1d9aa] focus-visible:ring-offset-2 focus-visible:ring-offset-[#03161d]"
                  >
                    BEGIN THE EXPERIENCE
                  </a>

                  <a
                    href="#ecosystems"
                    className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#f5efe3] transition hover:border-white/35 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9b36c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#03161d]"
                  >
                    OUR PLANET
                  </a>
                </div>
              </div>

              <div className="relative max-w-md justify-self-end">
                <div className="rounded-[2rem] border border-white/15 bg-[#081e27]/70 p-5 shadow-[0_40px_80px_rgba(2,17,25,0.55)] backdrop-blur-md">
                  <div className="flex items-center justify-between text-[0.6rem] uppercase tracking-[0.28em] text-slate-200/70">
                    <span>Planetary signal</span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-[0.48rem] text-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                      PREVIEW
                    </span>
                  </div>

                  <div className="mt-7 flex items-center gap-5">
                    <div className="earth-globe float-soft relative flex h-24 w-24 items-center justify-center rounded-full border border-white/15" />

                    <div className="flex-1 space-y-3">
                      <div className="h-2.5 w-full rounded-full bg-white/10">
                        <div className="h-2.5 w-3/4 rounded-full bg-[#9fd3c1]" />
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-white/10">
                        <div className="h-2.5 w-2/3 rounded-full bg-[#d5b778]" />
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-white/10">
                        <div className="h-2.5 w-1/2 rounded-full bg-[#81bfe3]" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-3 gap-3 text-left text-xs text-slate-100/80">
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                      <div className="text-[0.52rem] uppercase tracking-[0.25em] text-sky-100/60">
                        Ocean
                      </div>
                      <div className="mt-2 text-base font-medium text-[#f2e9d6]">Current</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                      <div className="text-[0.52rem] uppercase tracking-[0.25em] text-sky-100/60">
                        Forest
                      </div>
                      <div className="mt-2 text-base font-medium text-[#f2e9d6]">Canopy</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                      <div className="text-[0.52rem] uppercase tracking-[0.25em] text-sky-100/60">
                        Atmosphere
                      </div>
                      <div className="mt-2 text-base font-medium text-[#f2e9d6]">Sky</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="ecosystems" className="border-t border-white/10 bg-[#061c26] py-24 sm:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeading
              eyebrow="One planet. Countless stories."
              title="Choose a landscape to enter."
              description="Explore seven living landscapes through an experimental, locally generated soundscape. Each ecosystem opens its own camera and listening experience."
            />

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ecosystems.map((ecosystem) => (
                <FeatureCard
                  key={ecosystem.slug}
                  href={`/experience/${ecosystem.slug}`}
                  title={ecosystem.name.toUpperCase()}
                  description={ecosystem.description}
                  image={ecosystem.image}
                  accent={ecosystem.accent}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="experience" className="bg-[#04171d] py-24 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div className="flex flex-col justify-center">
              <SectionHeading
                eyebrow="The experience"
                title="Move with the planet. Listen to its story."
                description="Each landscape is an independent room for exploration, where movement can shape an expressive soundscape once the project’s pose model is supplied and verified."
              />

              <div className="mt-8 space-y-4 text-base leading-8 text-slate-200/75">
                <p>
                  Choose a landscape to open its own camera view, select an environmental variation and listen to a procedural audio prototype.
                </p>
                <p>
                  The prototype does not contain NASA data, environmental recordings or a motion model yet. Your camera remains local to your browser.
                </p>
              </div>
            </div>

            <ExperiencePreview />
          </div>
        </section>

        <section className="border-t border-white/10 bg-[#091f2a] py-24">
          <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
            <p className="text-3xl font-semibold leading-tight tracking-[-0.04em] text-[#f5efe3] sm:text-5xl">
              We explored the universe, but home was always here.
            </p>
            <a
              href="#experience"
              className="mt-8 inline-flex items-center justify-center rounded-full border border-[#d9b36c]/40 bg-[#d9b36c]/10 px-7 py-3 text-sm font-semibold uppercase tracking-[0.26em] text-[#f4dfb1] transition hover:bg-[#d9b36c]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f1d9aa] focus-visible:ring-offset-2 focus-visible:ring-offset-[#091f2a]"
            >
              BEGIN THE EXPERIENCE
            </a>
          </div>
        </section>
      </main>

      <footer id="about" className="border-t border-white/10 bg-[#04171d] py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 text-center text-sm text-slate-300/75 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[#f0e8d8]">EARTH JUKEBOX</p>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-300/70">
            NASA Space Apps Challenge 2026
          </p>
          <p className="text-sm italic text-[#f0d7a9]">Our home deserves to be heard.</p>
        </div>
      </footer>
    </div>
  );
}
