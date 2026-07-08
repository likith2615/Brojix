import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const guarantees = [
  { stat: '100%', label: 'Confidential', detail: 'Your college and identity are never shared with anyone.' },
  { stat: '0%',   label: 'Plagiarism',   detail: 'Every report and codebase is original, verified before delivery.' },
  { stat: '24h',  label: 'Response',     detail: 'Direct WhatsApp line — no tickets, no delays.' },
  { stat: 'On',   label: 'Time, always', detail: 'We\'ve never missed a deadline since day one.' },
];

const testimonials = [
  {
    quote: "Got my internship AI study buddy project in just 1 day through Streamlit. Submitted on time, no drama.",
    name: "Usha",
    detail: "B.Tech CSM · 3rd Year",
    rating: 5,
  },
  {
    quote: "AI travel planner report + interview prep guide — delivered in a day, scored full marks.",
    name: "Jaya Chandra",
    detail: "B.Tech CSC · 3rd Year",
    rating: 5,
  },
];

export default function Trust() {
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.05 });

  return (
    <section
      ref={sectionRef}
      id="trust"
      className="py-28 px-container-padding-mobile md:px-container-padding-desktop scroll-mt-24"
      aria-labelledby="trust-heading"
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-16">
          <div
            className="mb-4"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 500ms ease, transform 500ms ease',
              transitionDelay: '60ms',
            }}
          >
            <span className="eyebrow">Guarantees</span>
          </div>
          <h2
            id="trust-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
              color: 'var(--text-primary)',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 600ms ease, transform 600ms ease',
              transitionDelay: '120ms',
            }}
          >
            Built on<br />
            <span style={{ color: 'var(--accent)' }}>earned trust.</span>
          </h2>
        </div>

        {/* Stat strip — horizontal, data-dense */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-0 mb-20 rounded-2xl overflow-hidden"
          style={{ border: '1px solid var(--surface-border)' }}
          role="list"
          aria-label="Guarantee statistics"
        >
          {guarantees.map((g, i) => (
            <div
              key={i}
              role="listitem"
              className="p-6 md:p-8 flex flex-col gap-1"
              style={{
                borderRight: i < guarantees.length - 1 ? '1px solid var(--surface-border)' : 'none',
                borderBottom: i < 2 ? '1px solid var(--surface-border)' : 'none',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
                transition: 'opacity 500ms ease, transform 500ms ease',
                transitionDelay: `${200 + i * 60}ms`,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2.25rem',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                  color: 'var(--accent)',
                }}
              >
                {g.stat}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}
              >
                {g.label}
              </span>
              <span
                className="text-xs leading-relaxed mt-1"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}
              >
                {g.detail}
              </span>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div
          className="mb-4"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 500ms ease',
            transitionDelay: '460ms',
          }}
        >
          <span className="eyebrow">What they said</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((t, i) => (
            <blockquote
              key={i}
              className="studio-card p-7 flex flex-col gap-5"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
                transition: 'opacity 600ms ease, transform 600ms ease',
                transitionDelay: `${520 + i * 80}ms`,
              }}
            >
              {/* Stars */}
              <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }).map((_, si) => (
                  <span
                    key={si}
                    style={{ color: 'var(--accent)', fontSize: '0.9rem' }}
                    aria-hidden="true"
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Quote */}
              <p
                className="text-base leading-relaxed flex-1"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  color: 'var(--text-primary)',
                  fontSize: '1.125rem',
                  lineHeight: 1.55,
                }}
              >
                "{t.quote}"
              </p>

              {/* Attribution */}
              <footer className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid var(--surface-border)' }}>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{
                    background: 'var(--accent-surface)',
                    border: '1px solid var(--accent-border)',
                    color: 'var(--accent)',
                    fontFamily: 'var(--font-body)',
                  }}
                  aria-hidden="true"
                >
                  {t.name[0]}
                </div>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
                  >
                    {t.name}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}
                  >
                    {t.detail}
                  </p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>

      </div>
    </section>
  );
}
