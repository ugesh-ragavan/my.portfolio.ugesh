import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageSquare, Zap, RefreshCw } from 'lucide-react';

interface ActionSpark {
  id: number;
  text: string;
  x: number;
  y: number;
  rotate: number;
  color: string;
}

const INSPIRED_QUOTES = [
  "Pipeline pipelines like a comic strip — keep the stream moving panel by panel!",
  "Every Delta Lake needs a heroic transformation stage. Pow! Clean data!",
  "Make your databases so fast they go 'VROOM!' instead of just returning results.",
  "Your cloud architecture shouldn't be a maze. Design it with the clarity of a vintage manga layout.",
  "When in doubt, add more index triggers and let the logs write the epic saga of your servers!",
  "A robust pipeline is like a super-powered team: ADF ingests, PySpark crushes, Delta saves the day!",
  "In the world of high-volume data, you are either the bottleneck villain or the optimization superhero!"
];

const ACTION_WORDS = ["FLOW!", "PIPELINE!", "DELTA!", "SPARK!", "LOAD!", "QUERY!", "ZOOM!"];
const BURST_COLORS = ["#CBFF00", "#FF2E93", "#00FF66", "#00F0FF", "#FFFF00"];

export default function ComicInspiration() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [sparks, setSparks] = useState<ActionSpark[]>([]);
  const [clickCount, setClickCount] = useState(0);

  const rotateQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % INSPIRED_QUOTES.length);
  };

  const handlePanelClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Get click location relative to the panel
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const randomWord = ACTION_WORDS[Math.floor(Math.random() * ACTION_WORDS.length)];
    const randomColor = BURST_COLORS[Math.floor(Math.random() * BURST_COLORS.length)];
    const randomRotate = Math.floor(Math.random() * 30) - 15; // -15 to +15 deg

    const newSpark: ActionSpark = {
      id: Date.now() + Math.random(),
      text: randomWord,
      x,
      y,
      rotate: randomRotate,
      color: randomColor
    };

    setSparks((prev) => [...prev, newSpark]);
    setClickCount((prev) => prev + 1);

    // Remove spark after animation completes
    setTimeout(() => {
      setSparks((prev) => prev.filter((s) => s.id !== newSpark.id));
    }, 1200);
  };

  return (
    <div className="w-full">
      {/* Header Info */}
      <div className="font-mono text-[10px] tracking-[0.25em] text-accent-custom uppercase mb-2 font-bold flex items-center gap-2">
        <Zap size={12} className="animate-bounce" />
        <span>Interactive Sandbox</span>
      </div>
      <h2 className="font-sans text-3xl font-extrabold tracking-tight text-text-custom mb-6 uppercase">
        Artistic Comic Inspiration
      </h2>

      {/* Main Comic Panel Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Panel 1: Interactive Dialogue / Speech Bubble (Span 2 columns on MD) */}
        <div className="md:col-span-2 bg-bg2 border-4 border-white p-6 rounded-none shadow-[8px_8px_0px_rgba(255,255,255,1)] relative flex flex-col justify-between overflow-hidden min-h-[220px]">
          {/* Halftone corner detail */}
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-[radial-gradient(circle,rgba(203,255,0,0.15)_2px,transparent_2px)] bg-[length:12px_12px] opacity-60 pointer-events-none" />
          
          <div className="relative z-10">
            {/* Header / Panel Title badge */}
            <div className="absolute -top-6 -left-6 bg-accent-custom border-2 border-black text-black font-mono font-black text-[9px] tracking-widest uppercase px-3 py-1 rotate-[-2deg]">
              PANEL 01: CREATIVE SPARKS
            </div>

            {/* Speach bubble */}
            <div className="mt-4 relative bg-white text-black p-5 border-4 border-black rounded-3xl shadow-[4px_4px_0px_#CBFF00] max-w-full">
              {/* Bubble Arrow */}
              <div className="absolute left-10 -bottom-4 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[16px] border-t-black" />
              <div className="absolute left-[42px] -bottom-2.5 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-white" />
              
              <p className="font-sans text-sm font-bold tracking-tight leading-snug">
                "{INSPIRED_QUOTES[quoteIndex]}"
              </p>
            </div>
          </div>

          {/* Interactive footer actions inside the panel */}
          <div className="flex justify-between items-center mt-8 relative z-10">
            {/* Quirky character placeholder */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-white bg-bg3 flex items-center justify-center font-mono text-base text-accent-custom font-extrabold select-none shadow-[2px_2px_0px_rgba(255,255,255,1)]">
                UG
              </div>
              <div>
                <div className="font-mono text-[9px] font-black uppercase text-text-custom tracking-wider">
                  Ugesh Bot
                </div>
                <div className="font-mono text-[8px] text-text-muted uppercase">
                  Data-Hero #2026
                </div>
              </div>
            </div>

            <button
              onClick={rotateQuote}
              className="bg-accent-custom hover:bg-white text-black border-2 border-black px-4 py-2 font-mono text-[9px] font-extrabold tracking-widest uppercase flex items-center gap-1.5 transition-all duration-150 active:scale-95 shadow-[3px_3px_0px_rgba(255,255,255,1)] hover:shadow-[1px_1px_0px_rgba(255,255,255,1)] cursor-pointer"
            >
              <RefreshCw size={10} />
              <span>Next Spark</span>
            </button>
          </div>
        </div>

        {/* Panel 2: Click to Burst Action Sandbox */}
        <div 
          onClick={handlePanelClick}
          className="bg-bg3 border-4 border-accent-custom p-6 rounded-none shadow-[8px_8px_0px_rgba(203,255,0,1)] relative flex flex-col justify-between min-h-[220px] overflow-hidden cursor-pointer group"
        >
          {/* Halftone BG */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.03)_2px,transparent_2px)] bg-[length:16px_16px] pointer-events-none" />
          
          {/* Panel Title */}
          <div className="absolute -top-6 -left-6 bg-white border-2 border-black text-black font-mono font-black text-[9px] tracking-widest uppercase px-3 py-1 rotate-[3deg] z-10">
            PANEL 02: THE BOOM BOARD
          </div>

          <div className="text-center my-auto pointer-events-none z-10 select-none">
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="font-sans text-4xl font-extrabold text-accent-custom tracking-tighter uppercase stroke-black select-none"
              style={{ WebkitTextStroke: '1px black' }}
            >
              CLICK ME!
            </motion.div>
            <p className="font-mono text-[9px] text-text-muted mt-2 tracking-widest uppercase">
              Trigger instant action bursts
            </p>
          </div>

          <div className="flex justify-between items-center font-mono text-[9px] text-text-dim uppercase tracking-wider relative z-10 pointer-events-none">
            <span>BOOMS TRIGGERED</span>
            <span className="text-accent-custom font-extrabold bg-accent-custom/10 px-2 py-0.5 border border-accent-custom/20">
              {clickCount}
            </span>
          </div>

          {/* Action Burst Popups */}
          <AnimatePresence>
            {sparks.map((spark) => (
              <motion.div
                key={spark.id}
                initial={{ scale: 0, opacity: 1, rotate: spark.rotate }}
                animate={{ scale: [0.8, 1.4, 1.1], opacity: [1, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  left: spark.x,
                  top: spark.y,
                  transform: 'translate(-50%, -50%)',
                  color: 'black',
                  backgroundColor: spark.color,
                  padding: '6px 14px',
                  fontWeight: 900,
                  fontSize: '14px',
                  fontFamily: 'sans-serif',
                  border: '3px solid black',
                  boxShadow: '3px 3px 0px rgba(0,0,0,1)',
                  zIndex: 30,
                  pointerEvents: 'none'
                }}
                className="uppercase tracking-tighter whitespace-nowrap"
              >
                {spark.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
