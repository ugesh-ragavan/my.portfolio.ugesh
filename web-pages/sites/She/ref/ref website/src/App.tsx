import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Volume2, VolumeX, Fish, Sprout, Gamepad2, ExternalLink } from 'lucide-react';
import { MOODS, type MoodId } from './data/moods';
import { logAndNotifyMood } from './config/moodIntegration';
import { sfx } from './utils/sound';
import { MoodResponseCard } from './components/MoodResponseCard';
import { KoiPondGame } from './components/KoiPondGame';
import { WaterPlantsGame } from './components/WaterPlantsGame';
import { LilyGardenFooter } from './components/LilyGardenFooter';

type ActiveGame = 'koi' | 'plants';

export default function App() {
  const [selectedMoodId, setSelectedMoodId] = useState<MoodId | null>(null);
  const [soundOn, setSoundOn] = useState(true);
  const [activeGame, setActiveGame] = useState<ActiveGame>('koi');
  const [toastVisible, setToastVisible] = useState(false);

  const toastTimerRef = useRef<number | null>(null);
  const gamesSectionRef = useRef<HTMLElement | null>(null);

  const selectedMood = MOODS.find((m) => m.id === selectedMoodId) ?? null;

  const toggleSound = () => {
    const nextSoundOn = !soundOn;
    setSoundOn(nextSoundOn);
    sfx.setMuted(!nextSoundOn);
    if (nextSoundOn) {
      sfx.tap();
    }
  };

  const handleSelectMood = async (moodId: MoodId) => {
    const moodObj = MOODS.find((m) => m.id === moodId);
    if (!moodObj) return;

    setSelectedMoodId(moodId);

    if (moodId === 'happy' || moodId === 'sweets') {
      sfx.chime();
    } else {
      sfx.tap();
    }

    // Show subtle reassuring toast immediately
    setToastVisible(true);
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    window.setTimeout(() => sfx.toast(), 180);
    toastTimerRef.current = window.setTimeout(() => {
      setToastVisible(false);
    }, 3400);

    // Save to Firestore ("mood_logs") & send instant push notification (graceful fallback if unconfigured)
    await logAndNotifyMood({
      mood: moodObj.id,
      label: moodObj.label,
    });
  };

  const handleScrollToGames = () => {
    gamesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDF8F5] text-[#3F2E2E]">
      {/* Compact Sticky Top Bar */}
      <header className="sticky top-0 z-40 h-14 bg-[#FDF8F5]/90 backdrop-blur-md border-b border-[#EADCD5]/80">
        <div className="max-w-5xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4 sm:gap-8">
          <div className="flex items-center gap-2.5">
            <a
              href="../index.html"
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F5ECE7] hover:bg-[#EDE0D9] border border-[#E2D2C9] text-xs font-semibold text-[#6D5454] transition-colors whitespace-nowrap"
              title="Return to SHE Hub"
            >
              <span>← SHE Menu</span>
            </a>
            <a
              href="#mood-checkin"
              className="font-display text-lg font-medium tracking-tight text-[#3F2E2E] whitespace-nowrap shrink-0"
            >
              For Sree
            </a>
          </div>

          <nav
            aria-label="Page sections"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-[#6D5454]"
          >
            <a
              href="#mood-checkin"
              className="hover:text-[#3F2E2E] transition-colors whitespace-nowrap shrink-0"
            >
              Mood Check-In
            </a>
            <a
              href="#mini-games"
              className="hover:text-[#3F2E2E] transition-colors whitespace-nowrap shrink-0"
            >
              Cozy Games
            </a>
            <a
              href="#lily-garden"
              className="hover:text-[#3F2E2E] transition-colors whitespace-nowrap shrink-0"
            >
              Lily Garden
            </a>
          </nav>

          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={soundOn}
            className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-1.5 rounded-full bg-[#F5ECE7] hover:bg-[#EDE0D9] border border-[#E2D2C9] text-xs font-semibold text-[#3F2E2E] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {soundOn ? (
              <Volume2 className="w-3.5 h-3.5 text-[#7A5959]" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-[#7A5959]" />
            )}
            <span>Sound: {soundOn ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </header>

      {/* Gentle confirmation toast when Sree taps a mood */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            role="status"
            aria-live="polite"
            className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 rounded-full bg-[#3F2E2E] text-[#FDF8F5] px-5 py-2.5 text-sm font-medium shadow-lg whitespace-nowrap"
          >
            Sent straight to him 💌
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 space-y-16">
        {/* SECTION 1 — PICK YOUR MOOD */}
        <section id="mood-checkin" className="space-y-7">
          <div className="max-w-2xl">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-medium tracking-tight text-[#3F2E2E] leading-[1.18] text-balance">
              Hey Sree, how is your heart feeling right now? ☁️
            </h1>
          </div>

          {/* 8 Relationship-Tailored Mood Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {MOODS.map((mood) => {
              const isSelected = selectedMoodId === mood.id;
              return (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() => handleSelectMood(mood.id)}
                  aria-pressed={isSelected}
                  className={`min-h-[52px] px-4 py-3 rounded-2xl border text-left text-sm sm:text-[15px] font-medium transition-all duration-200 cursor-pointer flex items-center gap-2.5 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[#C85A8E] ${
                    isSelected
                      ? `${mood.pillTint} shadow-sm ring-2 ring-[#3F2E2E]/15`
                      : 'bg-white/85 hover:bg-white border-[#EADCD5] text-[#3F2E2E] hover:border-[#D9C5BC]'
                  }`}
                >
                  <span className="text-lg shrink-0" aria-hidden="true">
                    {mood.emoji}
                  </span>
                  <span className="truncate">{mood.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Personalized Comfort Card Reveal */}
          <AnimatePresence mode="wait">
            {selectedMood && (
              <MoodResponseCard
                key={selectedMood.id}
                mood={selectedMood}
                onScrollToGames={handleScrollToGames}
              />
            )}
          </AnimatePresence>
        </section>

        {/* Subtle Hairline Divider */}
        <div className="border-t border-[#EADCD5]/80" aria-hidden="true" />

        {/* SECTION 2 — COZY MINI-GAMES CORNER */}
        <section id="mini-games" ref={gamesSectionRef} className="space-y-6 scroll-mt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-medium text-[#3F2E2E] text-balance">
                Cozy Mini-Games Corner 🎮🌿
              </h2>
            </div>

            {/* Clean Segmented Game Switcher */}
            <div
              role="tablist"
              aria-label="Cozy mini-games"
              className="inline-flex items-center gap-1 p-1 rounded-2xl bg-[#F2E9E4] border border-[#E6D8D0] self-start md:self-auto"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeGame === 'koi'}
                onClick={() => {
                  sfx.tap();
                  setActiveGame('koi');
                }}
                className={`inline-flex items-center gap-2 min-h-[42px] px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeGame === 'koi'
                    ? 'bg-white text-[#3F2E2E] shadow-xs'
                    : 'text-[#6D5454] hover:text-[#3F2E2E]'
                }`}
              >
                <Fish className="w-4 h-4" />
                <span>Zen Koi Pond</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeGame === 'plants'}
                onClick={() => {
                  sfx.tap();
                  setActiveGame('plants');
                }}
                className={`inline-flex items-center gap-2 min-h-[42px] px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeGame === 'plants'
                    ? 'bg-white text-[#3F2E2E] shadow-xs'
                    : 'text-[#6D5454] hover:text-[#3F2E2E]'
                }`}
              >
                <Sprout className="w-4 h-4" />
                <span>Water the Lilies</span>
              </button>
            </div>
          </div>

          {/* Active Mini-Game Surface */}
          <div className="rounded-3xl border border-[#EADCD5] bg-white/80 p-4 sm:p-6 shadow-[0_8px_30px_-18px_rgba(63,46,46,0.12)]">
            {activeGame === 'koi' ? <KoiPondGame /> : <WaterPlantsGame />}
          </div>

          {/* Standalone Interactive Games Shelf */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-[#C85A8E]" />
              <h3 className="font-display text-xl sm:text-2xl font-medium text-[#3F2E2E]">
                More Games For Sree 🕹️✨
              </h3>
            </div>
            <p className="text-sm text-[#6D5454]">
              Pick any of these full interactive games anytime you need extra distraction or cozy play:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a
                href="./games/feed_zoo/index.html"
                className="group p-5 rounded-2xl bg-white/90 hover:bg-white border border-[#EADCD5] hover:border-[#F2BED9] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-3 text-left"
              >
                <div>
                  <div className="flex items-center justify-between text-2xl">
                    <span>🐟</span>
                    <ExternalLink className="w-4 h-4 text-[#8C7070] group-hover:text-[#C85A8E] transition-colors" />
                  </div>
                  <h4 className="mt-2 font-display text-base font-medium text-[#3F2E2E] group-hover:text-[#C85A8E] transition-colors">
                    Feed the Zoo
                  </h4>
                  <p className="mt-1 text-xs text-[#7A6363] leading-relaxed">
                    Drop treats for 7 adorable sea creatures & watch them wiggle happily in the ocean.
                  </p>
                </div>
                <span className="inline-flex items-center text-xs font-semibold text-[#C85A8E]">
                  Play Ocean Feeding →
                </span>
              </a>

              <a
                href="./games/back_rooms/index.html"
                className="group p-5 rounded-2xl bg-white/90 hover:bg-white border border-[#EADCD5] hover:border-[#FED7AA] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-3 text-left"
              >
                <div>
                  <div className="flex items-center justify-between text-2xl">
                    <span>🔦</span>
                    <ExternalLink className="w-4 h-4 text-[#8C7070] group-hover:text-[#D97706] transition-colors" />
                  </div>
                  <h4 className="mt-2 font-display text-base font-medium text-[#3F2E2E] group-hover:text-[#D97706] transition-colors">
                    3D Backrooms
                  </h4>
                  <p className="mt-1 text-xs text-[#7A6363] leading-relaxed">
                    A mind-blowing, purely CSS 3D maze to explore corridors, turn corners & solve paths.
                  </p>
                </div>
                <span className="inline-flex items-center text-xs font-semibold text-[#D97706]">
                  Explore 3D Maze →
                </span>
              </a>

              <a
                href="./games/escape_road/index.html"
                className="group p-5 rounded-2xl bg-white/90 hover:bg-white border border-[#EADCD5] hover:border-[#DDD6FE] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-3 text-left"
              >
                <div>
                  <div className="flex items-center justify-between text-2xl">
                    <span>🏎️</span>
                    <ExternalLink className="w-4 h-4 text-[#8C7070] group-hover:text-[#8B5CF6] transition-colors" />
                  </div>
                  <h4 className="mt-2 font-display text-base font-medium text-[#3F2E2E] group-hover:text-[#8B5CF6] transition-colors">
                    Escape Road
                  </h4>
                  <p className="mt-1 text-xs text-[#7A6363] leading-relaxed">
                    Adrenaline-packed retro getaway car game with smooth controls & endless highway action.
                  </p>
                </div>
                <span className="inline-flex items-center text-xs font-semibold text-[#8B5CF6]">
                  Drive & Escape →
                </span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* SECTION 3 — DYNAMIC BLOOMING LILY GARDEN FOOTER */}
      <LilyGardenFooter selectedMood={selectedMoodId} />
    </div>
  );
}
