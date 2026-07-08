import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const guarantees = [
  { stat: '100%', label: 'Confidential',  detail: 'Your college and identity are never shared with anyone.' },
  { stat: '0%',   label: 'Plagiarism',    detail: 'Every report and codebase is original, verified before delivery.' },
  { stat: '24/7', label: 'Response time', detail: 'Direct WhatsApp line — no tickets, no delays.' },
  { stat: '100%', label: 'On-time',       detail: 'We have never missed a deadline since day one.' },
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
      style={{ padding: 'clamp(4rem, 8vw, 7rem) clamp(1.25rem, 5vw, 4rem)', scrollMarginTop: '5rem' }}
      aria-labelledby="trust-heading"
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div style={{ marginBottom: 'clamp(2.5rem, 5vw, 4rem)' }}>
          <div
            style={{
              marginBottom: '1rem',
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
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
              color: 'var(--text-primary)',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(14px)',
              transition: 'opacity 600ms ease, transform 600ms ease',
              transitionDelay: '120ms',
            }}
          >
            Built on<br />
            <span style={{ color: 'var(--accent)' }}>earned trust.</span>
          </h2>
        </div>

        {/* Stat strip — 2x2 on mobile, 4-col on lg */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 0,
            marginBottom: 'clamp(3rem, 6vw, 5rem)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '1px solid var(--surface-border)',
          }}
          role="list"
          aria-label="Guarantee statistics"
        >
          {guarantees.map((g, i) => (
            <div
              key={i}
              role="listitem"
              style={{
                padding: 'clamp(1.25rem, 3vw, 2rem)',
                borderRight: (i % 2 === 0) ? '1px solid var(--surface-border)' : 'none',
                borderBottom: (i < 2) ? '1px solid var(--surface-border)' : 'none',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
                transition: 'opacity 500ms ease, transform 500ms ease',
                transitionDelay: `${200 + i * 60}ms`,
              }}
            >
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 5vw, 2.75rem)',
                lineHeight: 1,
                letterSpacing: '-0.02em',
                color: 'var(--accent)',
                display: 'block',
                marginBottom: '0.25rem',
              }}>
                {g.stat}
              </span>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                fontWeight: 600,
                color: 'var(--text-primary)',
                display: 'block',
                marginBottom: '0.375rem',
              }}>
                {g.label}
              </span>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.75rem, 1.2vw, 0.875rem)',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
              }}>
                {g.detail}
              </span>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div
          style={{
            marginBottom: 'clamp(1rem, 2vw, 1.5rem)',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 500ms ease',
            transitionDelay: '460ms',
          }}
        >
          <span className="eyebrow">What they said</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: 'clamp(1rem, 2.5vw, 1.5rem)',
        }}>
          {testimonials.map((t, i) => (
            <blockquote
              key={i}
              className="studio-card"
              style={{
                padding: 'clamp(1.5rem, 3vw, 2rem)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(1rem, 2vw, 1.5rem)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
                transition: 'opacity 600ms ease, transform 600ms ease',
                transitionDelay: `${520 + i * 80}ms`,
                margin: 0,
              }}
            >
              {/* Stars */}
              <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }).map((_, si) => (
                  <span key={si} style={{ color: 'var(--accent)', fontSize: '0.9rem' }} aria-hidden="true">★</span>
                ))}
              </div>

              {/* Quote */}
              <p style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontSize: 'clamp(1rem, 2vw, 1.1875rem)',
                lineHeight: 1.6,
                color: 'var(--text-primary)',
                flex: 1,
                margin: 0,
              }}>
                "{t.quote}"
              </p>

              {/* Attribution */}
              <footer style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                paddingTop: 'clamp(0.875rem, 2vw, 1.25rem)',
                borderTop: '1px solid var(--surface-border)',
              }}>
                <div style={{
                  width: '2.25rem',
                  height: '2.25rem',
                  borderRadius: '50%',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--accent-surface)',
                  border: '1px solid var(--accent-border)',
                  color: 'var(--accent)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                }} aria-hidden="true">
                  {t.name[0]}
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    {t.name}
                  </p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.06em', color: 'var(--text-muted)', margin: 0 }}>
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
