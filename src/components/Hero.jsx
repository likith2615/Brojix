import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import profileImg from '../assets/profile.png';

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const stats = [
    { value: '48h',  label: 'Avg. delivery' },
    { value: '100%', label: 'Plagiarism-free' },
    { value: '24/7', label: 'WhatsApp support' },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ padding: 'clamp(7rem, 12vw, 9rem) clamp(1.25rem, 5vw, 4rem) clamp(3rem, 6vw, 5rem)' }}
      aria-label="Hero section"
    >
      <div className="ambient-bg" aria-hidden="true" />

      <div className="max-w-7xl mx-auto w-full z-10 relative">

        {/* Status pill */}
        <div
          style={{
            marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 500ms ease, transform 500ms ease',
            transitionDelay: '80ms'
          }}
        >
          <span className="label-pill">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0"
              style={{ background: 'var(--accent)' }}
              aria-hidden="true"
            />
            Available for new projects
          </span>
        </div>

        {/* Typographic stamp */}
        <div
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(18px)',
            transition: 'opacity 700ms ease, transform 700ms ease',
            transitionDelay: '160ms'
          }}
        >
          <div className="studio-rule" style={{ marginBottom: 'clamp(1rem, 2.5vw, 1.5rem)' }} aria-hidden="true" />
          <h1 className="hero-wordmark">
            BRO<span className="accent-char">JIX</span>
          </h1>
          <div className="studio-rule" style={{ marginTop: 'clamp(1rem, 2.5vw, 1.5rem)' }} aria-hidden="true" />
        </div>

        {/* Tagline */}
        <div
          style={{
            marginTop: 'clamp(1.5rem, 3.5vw, 2.25rem)',
            maxWidth: 'min(540px, 90vw)',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 700ms ease, transform 700ms ease',
            transitionDelay: '280ms'
          }}
        >
          <p style={{
            fontSize: 'clamp(1rem, 2vw + 0.4rem, 1.25rem)',
            lineHeight: 1.65,
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-body)',
          }}>
            Final-year software projects, internship reports, and full-stack delivery —
            on time, zero plagiarism, built by someone who actually codes it.
          </p>
        </div>

        {/* CTAs — stacks on mobile, row on sm+ */}
        <div
          style={{
            marginTop: 'clamp(2rem, 4vw, 2.75rem)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'scale(1)' : 'scale(0.97)',
            transition: 'opacity 600ms ease, transform 600ms ease',
            transitionDelay: '360ms'
          }}
        >
          <a href="#services" className="btn-primary" style={{ flex: '1 1 auto', minWidth: 'min(160px, 100%)' }}>
            Our Services
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
          <a href="#portfolio" className="btn-ghost" style={{ flex: '1 1 auto', minWidth: 'min(160px, 100%)' }}>
            View Our Work
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>

        {/* Stats strip */}
        <div
          style={{
            marginTop: 'clamp(2.5rem, 6vw, 4.5rem)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'clamp(1.5rem, 5vw, 3.5rem)',
            opacity: mounted ? 1 : 0,
            transition: 'opacity 600ms ease, transform 600ms ease',
            transform: mounted ? 'translateY(0)' : 'translateY(8px)',
            transitionDelay: '460ms'
          }}
          aria-label="Key highlights"
        >
          {stats.map((s, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: 'var(--accent)',
                lineHeight: 1,
              }}>
                {s.value}
              </span>
              <span className="mono-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Founder card */}
        <div
          style={{
            marginTop: 'clamp(2.5rem, 5vw, 3.5rem)',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 600ms ease, transform 600ms ease',
            transitionDelay: '540ms'
          }}
        >
          <Link
            to="/about"
            className="group studio-card"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'clamp(0.75rem, 2vw, 1.25rem)',
              padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 3vw, 1.5rem)',
              maxWidth: 'min(340px, 100%)',
              textDecoration: 'none',
            }}
            aria-label="About Likith Kumar Chippe, founder of Brojix"
          >
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full overflow-hidden" style={{ outline: '2px solid var(--accent-border)' }}>
                <img src={profileImg} alt="Likith Kumar Chippe, founder of Brojix" loading="eager" className="w-full h-full object-cover" />
              </div>
              <span
                className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 animate-pulse"
                style={{ background: '#22c55e', borderColor: 'var(--surface-base)' }}
                aria-label="Online"
              />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="eyebrow mb-0.5">Meet the founder</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Likith Kumar Chippe
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.06em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Full-stack · AI · builder
              </p>
            </div>
            <ArrowUpRight
              className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
              style={{ color: 'var(--text-muted)' }}
              aria-hidden="true"
            />
          </Link>
        </div>

      </div>
    </section>
  );
}