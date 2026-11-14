import { useEffect, useRef, useState } from 'react';
import { RotateCcw, Droplets } from 'lucide-react';
import { sfx } from '../utils/sound';

interface PlantSlot {
  id: string;
  name: string;
  potColor: string;
  potRim: string;
  petalColor: string;
  petalHighlight: string;
  compliment: string;
}

const PLANT_SHELF: PlantSlot[] = [
  {
    id: 'calla',
    name: 'Cream Calla Lily',
    potColor: '#F3D5C0',
    potRim: '#E8C2A8',
    petalColor: '#FFF9F2',
    petalHighlight: '#FDE68A',
    compliment: "You're doing amazing ❤️",
  },
  {
    id: 'stargazer',
    name: 'Blush Stargazer',
    potColor: '#E2ECE9',
    potRim: '#C9DBD6',
    petalColor: '#F9A8D4',
    petalHighlight: '#FCE7F3',
    compliment: 'Take it easy today 🌸',
  },
  {
    id: 'honey',
    name: 'Honey Lily',
    potColor: '#FDE68A',
    potRim: '#F5D565',
    petalColor: '#FBBF24',
    petalHighlight: '#FEF3C7',
    compliment: 'So proud of you 🌿',
  },
  {
    id: 'lavender',
    name: 'Twilight Lily',
    potColor: '#DDD6FE',
    potRim: '#C7BCF9',
    petalColor: '#C4B5FD',
    petalHighlight: '#EDE9FE',
    compliment: 'You deserve soft days ☁️',
  },
  {
    id: 'rose',
    name: 'Rose Water Lily',
    potColor: '#FBCFE8',
    potRim: '#F7B4DA',
    petalColor: '#FB7185',
    petalHighlight: '#FFE4E6',
    compliment: 'Your smile lights everything ✨',
  },
];

interface FloatingCompliment {
  key: number;
  plantId: string;
  text: string;
}

