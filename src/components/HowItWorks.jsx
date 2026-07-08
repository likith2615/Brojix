import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { MessageSquare, Code2, PackageCheck } from 'lucide-react';

const steps = [
  {
    icon: MessageSquare,
    phase: 'Discovery',
    title: 'Brief & Scope',
    desc: 'Send your requirements via WhatsApp. We agree on features, deliverables, and a fixed price before any work begins.',
    detail: 'No hidden costs.',
  },
  {
    icon: Code2,
    phase: 'Build',
    title: 'Clean Execution',
    desc: 'Code and reports are built with progress updates every step. You can see exactly what\'s being built.',
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
      className="py-28 px-container-padding-mobile md:px-container-padding-desktop scroll-mt-24"
      aria-labelledby="process-heading"
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
            <span className="eyebrow">Process</span>
          </div>
          <h2
            id="process-heading"
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
            From brief to<br />
            <span style={{ color: 'var(--accent)' }}>handover.</span>
          </h2>
        </div>

        {/* Timeline — horizontal connector on desktop */}
        <div className="relative">
          {/* Connector line (desktop only) */}
          <div
            className="hidden md:block absolute top-9 left-0 right-0 h-px"
            style={{ background: 'var(--surface-border)' }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'opacity 600ms ease, transform 600ms ease',
                    transitionDelay: `${200 + i * 100}ms`,
                  }}
                >
                  {/* Phase marker */}
                  <div className="flex items-center gap-3 mb-6 relative">
                    <div
                      className="w-[18px] h-[18px] rounded-full border-2 flex-shrink-0"
                      style={{
                        background: i === 0 ? 'var(--accent)' : 'var(--surface-raised)',
                        borderColor: i === 0 ? 'var(--accent)' : 'var(--surface-border)',
                      }}
                      aria-hidden="true"
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.65rem',
                        letterSpacing: '0.12em',
                        color: i === 0 ? 'var(--accent)' : 'var(--text-muted)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {step.phase}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="pl-1">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                      style={{ background: 'var(--surface-overlay)', border: '1px solid var(--surface-border)' }}
                      aria-hidden="true"
                    >
                      <Icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                    </div>

                    <h3
                      className="mb-3"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.375rem',
                        color: 'var(--text-primary)',
                        lineHeight: 1.2,
                      }}
                    >
                      {step.title}
                    </h3>

                    <p
                      className="text-sm leading-relaxed mb-4"
                      style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
                    >
                      {step.desc}
                    </p>

                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.65rem',
                        letterSpacing: '0.1em',
                        color: 'var(--accent)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {step.detail}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA below */}
        <div
          className="mt-16 pt-10 flex items-center justify-between flex-wrap gap-4"
          style={{
            borderTop: '1px solid var(--surface-border)',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 500ms ease',
            transitionDelay: '560ms',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.0625rem',
              color: 'var(--text-secondary)',
            }}
          >
            Ready to start? It takes 2 minutes to brief us.
          </p>
          <a href="#contact" className="btn-primary" style={{ fontSize: '0.9rem', padding: '0.6rem 1.5rem' }}>
            WhatsApp Us
          </a>
        </div>

      </div>
    </section>
  );
}
