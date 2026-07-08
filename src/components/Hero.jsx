import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import profileImg from '../assets/profile.png';

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Small delay so CSS transition fires after paint
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const stats = [
    { value: '48h', label: 'Average delivery' },
    { value: '100%', label: 'Plagiarism-free' },
    { value: '₹300', label: 'Starting price' },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden px-container-padding-mobile md:px-container-padding-desktop pt-28 pb-16"
      aria-label="Hero section"
    >
      {/* Ambient background — one restrained gradient, not multiple neons */}
      <div className="ambient-bg" aria-hidden="true" />

      <div className="max-w-7xl mx-auto w-full z-10 relative">

        {/* Top label — functional, not decorative */}
        <div
          className="mb-8 transition-all duration-500"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(10px)',
            transitionDelay: '80ms'
          }}
        >
          <span className="label-pill">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: 'var(--accent)' }}
              aria-hidden="true"
            />
            Available for new projects
          </span>
        </div>

        {/* The stamp — headline rule headline structure */}
        <div
          className="transition-all duration-700"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(16px)',
            transitionDelay: '160ms'
          }}
        >
          {/* Ruled top line */}
          <div className="studio-rule mb-5" aria-hidden="true" />

          <h1 className="hero-wordmark mb-3">
            BRO<span className="accent-char">JIX</span>
          </h1>

          {/* Ruled bottom line */}
          <div className="studio-rule mt-5" aria-hidden="true" />
        </div>

        {/* Subheading — honest, direct, no buzzwords */}
        <div
          className="mt-8 max-w-xl transition-all duration-700"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(12px)',
            transitionDelay: '280ms'
          }}
        >
          <p
            className="text-lg md:text-xl leading-relaxed"
            style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
          >
            Final-year software projects, internship reports, and full-stack delivery — 
            on time, zero plagiarism, and built by someone who actually codes it.
          </p>
        </div>

        {/* CTAs */}
        <div
          className="mt-10 flex flex-col sm:flex-row gap-3 transition-all duration-700"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'scale(1)' : 'scale(0.97)',
            transitionDelay: '360ms'
          }}
        >
          <a href="#services" className="btn-primary">
            See Pricing
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
          <a href="#portfolio" className="btn-ghost">
            View Past Work
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>

        {/* Stats row — real numbers, mono type */}
        <div
          className="mt-16 flex flex-wrap gap-8 md:gap-12"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 600ms ease, transform 600ms ease',
            transitionDelay: '460ms'
          }}
          aria-label="Key statistics"
        >
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col gap-1">
              <span
                className="text-3xl font-semibold tracking-tight"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}
              >
                {stat.value}
              </span>
              <span className="mono-label">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Founder card — compact, trust signal */}
        <div
          className="mt-14 transition-all duration-700"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(8px)',
            transitionDelay: '540ms'
          }}
        >
          <Link
            to="/about"
            className="group inline-flex items-center gap-4 studio-card px-5 py-3.5 max-w-xs"
            style={{ textDecoration: 'none' }}
            aria-label="Meet the founder, Likith Kumar Chippe"
          >
            <div className="relative flex-shrink-0">
              <div
                className="w-10 h-10 rounded-full overflow-hidden ring-2"
                style={{ ringColor: 'var(--accent-border)' }}
              >
                <img
                  src={profileImg}
                  alt="Chippe Likith Kumar, founder of Brojix"
                  loading="eager"
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                style={{
                  background: '#22c55e',
                  borderColor: 'var(--surface-base)',
                }}
                aria-label="Online"
              />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="eyebrow mb-0.5">Meet the founder</p>
              <p
                className="text-sm font-semibold truncate transition-colors duration-200"
                style={{
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                Likith Kumar Chippe
              </p>
              <p className="text-xs truncate" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Full-stack · AI · builder
              </p>
            </div>
            <ArrowUpRight
              className="w-4 h-4 flex-shrink-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              style={{ color: 'var(--text-muted)' }}
              aria-hidden="true"
            />
          </Link>
        </div>

      </div>
    </section>
  );
}