import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { Check, ArrowRight } from 'lucide-react';

const services = [
  {
    tag: 'REPORT',
    title: 'Internship Report',
    turnaround: '3–5 days',
    description: 'Plagiarism-free, IEEE-formatted internship reports with UML diagrams and full referencing.',
    features: [
      'Plagiarism-free content',
      'UML diagrams included',
      'IEEE standard formatting',
      'Referencing & citations',
    ],
    cta: 'Order Report',
    featured: false,
  },
  {
    tag: 'BUNDLE — POPULAR',
    title: 'Project + Report',
    turnaround: '7–10 days',
    description: 'The complete package — working software matched perfectly to a professional report.',
    features: [
      'Everything in both tiers',
      'Report matches code exactly',
      'Priority 24/7 WhatsApp support',
      'Free revision round',
    ],
    cta: 'Get the Bundle',
    featured: true,
  },
  {
    tag: 'SOFTWARE',
    title: 'Software Project',
    turnaround: '5–7 days',
    description: 'Full-stack applications in React, Node.js, or Next.js — shipped with source code and deployment.',
    features: [
      'React / Node.js / Next.js',
      'Responsive, modern UI',
      'Source code + DB included',
      'Free deployment setup',
    ],
    cta: 'Start Project',
    featured: false,
  },
];

export default function Services() {
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.05 });

  const handleCta = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      id="services"
      style={{ padding: 'clamp(4rem, 8vw, 7rem) clamp(1.25rem, 5vw, 4rem)', scrollMarginTop: '5rem' }}
      aria-labelledby="services-heading"
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
              transitionDelay: '60ms'
            }}
          >
            <span className="eyebrow">What we offer</span>
          </div>
          <h2
            id="services-heading"
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
            Everything you need,<br />
            <span style={{ color: 'var(--accent)' }}>done right.</span>
          </h2>
          <p
            style={{
              marginTop: 'clamp(0.75rem, 2vw, 1.25rem)',
              fontSize: 'clamp(0.9375rem, 1.5vw, 1.0625rem)',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-body)',
              maxWidth: '460px',
              lineHeight: 1.65,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 500ms ease, transform 500ms ease',
              transitionDelay: '200ms',
            }}
          >
            Contact us on WhatsApp for a custom quote — all packages are negotiable.
          </p>
        </div>

        {/* Cards grid — 1 col mobile, 3 col desktop */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: 'clamp(1rem, 2.5vw, 1.5rem)',
        }}>
          {services.map((service, i) => (
            <div
              key={i}
              className="relative"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(22px)',
                transition: 'opacity 600ms ease, transform 600ms ease',
                transitionDelay: `${200 + i * 80}ms`,
              }}
            >
              <div
                className="studio-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  padding: 'clamp(1.5rem, 3vw, 2rem)',
                  ...(service.featured ? {
                    borderColor: 'var(--accent-border)',
                    background: 'var(--surface-overlay)',
                    boxShadow: '0 0 0 1px rgba(210,240,0,0.08), 0 16px 48px rgba(0,0,0,0.4)',
                  } : {}),
                }}
              >
                {/* Popular badge */}
                {service.featured && (
                  <div style={{ position: 'absolute', top: '-0.85rem', left: 'clamp(1rem, 3vw, 1.75rem)' }}>
                    <span style={{
                      background: 'var(--accent)',
                      color: 'var(--accent-text)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6rem',
                      letterSpacing: '0.12em',
                      fontWeight: 600,
                      padding: '0.25rem 0.875rem',
                      borderRadius: '999px',
                      display: 'inline-block',
                    }}>
                      MOST POPULAR
                    </span>
                  </div>
                )}

                {/* Tag */}
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  letterSpacing: '0.14em',
                  color: service.featured ? 'var(--accent)' : 'var(--text-muted)',
                  textTransform: 'uppercase',
                  marginBottom: '0.875rem',
                }}>
                  {service.tag}
                </p>

                {/* Title */}
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                  lineHeight: 1.15,
                  color: 'var(--text-primary)',
                  marginBottom: '0.75rem',
                }}>
                  {service.title}
                </h3>

                {/* Description */}
                <p style={{
                  fontSize: 'clamp(0.875rem, 1.5vw, 0.9375rem)',
                  lineHeight: 1.65,
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)',
                  marginBottom: '1.25rem',
                }}>
                  {service.description}
                </p>

                {/* Turnaround */}
                <div style={{
                  marginBottom: '1.5rem',
                  paddingBottom: '1.5rem',
                  borderBottom: '1px solid var(--surface-border)',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.625rem',
                    letterSpacing: '0.1em',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                  }}>
                    DELIVERY · {service.turnaround.toUpperCase()}
                  </p>
                </div>

                {/* Features */}
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 auto 0', display: 'flex', flexDirection: 'column', gap: '0.625rem' }} role="list">
                  {service.features.map((feat, fi) => (
                    <li
                      key={fi}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.625rem',
                        fontSize: 'clamp(0.8125rem, 1.2vw, 0.9rem)',
                        color: 'var(--text-secondary)',
                        fontFamily: 'var(--font-body)',
                        lineHeight: 1.5,
                      }}
                    >
                      <Check
                        className="flex-shrink-0"
                        style={{ width: '0.875rem', height: '0.875rem', marginTop: '0.15rem', color: 'var(--accent)' }}
                        aria-hidden="true"
                      />
                      {feat}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={handleCta}
                  className={service.featured ? 'btn-primary' : 'btn-ghost'}
                  style={{ width: '100%', marginTop: 'clamp(1.5rem, 3vw, 2rem)' }}
                  aria-label={`${service.cta} — ${service.title}`}
                >
                  {service.cta}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p
          style={{
            marginTop: 'clamp(1.5rem, 3vw, 2rem)',
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 500ms ease',
            transitionDelay: '540ms',
          }}
        >
          Custom pricing available · WhatsApp us for a quote
        </p>

      </div>
    </section>
  );
}
