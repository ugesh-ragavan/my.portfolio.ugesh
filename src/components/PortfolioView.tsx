import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  Linkedin,
  Phone,
  MapPin,
  ChevronRight,
  Menu,
  X,
  ArrowLeft,
  ArrowUp,
  Download,
  Award,
  Terminal,
  Database,
  Cloud,
  Layers
} from 'lucide-react';
import { portfolioData } from '../data';
import ComicInspiration from './ComicInspiration';

interface PortfolioViewProps {
  onNavigateHome: () => void;
}

export default function PortfolioView({ onNavigateHome }: PortfolioViewProps) {
  const [activeSection, setActiveSection] = useState('about');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Scroll spy to highlight active section in navbar and toggle Back to Top
  useEffect(() => {
    const handleScroll = () => {
      // Toggle back to top button
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }

      // Scroll Spy
      const sections = ['about', 'skills', 'experience', 'projects', 'education', 'contact'];
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Maps custom category strings to matching visual icons
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'azure cloud':
        return <Cloud className="text-accent2" size={18} />;
      case 'programming':
        return <Terminal className="text-accent2" size={18} />;
      case 'big data':
        return <Database className="text-accent2" size={18} />;
      default:
        return <Layers className="text-accent2" size={18} />;
    }
  };

  // Maps contact labels to Lucide icons
  const getContactIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'email':
        return <Mail size={18} />;
      case 'linkedin':
        return <Linkedin size={18} />;
      case 'phone':
        return <Phone size={18} />;
      default:
        return <MapPin size={18} />;
    }
  };

  // Download simple PDF simulated click or resume notice
  const handleDownloadResume = () => {
    alert("Resume download triggered! In a production deployment, this link streams the validated PDF resume asset.");
  };

  return (
    <div className="bg-bg text-text-custom min-h-screen selection:bg-accent-custom/30 selection:text-black">
      {/* ─── NAVIGATION BAR ─── */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-bg/85 backdrop-blur-md border-b border-border-custom z-40 transition-all duration-300">
        <div className="max-w-5xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Back to Search Home */}
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface hover:bg-bg3 border border-border-custom text-text-muted hover:text-accent-custom transition-all duration-200 text-xs font-mono cursor-pointer"
            >
              <ArrowLeft size={12} />
              <span>Search Home</span>
            </button>
            <span className="text-text-dim">|</span>
            <button
              onClick={() => scrollToSection('about')}
              className="font-sans text-lg font-black uppercase tracking-tight text-text-custom hover:text-accent-custom transition-colors duration-200 cursor-pointer"
            >
              UGESH
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {['About', 'Skills', 'Experience', 'Projects', 'Contact'].map((section) => {
                const sectionId = section.toLowerCase();
                const isActive = activeSection === sectionId || 
                  (sectionId === 'about' && activeSection === 'about');
                return (
                  <li key={section}>
                    <button
                      onClick={() => scrollToSection(sectionId)}
                      className={`font-mono text-[10px] tracking-widest uppercase transition-all duration-200 cursor-pointer font-bold ${
                        isActive ? 'text-accent-custom' : 'text-text-dim hover:text-text-muted'
                      }`}
                    >
                      {section}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Resume button */}
            <button
              onClick={handleDownloadResume}
              className="bg-accent-custom hover:bg-white text-black px-4 py-2 rounded-full font-mono text-[10px] font-bold tracking-wider uppercase transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={11} />
              <span>Resume</span>
            </button>
          </nav>

          {/* Mobile Hamburguer button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 text-text-custom hover:text-accent-custom transition-colors cursor-pointer"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* ─── MOBILE DRAWER MENU ─── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
            />

            {/* Menu container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-[260px] bg-bg2 border-l border-border-custom z-50 p-6 flex flex-col md:hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="font-sans text-lg font-black text-accent-custom tracking-tight uppercase">UGESH</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-text-custom hover:text-accent-custom cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <ul className="flex flex-col gap-6 mb-8">
                {['About', 'Skills', 'Experience', 'Projects', 'Contact'].map((section) => {
                  const sectionId = section.toLowerCase();
                  return (
                    <li key={section}>
                      <button
                        onClick={() => scrollToSection(sectionId)}
                        className={`w-full text-left font-mono text-xs tracking-widest uppercase py-1 ${
                          activeSection === sectionId ? 'text-accent-custom font-bold' : 'text-text-muted hover:text-text-custom'
                        }`}
                      >
                        {section}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleDownloadResume();
                }}
                className="bg-accent-custom text-black font-bold py-3 rounded-xl font-mono text-[11px] tracking-wider uppercase mt-auto flex items-center justify-center gap-2"
              >
                <Download size={13} />
                <span>Download Resume</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <main className="max-w-3xl mx-auto px-6 pt-24 pb-20">
        
        {/* HERO SECTION */}
        <section id="about" className="py-12 md:py-16 relative">
          <div className="grid-dots" />

          {/* Availability badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-accent-custom/5 border border-accent-custom/20 rounded-full px-4 py-1.5 mb-6 text-[10px] font-mono tracking-widest uppercase text-accent-custom"
          >
            <span className="w-1.5 h-1.5 bg-accent-custom rounded-full animate-pulse shadow-[0_0_8px_#CBFF00]" />
            <span>Available for new roles</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-sans text-4xl md:text-6xl font-extrabold leading-none tracking-tighter text-text-custom mb-3 uppercase"
          >
            DATA ENGINEER
            <br />
            <span className="text-accent-custom italic font-normal">& CLOUD ARCHITECT</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-mono text-xs text-accent-custom tracking-widest uppercase mb-6 font-bold"
          >
            {portfolioData.subRole}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-base md:text-lg text-text-muted leading-relaxed font-light max-w-2xl mb-8"
          >
            3 years building <strong className="text-text-custom font-semibold">cloud-native data pipelines</strong> at Cognizant, migrating legacy ETL to Azure. Passionate about the intersection of <strong className="text-text-custom font-semibold">data engineering and GenAI</strong> — turning raw data into intelligence.
          </motion.p>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4 mb-14"
          >
            <a
              href="mailto:ugesh.be@gmail.com"
              className="bg-accent-custom hover:bg-white text-black px-6 py-3 rounded-full text-sm font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Get in Touch →
            </a>
            <a
              href="https://linkedin.com/in/ugeshr"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent text-text-muted hover:text-accent-custom border border-border-custom hover:border-accent-custom px-6 py-3 rounded-full text-sm font-medium transition-all duration-200"
            >
              LinkedIn ↗
            </a>
          </motion.div>

          {/* Quick Metrics Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-border-custom"
          >
            {portfolioData.stats.map((stat, i) => {
              const isLast = i === portfolioData.stats.length - 1;
              return (
                <div
                  key={i}
                  className={`p-5 rounded-2xl border transition-all duration-300 ${
                    isLast
                      ? 'bg-accent-custom text-black border-accent-custom shadow-[0_0_15px_rgba(203,255,0,0.15)]'
                      : 'bg-bg2 border-border-custom hover:border-border-hover-custom'
                  }`}
                >
                  <div className={`font-sans text-3xl md:text-4xl font-extrabold leading-none mb-1.5 ${isLast ? 'text-black' : 'text-text-custom'}`}>
                    {stat.num}
                  </div>
                  <div className={`font-mono text-[9px] tracking-widest uppercase ${isLast ? 'text-black/70 font-bold' : 'text-text-dim'}`}>
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </section>

        {/* SECTION DIVIDER */}
        <div className="h-px bg-border-custom my-12" />

        {/* SKILLS SECTION */}
        <section id="skills" className="py-6 scroll-mt-24">
          <div className="font-mono text-[10px] tracking-[0.25em] text-accent-custom uppercase mb-2 font-bold">
            Tech Stack
          </div>
          <h2 className="font-sans text-3xl font-extrabold tracking-tight text-text-custom mb-8 uppercase">
            Skills & Tools
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {portfolioData.skills.map((skill, index) => (
              <motion.div
                key={skill.category}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-bg2 border border-border-custom hover:border-accent-custom/40 p-5 rounded-2xl transition-all duration-200 group"
              >
                <div className="flex items-center gap-2 mb-4">
                  {getCategoryIcon(skill.category)}
                  <h3 className="font-mono text-xs font-bold text-accent-custom uppercase tracking-widest">
                    {skill.category}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skill.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-xs px-3 py-1.5 bg-bg3 border border-border-custom text-text-muted group-hover:border-accent-custom/20 group-hover:text-white rounded-full transition-all duration-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION DIVIDER */}
        <div className="h-px bg-border-custom my-12" />

        {/* EXPERIENCE TIMELINE */}
        <section id="experience" className="py-6 scroll-mt-24">
          <div className="font-mono text-[10px] tracking-[0.25em] text-accent-custom uppercase mb-2 font-bold">
            Career Journey
          </div>
          <h2 className="font-sans text-3xl font-extrabold tracking-tight text-text-custom mb-8 uppercase">
            Professional Experience
          </h2>

          <div className="flex flex-col gap-6">
            {portfolioData.experience.map((exp, index) => (
              <motion.div
                key={exp.role + exp.company}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative bg-bg2 border border-border-custom hover:border-accent-custom p-6 md:p-8 rounded-2xl transition-all duration-300 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-accent-custom before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-text-custom leading-snug">
                      {exp.role}
                    </h3>
                    <div className="font-mono text-xs text-accent-custom mt-1 font-bold">
                      {exp.company}
                    </div>
                  </div>
                  <span className="font-mono text-xs text-text-muted sm:text-right whitespace-nowrap font-medium">
                    {exp.period}
                  </span>
                </div>

                <ul className="flex flex-col gap-3">
                  {exp.bullets.map((bullet, idx) => (
                    <li
                      key={idx}
                      className="text-[13px] md:text-sm text-text-muted leading-relaxed pl-5 relative"
                    >
                      <span className="absolute left-0 top-[3px] text-accent-custom text-[11px] font-bold">▸</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION DIVIDER */}
        <div className="h-px bg-border-custom my-12" />

        {/* PROJECTS */}
        <section id="projects" className="py-6 scroll-mt-24">
          <div className="font-mono text-[10px] tracking-[0.25em] text-accent-custom uppercase mb-2 font-bold">
            Featured Projects
          </div>
          <h2 className="font-sans text-3xl font-extrabold tracking-tight text-text-custom mb-8 uppercase">
            Technical Works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {portfolioData.projects.map((proj, index) => (
              <motion.div
                key={proj.num}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-bg2 border border-border-custom hover:border-accent-custom hover:bg-white/[0.01] p-6 rounded-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="font-mono text-[10px] text-accent-custom mb-3 font-bold tracking-widest">
                    {proj.num} / 02
                  </div>
                  <h3 className="text-base font-bold text-text-custom mb-2">
                    {proj.name}
                  </h3>
                  <p className="text-[13px] text-text-muted leading-relaxed mb-6 font-light">
                    {proj.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {proj.stack.map((item) => (
                    <span
                      key={item}
                      className="font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 bg-accent-custom/10 text-accent-custom border border-accent-custom/20 rounded"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION DIVIDER */}
        <div className="h-px bg-border-custom my-12" />

        {/* EDUCATION & CERTIFICATIONS */}
        <section id="education" className="py-6 scroll-mt-24">
          <div className="font-mono text-[10px] tracking-[0.25em] text-accent-custom uppercase mb-2 font-bold">
            Credentials
          </div>
          <h2 className="font-sans text-3xl font-extrabold tracking-tight text-text-custom mb-8 uppercase">
            Education & Certifications
          </h2>

          <div className="flex flex-col gap-6">
            {/* Degree Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-bg2 border border-border-custom p-6 md:p-8 rounded-2xl flex flex-col sm:flex-row gap-6 items-start"
            >
              <div className="font-sans text-5xl md:text-6xl text-accent-custom font-black leading-none flex-shrink-0 tracking-tighter">
                {portfolioData.education.gpa}
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-text-custom">
                  {portfolioData.education.degree}
                </h3>
                <div className="font-mono text-xs text-accent-custom mt-1 font-bold">
                  {portfolioData.education.institution}
                </div>
                <div className="font-mono text-[10px] text-text-muted mt-1.5 font-medium uppercase tracking-wider">
                  {portfolioData.education.year}
                </div>
              </div>
            </motion.div>

            {/* Certifications list */}
            <div className="flex flex-col gap-3">
              {portfolioData.certificates.map((cert, index) => (
                <motion.div
                  key={cert.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-bg2 border border-border-custom hover:border-accent-custom p-4 rounded-xl flex items-center justify-between gap-4 transition-all duration-200"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-bg3 flex items-center justify-center text-sm flex-shrink-0">
                      {cert.icon}
                    </div>
                    <span className="text-[13px] text-text-muted font-normal leading-snug">
                      {cert.name}
                    </span>
                  </div>

                  <span
                    className={`font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      cert.status === 'In Progress'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-accent-custom/10 text-accent-custom border-accent-custom/20'
                    }`}
                  >
                    {cert.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION DIVIDER */}
        <div className="h-px bg-border-custom my-12" />

        {/* COMIC CREATIVE INSIDER SANDBOX */}
        <section className="py-6 scroll-mt-24">
          <ComicInspiration />
        </section>

        {/* SECTION DIVIDER */}
        <div className="h-px bg-border-custom my-12" />

        {/* CONTACT SECTION */}
        <section id="contact" className="py-6 scroll-mt-24 mb-6">
          <div className="font-mono text-[10px] tracking-[0.25em] text-accent-custom uppercase mb-2 font-bold">
            Reach Out
          </div>
          <h2 className="font-sans text-3xl font-extrabold tracking-tight text-text-custom mb-8 uppercase">
            Get in Touch
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {portfolioData.contact.map((info, index) => (
              <motion.a
                key={info.label}
                href={info.href}
                target={info.href.startsWith('http') ? '_blank' : undefined}
                rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-bg2 border border-border-custom hover:border-accent-custom hover:bg-accent-custom/5 p-5 rounded-2xl flex items-center gap-4 transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-bg3 flex items-center justify-center text-accent-custom flex-shrink-0 border border-border-custom group-hover:border-accent-custom/30 group-hover:bg-accent-custom/10 transition-all">
                  {getContactIcon(info.label)}
                </div>
                <div>
                  <div className="font-mono text-[9px] text-text-dim uppercase tracking-widest font-bold group-hover:text-accent-custom">
                    {info.label}
                  </div>
                  <div className="text-[13px] text-text-muted font-normal mt-0.5 group-hover:text-white transition-colors">
                    {info.value}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </section>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border-custom bg-[#0d0d0f] py-8 text-center text-[10px] font-mono tracking-widest text-text-dim uppercase">
        Ugesh Ragavan &bull; Data Engineer &bull; Built with React &bull; 2026
      </footer>

      {/* ─── BACK TO TOP BUTTON ─── */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 p-3 bg-accent-custom hover:bg-white text-black rounded-full z-40 transition-all duration-200 hover:scale-110 shadow-lg cursor-pointer"
          >
            <ArrowUp size={16} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