export function WaterPlantsGame() {
  const [hydration, setHydration] = useState<Record<string, number>>(() =>
    Object.fromEntries(PLANT_SHELF.map((p) => [p.id, 12]))
  );
  const [activeWateringId, setActiveWateringId] = useState<string | null>(null);
  const [compliments, setCompliments] = useState<FloatingCompliment[]>([]);

  const wateringTimerRef = useRef<number | null>(null);
  const soundThrottleRef = useRef(0);
  const complimentKeyRef = useRef(1);

  const bloomedCount = PLANT_SHELF.filter((p) => (hydration[p.id] ?? 0) >= 100).length;

  const stopWatering = () => {
    setActiveWateringId(null);
    if (wateringTimerRef.current !== null) {
      window.clearInterval(wateringTimerRef.current);
      wateringTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (wateringTimerRef.current !== null) {
        window.clearInterval(wateringTimerRef.current);
      }
    };
  }, []);

  const addWaterToPlant = (plant: PlantSlot, amount: number) => {
    setHydration((prev) => {
      const current = prev[plant.id] ?? 0;
      if (current >= 100) return prev;
      const next = Math.min(100, current + amount);

      if (current < 100 && next >= 100) {
        sfx.chime();
        const key = complimentKeyRef.current++;
        setCompliments((list) => [...list, { key, plantId: plant.id, text: plant.compliment }]);
        window.setTimeout(() => {
          setCompliments((list) => list.filter((item) => item.key !== key));
        }, 2600);
      } else {
        const now = Date.now();
        if (now - soundThrottleRef.current > 150) {
          soundThrottleRef.current = now;
          sfx.pour();
        }
      }

      return { ...prev, [plant.id]: next };
    });
  };

  const handleStartWatering = (plant: PlantSlot) => {
    stopWatering();
    setActiveWateringId(plant.id);
    addWaterToPlant(plant, 16);

    wateringTimerRef.current = window.setInterval(() => {
      addWaterToPlant(plant, 7);
    }, 95);
  };

  const resetGarden = () => {
    stopWatering();
    sfx.tap();
    setCompliments([]);
    setHydration(Object.fromEntries(PLANT_SHELF.map((p) => [p.id, 12])));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-[#6D5454]">
          <span>Press &amp; hold (or tap) any pot to pour water</span>
          <span className="mx-2" aria-hidden="true">
            ·
          </span>
          <span className="font-semibold text-[#3F2E2E] tabular-nums">
            Bloomed: {bloomedCount} / {PLANT_SHELF.length}
          </span>
        </div>

        <button
          type="button"
          onClick={resetGarden}
          className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-xl bg-white hover:bg-[#FAF2EE] border border-[#E5D5CE] text-sm font-medium text-[#3F2E2E] transition-colors cursor-pointer whitespace-nowrap"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Shelf</span>
        </button>
      </div>

      {/* Cozy plant shelf stage */}
      <div className="rounded-2xl border border-[#DCE5DF] bg-gradient-to-b from-[#F5FAF7] via-[#FBF8F3] to-[#F3EAE2] p-4 sm:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {PLANT_SHELF.map((plant) => {
            const level = hydration[plant.id] ?? 0;
            const isBloomed = level >= 100;
            const isPouring = activeWateringId === plant.id && !isBloomed;
            const stemProgress = Math.min(1, level / 75);
            const leafProgress = Math.max(0, Math.min(1, (level - 22) / 45));
            const bloomScale = isBloomed ? 1 : Math.max(0, (level - 65) / 35) * 0.72;

            const activeCompliments = compliments.filter((c) => c.plantId === plant.id);

            return (
              <div key={plant.id} className="relative flex flex-col items-center">
                {/* Floating compliment toast */}
                <div className="pointer-events-none absolute -top-2 inset-x-0 z-20 flex justify-center">
                  {activeCompliments.map((c) => (
                    <div
                      key={c.key}
                      className="animate-float-up rounded-xl bg-white/95 border border-[#F2C9DD] px-3 py-1.5 text-xs font-semibold text-[#3F2E2E] shadow-md whitespace-nowrap"
                    >
                      {c.text}
                    </div>
                  ))}
                </div>

                {/* Interactive pot button */}
                <button
                  type="button"
                  onPointerDown={() => handleStartWatering(plant)}
                  onPointerUp={stopWatering}
                  onPointerLeave={stopWatering}
                  onPointerCancel={stopWatering}
                  aria-label={`Water ${plant.name} (${Math.round(level)}% hydrated)`}
                  className="group relative w-full rounded-2xl bg-white/75 hover:bg-white border border-[#E7DDD5] pt-10 pb-3 px-2 flex flex-col items-center transition-all cursor-pointer touch-manipulation select-none focus-visible:outline-2 focus-visible:outline-[#C85A8E]"
                >
                  {/* Animated Pastel Watering Can when pouring */}
                  {isPouring && (
                    <div
                      className="pointer-events-none absolute top-1 right-2 z-20 flex flex-col items-center"
                      aria-hidden="true"
                    >
                      <svg
                        width="48"
                        height="36"
                        viewBox="0 0 64 48"
                        className="-rotate-18 drop-shadow-sm"
                      >
                        {/* Handle */}
                        <path
                          d="M42 12 C56 8, 58 32, 42 32"
                          fill="none"
                          stroke="#7AB8C2"
                          strokeWidth="4.5"
                          strokeLinecap="round"
                        />
                        {/* Spout */}
                        <path
                          d="M22 24 L6 14 L8 10 L24 19 Z"
                          fill="#8FCAD3"
                        />
                        {/* Body */}
                        <rect x="20" y="12" width="24" height="24" rx="6" fill="#A5DCE4" />
                        <ellipse cx="32" cy="12" rx="10" ry="3" fill="#7AB8C2" />
                      </svg>
                      {/* Water droplets */}
                      <div className="relative -ml-10 -mt-2 flex gap-1.5">
                        <span className="w-1.5 h-2.5 rounded-full bg-[#60A5FA] animate-water-drop" />
                        <span
                          className="w-1.5 h-2.5 rounded-full bg-[#93C5FD] animate-water-drop"
                          style={{ animationDelay: '0.18s' }}
                        />
                        <span
                          className="w-1.5 h-2.5 rounded-full bg-[#60A5FA] animate-water-drop"
                          style={{ animationDelay: '0.32s' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Plant + Pot SVG */}
                  <svg
                    viewBox="0 0 120 135"
                    className="w-24 h-28 overflow-visible"
                    aria-hidden="true"
                  >
                    {/* Stem */}
                    <path
                      d={`M 60 92 Q 57 ${92 - stemProgress * 22} 60 ${92 - stemProgress * 46}`}
                      fill="none"
                      stroke="#5A8F73"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Sprouting leaves */}
                    {leafProgress > 0.05 && (
                      <g
                        style={{
                          transform: `translate(60px, ${80 - stemProgress * 18}px) scale(${leafProgress})`,
                          transformOrigin: '0 0',
                        }}
                      >
                        <path
                          d="M 0 0 C -14 -8, -24 -2, -20 6 C -14 10, -4 6, 0 0 Z"
                          fill="#7FB695"
                        />
                        <path
                          d="M 0 -4 C 14 -12, 24 -6, 20 2 C 14 6, 4 2, 0 -4 Z"
                          fill="#68A380"
                        />
                      </g>
                    )}

                    {/* Blooming Lily Flower */}
                    {bloomScale > 0.05 && (
                      <g
                        style={{
                          transform: `translate(60px, ${92 - stemProgress * 46}px) scale(${bloomScale})`,
                          transformOrigin: '0 0',
                          transition: 'transform 250ms cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      >
                        {[0, 60, 120, 180, 240, 300].map((deg) => (
                          <g key={deg} transform={`rotate(${deg})`}>
                            <path
                              d="M 0 0 C -8 -10, -7 -26, 0 -30 C 7 -26, 8 -10, 0 0 Z"
                              fill={plant.petalColor}
                              stroke={plant.petalHighlight}
                              strokeWidth="1"
                            />
                          </g>
                        ))}
                        <circle cx="0" cy="0" r="4.5" fill="#FCD34D" />
                      </g>
                    )}

                    {/* Little seed/bud if low hydration */}
                    {level < 25 && (
                      <ellipse cx="60" cy="89" rx="5" ry="3.5" fill="#7FB695" />
                    )}

                    {/* Soil */}
                    <ellipse cx="60" cy="92" rx="23" ry="4.5" fill="#7C5E4E" />

                    {/* Cute Pot */}
                    <path
                      d="M 35 92 L 85 92 L 77 126 Q 76 130 71 130 L 49 130 Q 44 130 43 126 Z"
                      fill={plant.potColor}
                    />
                    <rect x="31" y="87" width="58" height="8" rx="4" fill={plant.potRim} />

                    {/* Cute smiling face on pot */}
                    <circle cx="52" cy="109" r="1.8" fill="#3F2E2E" />
                    <circle cx="68" cy="109" r="1.8" fill="#3F2E2E" />
                    <path
                      d={isBloomed ? 'M 56 113 Q 60 118 64 113' : 'M 57 114 Q 60 116 63 114'}
                      fill="none"
                      stroke="#3F2E2E"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>

                  <span className="mt-1 text-xs font-semibold text-[#3F2E2E] truncate max-w-full">
                    {plant.name}
                  </span>

                  {/* Hydration bar + explicit text state */}
                  <div className="mt-2 w-full px-1">
                    <div className="h-1.5 w-full rounded-full bg-[#EFE6DF] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-150"
                        style={{
                          width: `${level}%`,
                          backgroundColor: isBloomed ? '#68A380' : '#7AB8C2',
                        }}
                      />
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-[#7A6363] tabular-nums">
                      <span className="inline-flex items-center gap-0.5">
                        <Droplets className="w-3 h-3 text-[#60A5FA]" />
                        {isBloomed ? 'Bloomed' : `${Math.round(level)}%`}
                      </span>
                      <span>{isBloomed ? 'Happy' : 'Water me'}</span>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
