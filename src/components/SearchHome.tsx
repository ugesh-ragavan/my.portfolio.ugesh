import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Linkedin, Instagram, Sparkles, Briefcase, Mail, Phone } from 'lucide-react';
import { portfolioData } from '../data';

interface SearchHomeProps {
  onNavigateToPortfolio: () => void;
}

export default function SearchHome({ onNavigateToPortfolio }: SearchHomeProps) {
  const [query, setQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Typing animation state
  const [taglineText, setTaglineText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle typing animation loop
  useEffect(() => {
    const currentPhrase = portfolioData.taglines[phraseIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      if (charIndex < currentPhrase.length) {
        timer = setTimeout(() => {
          setTaglineText((prev) => prev + currentPhrase[charIndex]);
          setCharIndex((prev) => prev + 1);
        }, 80);
      } else {
        // Pause at the end of the phrase
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1800);
      }
    } else {
      if (charIndex > 0) {
        timer = setTimeout(() => {
          setTaglineText((prev) => prev.slice(0, -1));
          setCharIndex((prev) => prev - 1);
        }, 45);
      } else {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % portfolioData.taglines.length);
      }
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, phraseIndex]);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter dropdown items based on query
  const filteredDropdownItems = portfolioData.dropdownItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  // Keyboard navigation inside search dropdown
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsDropdownOpen(true);
      setHighlightedIndex((prev) =>
        Math.min(prev + 1, filteredDropdownItems.length - 1)
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredDropdownItems.length) {
        handleItemClick(filteredDropdownItems[highlightedIndex]);
      } else {
        executeSearch(query);
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      inputRef.current?.blur();
    }
  };

  const executeSearch = (searchTerm: string) => {
    const val = searchTerm.toLowerCase().trim();
    if (
      val.includes('engineer') ||
      val.includes('data') ||
      val.includes('pipeline') ||
      val.includes('portfolio') ||
      val.includes('work') ||
      val.includes('experience') ||
      val.includes('skill') ||
      val === ''
    ) {
      onNavigateToPortfolio();
    } else if (val.includes('instagram') || val.includes('insta')) {
      window.open('https://instagram.com/im.ugesh', '_blank');
    } else if (val.includes('linkedin')) {
      window.open('https://linkedin.com/in/ugeshr', '_blank');
    } else if (val.includes('creative') || val.includes('ugeek')) {
      window.open(
        'https://ugesh-ragavan.github.io/my.portfolio.ugesh/Ugeek/index-Work.html',
        '_blank'
      );
    } else {
      // Fallback: search term didn't match specific pages, so route to portfolio
      onNavigateToPortfolio();
    }
  };

  const handleItemClick = (item: typeof portfolioData.dropdownItems[0]) => {
    if (item.type === 'page' && item.value === 'portfolio') {
      onNavigateToPortfolio();
    } else {
      window.open(item.value, '_blank');
    }
    setIsDropdownOpen(false);
  };

  // Get matching React Lucide icon or characters for dropdown icon
  const getDropdownIcon = (id: string, iconStr: string) => {
    if (id === 'linkedin') return <Linkedin size={14} className="text-[#0a66c2]" />;
    if (id === 'instagram') return <Instagram size={14} className="text-[#e1306c]" />;
    if (id === 'creative') return <Sparkles size={14} className="text-[#a78bfa]" />;
    if (id === 'engineer') return <Briefcase size={14} className="text-[#6e57ff]" />;
    return <span className="text-[12px]">{iconStr}</span>;
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-bg overflow-hidden p-6 select-none md:p-8 pb-16">
      {/* Side Rail on Left */}
      <aside className="absolute left-0 top-0 bottom-0 w-16 border-r border-border-custom hidden xl:flex flex-col items-center justify-between py-12 z-20 bg-bg2/40">
        <div className="[writing-mode:vertical-lr] rotate-180 text-[9px] uppercase tracking-[0.4em] text-text-muted font-mono font-bold">
          PORTFOLIO INDEX 2026
        </div>
        <div className="w-2 h-2 bg-accent-custom rounded-full shadow-[0_0_10px_#CBFF00]" />
        <div className="[writing-mode:vertical-lr] rotate-180 text-[9px] uppercase tracking-[0.4em] text-text-muted font-mono font-bold">
          GITHUB / UGESH-RAGAVAN
        </div>
      </aside>

      {/* Side Rail on Right */}
      <aside className="absolute right-0 top-0 bottom-0 w-16 border-l border-border-custom hidden xl:flex flex-col items-center justify-between py-12 z-20 bg-bg2/40">
        <div className="[writing-mode:vertical-lr] text-[9px] uppercase tracking-[0.4em] text-text-muted font-mono font-bold">
          COIMBATORE, INDIA
        </div>
        <div className="w-2 h-2 bg-accent-custom rounded-full shadow-[0_0_10px_#CBFF00]" />
        <div className="[writing-mode:vertical-lr] text-[9px] uppercase tracking-[0.4em] text-text-muted font-mono font-bold">
          DATA ENGINEER &bull; 2026
        </div>
      </aside>

      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/2 transform -translate-x-1/2 w-[650px] h-[650px] bg-[radial-gradient(ellipse,rgba(203,255,0,0.06)_0%,transparent_70%)] rounded-full blur-3xl" />
      </div>

      {/* Grid background */}
      <div className="grid-dots" />

      {/* Main Home Container */}
      <div className="relative z-10 w-full max-w-[620px] flex flex-col items-center gap-10">
        {/* Profile Block */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-mono text-[10px] tracking-[0.3em] text-accent2 uppercase mb-5"
          >
            {portfolioData.eyebrow}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="font-sans text-6xl md:text-8xl font-extrabold leading-[0.85] text-text-custom tracking-tighter uppercase mb-3"
          >
            UGESH
            <br />
            <span className="text-accent-custom italic font-normal">RAGAVAN</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="font-mono text-xs md:text-sm text-text-muted mt-6 min-h-[24px] uppercase tracking-wider"
          >
            // {taglineText}
            <span className="cursor-blink" />
          </motion.div>
        </div>

        {/* Search Engine Interface */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="w-full relative"
          ref={dropdownRef}
        >
          <div className="flex items-center bg-surface border border-border-custom hover:border-border-hover-custom focus-within:!border-accent-custom focus-within:shadow-[0_0_0_3px_rgba(203,255,0,0.15)] rounded-full transition-all duration-300">
            <div className="pl-5 text-text-dim flex items-center justify-center">
              <Search size={18} className="transition-colors duration-200 focus-within:text-accent-custom" />
            </div>
            <input
              ref={inputRef}
              type="text"
              className="w-full bg-transparent border-none outline-none py-4.5 px-3 font-sans text-base font-normal text-text-custom placeholder-text-dim caret-accent-custom"
              placeholder="Search skills, experience, projects..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsDropdownOpen(true);
                setHighlightedIndex(-1);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
            <button
              onClick={() => executeSearch(query)}
              className="mr-2 bg-accent-custom hover:bg-white text-black px-6 py-3 rounded-full font-sans text-sm font-bold tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex-shrink-0 cursor-pointer"
            >
              SEARCH
            </button>
          </div>

          {/* Autocomplete Dropdown suggestions */}
          <AnimatePresence>
            {isDropdownOpen && filteredDropdownItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute top-[calc(100%+8px)] left-0 right-0 bg-surface border border-border-custom rounded-2xl overflow-hidden z-50 shadow-2xl"
              >
                {filteredDropdownItems.map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`flex items-center gap-3.5 px-5 py-3.5 cursor-pointer transition-all duration-150 font-sans text-[14px] border-b border-border-custom/50 last:border-0 ${
                      index === highlightedIndex
                        ? 'bg-accent-custom/10 text-accent-custom'
                        : 'text-text-muted'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-bg3 flex items-center justify-center flex-shrink-0">
                      {getDropdownIcon(item.id, item.icon)}
                    </div>
                    <span className="font-semibold uppercase tracking-wider text-xs">{item.label}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Home bottom quick links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="flex gap-6 flex-wrap justify-center font-mono text-[10px] tracking-widest text-text-muted uppercase"
        >
          <button
            onClick={onNavigateToPortfolio}
            className="hover:text-accent2 transition-all duration-200 underline underline-offset-4 decoration-accent-custom/40 cursor-pointer font-bold"
          >
            [ VIEW PORTFOLIO ]
          </button>
          <a
            href="https://linkedin.com/in/ugeshr"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent2 transition-all duration-200"
          >
            LinkedIn
          </a>
          <a
            href="mailto:ugesh.be@gmail.com"
            className="hover:text-accent2 transition-all duration-200"
          >
            Email
          </a>
          <a
            href="tel:9003999302"
            className="hover:text-accent2 transition-all duration-200"
          >
            +91 9003999302
          </a>
        </motion.div>

        {/* Pulse status card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="inline-flex items-center gap-2 bg-accent-custom/5 border border-accent-custom/20 rounded-full px-5 py-2 font-mono text-[10px] text-accent-custom tracking-widest uppercase"
        >
          <span className="w-2 h-2 bg-accent-custom rounded-full animate-pulse shadow-[0_0_10px_#CBFF00]" />
          Open to opportunities &bull; 3 yrs exp
        </motion.div>
      </div>

      {/* Marquee Footer */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#0d0d0f] border-t border-border-custom flex items-center overflow-hidden z-20">
        <div className="animate-marquee whitespace-nowrap text-[9px] uppercase tracking-[0.25em] text-[#666666] font-mono flex gap-16">
          <span>AZURE DATA FACTORY / ADLS GEN2 / DATABRICKS / PYSPARK / SPARK SQL / DELTA LAKE / APACHE SPARK / APACHE AIRFLOW / HADOOP / POWER BI / CI-CD / PYTHON</span>
          <span>AZURE DATA FACTORY / ADLS GEN2 / DATABRICKS / PYSPARK / SPARK SQL / DELTA LAKE / APACHE SPARK / APACHE AIRFLOW / HADOOP / POWER BI / CI-CD / PYTHON</span>
          <span>AZURE DATA FACTORY / ADLS GEN2 / DATABRICKS / PYSPARK / SPARK SQL / DELTA LAKE / APACHE SPARK / APACHE AIRFLOW / HADOOP / POWER BI / CI-CD / PYTHON</span>
        </div>
      </div>
    </div>
  );
}
