import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { MessageSquare, Code2, PackageCheck } from 'lucide-react';

const steps = [
  {
    icon: MessageSquare,
    phase: 'Discovery',
    title: 'Brief & Scope',
    desc: 'Send your requirements via WhatsApp. We agree on features, deliverables, and a fixed scope before any work begins.',
    detail: 'No hidden costs.',
  },
  {
    icon: Code2,
    phase: 'Build',
    title: 'Clean Execution',
    desc: 'Code and reports are built with regular progress updates. You see exactly what\'s being built.',
    detail: 'Real-time updates.',
  },
  {
    icon: PackageCheck,
    phase: 'Handover',
    title: 'Full Delivery',
    desc: 'Source code, database, deployment, and report — everything documented and handed over on the agreed date.',
    detail: 'On-time, always.',
  },
];

export default function HowItWorks() {
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.05 });

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      style={{ padding: 'clamp(4rem, 8vw, 7rem) clamp(1.25rem, 5vw, 4rem)', scrollMarginTop: '5rem' }}
      aria-labelledby="process-heading"
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
            <span className="eyebrow">Process</span>
          </div>
          <h2
            id="process-heading"
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
            From brief to<br />
            <span style={{ color: 'var(--accent)' }}>handover.</span>
          </h2>
        </div>

        {/* Steps — stacked on mobile, row on md+ with connector */}
        <div style={{ position: 'relative' }}>
          {/* Horizontal connector — desktop only (hidden on mobile via media query in inline check) */}
          <div
            className="hidden md:block"
            style={{
              position: 'absolute',
              top: '0.5625rem',  /* aligns with the dot center */
              left: 0,
              right: 0,
              height: '1px',
              background: 'var(--surface-border)',
            }}
            aria-hidden="true"
          />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: 'clamp(2rem, 5vw, 3.5rem)',
          }}>
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(22px)',
                    transition: 'opacity 600ms ease, transform 600ms ease',
                    transitionDelay: `${200 + i * 100}ms`,
                  }}
                >
                  {/* Phase marker row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: 'clamp(1.25rem, 3vw, 2rem)', position: 'relative', zIndex: 1 }}>
                    <div
                      style={{
                        width: '1.125rem',
                        height: '1.125rem',
                        borderRadius: '50%',
                        flexShrink: 0,
                        border: '2px solid',
                        background: i === 0 ? 'var(--accent)' : 'var(--surface-raised)',
                        borderColor: i === 0 ? 'var(--accent)' : 'var(--surface-border)',
                      }}
                      aria-hidden="true"
                    />
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6rem',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: i === 0 ? 'var(--accent)' : 'var(--text-muted)',
                    }}>
                      {step.phase}
                    </span>
                  </div>

                  {/* Icon tile */}
                  <div style={{
                    width: 'clamp(2.25rem, 4vw, 2.75rem)',
                    height: 'clamp(2.25rem, 4vw, 2.75rem)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--surface-overlay)',
                    border: '1px solid var(--surface-border)',
                    marginBottom: 'clamp(1rem, 2.5vw, 1.5rem)',
                  }} aria-hidden="true">
                    <Icon style={{ width: 'clamp(1rem, 2vw, 1.25rem)', height: 'clamp(1rem, 2vw, 1.25rem)', color: 'var(--accent)' }} />
                  </div>

                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                    color: 'var(--text-primary)',
                    marginBottom: '0.75rem',
                    lineHeight: 1.2,
                  }}>
                    {step.title}
                  </h3>

                  <p style={{
                    fontSize: 'clamp(0.875rem, 1.5vw, 0.9375rem)',
                    lineHeight: 1.65,
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-body)',
                    marginBottom: '0.875rem',
                  }}>
                    {step.desc}
                  </p>

                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.625rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--accent)',
                  }}>
                    {step.detail}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA strip */}
        <div
          style={{
            marginTop: 'clamp(2.5rem, 5vw, 4rem)',
            paddingTop: 'clamp(1.5rem, 3vw, 2.5rem)',
            borderTop: '1px solid var(--surface-border)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 500ms ease',
            transitionDelay: '560ms',
          }}
        >
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)',
            color: 'var(--text-secondary)',
          }}>
            Ready to start? It takes 2 minutes to brief us.
          </p>
          <a href="#contact" className="btn-primary" style={{ fontSize: '0.875rem', padding: '0.625rem 1.375rem', flexShrink: 0 }}>
            WhatsApp Us
          </a>
        </div>

      </div>
    </section>
  );
}
