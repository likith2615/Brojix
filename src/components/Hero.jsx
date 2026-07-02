import React, { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import profileImg from '../assets/profile.png';

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col items-center justify-center px-container-padding-mobile md:px-container-padding-desktop relative overflow-hidden pt-36 md:pt-20"
    >
      <div className="max-w-5xl text-center z-10 relative">
        <span className={`font-label-caps text-xs md:text-sm text-primary-fixed mb-6 block tracking-[0.2em] md:tracking-[0.3em] uppercase transition-all duration-700 delay-100 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          Freelance Development
        </span>

        <h1 className={`font-display-lg text-5xl sm:text-7xl md:text-[120px] text-white mb-8 tracking-tighter flex flex-wrap justify-center gap-x-2 md:gap-x-3 gap-y-2 leading-none transition-all duration-700 delay-200 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>BRO<span className="text-primary-fixed">JIX</span></h1>

        <p className={`font-body-lg text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-10 transition-all duration-700 delay-300 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          Made for co-bros to help on their projects.
        </p>

        <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-700 delay-400 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          <a
            href="#services"
            className="bg-primary-fixed text-on-primary-fixed px-10 py-4 rounded-lg font-bold text-lg hover:shadow-[0_0_20px_rgba(210,240,0,0.4)] transition-all duration-300 active:scale-95 w-full sm:w-auto text-center"
          >
            Initialize Project
          </a>
          <a
            href="#portfolio"
            className="border-2 border-secondary text-secondary px-10 py-4 rounded-lg font-bold text-lg hover:bg-secondary/10 transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 w-full sm:w-auto text-center"
          >
            View Products
            <ArrowUpRight className="w-5 h-5" />
          </a>
        </div>

        {/* Info Cards */}
        <div className={`mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left z-10 transition-all duration-700 delay-500 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(210,240,0,0.04)]">
            <p className="text-xs font-label-caps text-secondary mb-3 uppercase tracking-[0.35em]">Speed</p>
            <h3 className="text-lg font-semibold text-white mb-2">Rapid delivery</h3>
            <p className="text-on-surface-variant text-sm">Small teams, fast execution, and clear progress updates from day one.</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(210,240,0,0.04)]">
            <p className="text-xs font-label-caps text-secondary mb-3 uppercase tracking-[0.35em]">Quality</p>
            <h3 className="text-lg font-semibold text-white mb-2">Performance-first</h3>
            <p className="text-on-surface-variant text-sm">Clean architecture, responsive design, and code that scales with your goals.</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(210,240,0,0.04)]">
            <p className="text-xs font-label-caps text-secondary mb-3 uppercase tracking-[0.35em]">Trust</p>
            <h3 className="text-lg font-semibold text-white mb-2">Clear scope</h3>
            <p className="text-on-surface-variant text-sm">Transparent pricing, defined milestones, and a smooth handoff every time.</p>
          </div>
        </div>

        {/* Founder Teaser Card */}
        <div className={`mt-12 flex justify-center transition-all duration-700 delay-700 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <Link
            to="/about"
            className="group inline-flex items-center gap-5 glass-panel border border-white/10 hover:border-primary-fixed/40 rounded-2xl px-6 py-4 transition-all duration-300 hover:shadow-[0_0_20px_rgba(210,240,0,0.08)] max-w-sm w-full"
          >
            {/* Avatar with online dot */}
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary-fixed/30 group-hover:ring-primary-fixed/70 transition-all duration-300">
                <img src={profileImg} alt="Chippe Likith Kumar, developer and founder of BROJIX" loading="eager" className="w-full h-full object-cover" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#08080a] animate-pulse"></span>
            </div>

            {/* Text */}
            <div className="text-left flex-1 min-w-0">
              <p className="text-[9px] font-label-caps uppercase tracking-[0.2em] text-primary-fixed mb-0.5">MEET THE FOUNDER</p>
              <p className="font-bold text-white text-sm group-hover:text-primary-fixed transition-colors duration-300 truncate">Likith Kumar Chippe</p>
              <p className="text-on-surface-variant text-[11px] truncate">Software Engineer • AI Builder • Full Stack Dev</p>
            </div>

            {/* Arrow icon */}
            <ArrowUpRight className="w-4 h-4 text-white/25 group-hover:text-primary-fixed group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 flex-shrink-0" />
          </Link>
        </div>
      </div>
    </section>
  );
}