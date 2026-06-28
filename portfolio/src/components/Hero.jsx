import React, { useEffect } from 'react';
import { stagger, animate, createScope, onScroll } from 'animejs';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import profileImg from '../assets/profile.png';

export default function Hero() {
  useEffect(() => {
    const scope = createScope({
      mediaQueries: { noMotion: '(prefers-reduced-motion: reduce)' }
    });

    scope.add(({ matches }) => {
      if (matches.noMotion) return;

      animate('.hero-cta', {
        scale: [0.9, 1],
        opacity: [0, 1],
        delay: stagger(100, { start: 800 }),
        duration: 800,
        ease: 'outExpo'
      });

      animate('.hero-info-card', {
        translateY: [40, 0],
        opacity: [0, 1],
        delay: stagger(120, { start: 900 }),
        duration: 900,
        ease: 'outExpo',
        autoplay: onScroll({ enter: 'bottom 100%' }),
      });

      animate('.hero-founder-card', {
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 800,
        delay: 1200,
        ease: 'outExpo',
      });
    });

    return () => scope.revert();
  }, []);

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col items-center justify-center px-container-padding-mobile md:px-container-padding-desktop relative overflow-hidden pt-20"
    >
      <div className="max-w-5xl text-center z-10 relative">
        <span className="font-label-caps text-xs md:text-sm text-primary-fixed mb-6 block tracking-[0.2em] md:tracking-[0.3em] uppercase">
          Freelance Development
        </span>

        <h1 className="font-display-lg text-6xl sm:text-8xl md:text-[140px] text-white mb-8 tracking-tighter flex flex-wrap justify-center gap-x-2 md:gap-x-3 gap-y-2 leading-none">
          BRO<span className="text-primary-fixed">JIX</span>
        </h1>

        <p className="font-body-lg text-xl md:text-2xl text-on-surface-variant max-w-2xl mx-auto mb-10">
          Made for co-bros to help on their projects.
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <a
            href="#services"
            className="hero-cta opacity-0 bg-primary-fixed text-on-primary-fixed px-10 py-4 rounded-lg font-bold text-lg hover:shadow-[0_0_30px_#d2f000] transition-all duration-500 active:scale-95"
            style={{ transform: 'scale(0.9)' }}
          >
            Initialize Project
          </a>
          <a
            href="#portfolio"
            className="hero-cta opacity-0 border-2 border-secondary text-secondary px-10 py-4 rounded-lg font-bold text-lg hover:bg-secondary/10 transition-all duration-300 flex items-center gap-2 active:scale-95"
            style={{ transform: 'scale(0.9)' }}
          >
            View Products
            <ArrowUpRight className="w-5 h-5" />
          </a>
        </div>

        {/* Info Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 text-left z-10">
          <div
            className="hero-info-card opacity-0 glass-panel p-6 rounded-3xl border border-white/10 shadow-[0_0_30px_rgba(210,240,0,0.08)]"
            style={{ transform: 'translateY(40px)' }}
          >
            <p className="text-sm font-label-caps text-label-caps text-secondary mb-3 uppercase tracking-[0.35em]">Speed</p>
            <h3 className="text-xl font-semibold text-white mb-2">Rapid delivery</h3>
            <p className="text-on-surface-variant">Small teams, fast execution, and clear progress updates from day one.</p>
          </div>
          <div
            className="hero-info-card opacity-0 glass-panel p-6 rounded-3xl border border-white/10 shadow-[0_0_30px_rgba(210,240,0,0.08)]"
            style={{ transform: 'translateY(40px)' }}
          >
            <p className="text-sm font-label-caps text-label-caps text-secondary mb-3 uppercase tracking-[0.35em]">Quality</p>
            <h3 className="text-xl font-semibold text-white mb-2">Performance-first</h3>
            <p className="text-on-surface-variant">Clean architecture, responsive design, and code that scales with your goals.</p>
          </div>
          <div
            className="hero-info-card opacity-0 glass-panel p-6 rounded-3xl border border-white/10 shadow-[0_0_30px_rgba(210,240,0,0.08)]"
            style={{ transform: 'translateY(40px)' }}
          >
            <p className="text-sm font-label-caps text-label-caps text-secondary mb-3 uppercase tracking-[0.35em]">Trust</p>
            <h3 className="text-xl font-semibold text-white mb-2">Clear scope</h3>
            <p className="text-on-surface-variant">Transparent pricing, defined milestones, and a smooth handoff every time.</p>
          </div>
        </div>

        {/* Founder Teaser Card */}
        <div className="hero-founder-card opacity-0 mt-10 flex justify-center">
          <Link
            to="/about"
            className="group inline-flex items-center gap-5 glass-panel border border-white/10 hover:border-primary-fixed/40 rounded-2xl px-6 py-4 transition-all duration-500 hover:shadow-[0_0_30px_rgba(210,240,0,0.12)] max-w-sm w-full"
          >
            {/* Avatar with online dot */}
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-primary-fixed/30 group-hover:ring-primary-fixed/70 transition-all duration-500">
                <img src={profileImg} alt="Likith Kumar Chippe" className="w-full h-full object-cover" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#08080a] animate-pulse"></span>
            </div>

            {/* Text */}
            <div className="text-left flex-1 min-w-0">
              <p className="text-[10px] font-label-caps uppercase tracking-[0.2em] text-primary-fixed mb-0.5">MEET THE FOUNDER</p>
              <p className="font-bold text-white text-base group-hover:text-primary-fixed transition-colors duration-300 truncate">Likith Kumar Chippe</p>
              <p className="text-on-surface-variant text-xs truncate">Software Engineer • AI Builder • Full Stack Dev</p>
            </div>

            {/* Arrow icon */}
            <ArrowUpRight className="w-5 h-5 text-white/25 group-hover:text-primary-fixed group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 flex-shrink-0" />
          </Link>
        </div>
      </div>
    </section>
  );
}