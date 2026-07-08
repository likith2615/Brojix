import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { Check, ArrowRight } from 'lucide-react';

const services = [
  {
    tag: 'REPORT',
    title: 'Internship Report',
    price: '₹300',
    priceNote: 'starting',
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
    price: '₹700',
    priceNote: 'starting',
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
    price: '₹500',
    priceNote: 'starting',
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
      className="py-28 px-container-padding-mobile md:px-container-padding-desktop scroll-mt-24"
      aria-labelledby="services-heading"
    >
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="mb-16">
          <div
            className="mb-4 transition-all duration-500"
            style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(10px)', transitionDelay: '60ms' }}
          >
            <span className="eyebrow">Pricing</span>
          </div>
          <h2
            id="services-heading"
            className="transition-all duration-600"
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
            Clear pricing,<br />
            <span style={{ color: 'var(--accent)' }}>no surprises.</span>
          </h2>
          <p
            className="mt-4 text-base max-w-md transition-all duration-500"
            style={{
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-body)',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
              transitionDelay: '200ms',
            }}
          >
            Flat starting rates. All prices are negotiable based on complexity.
          </p>
        </div>

        {/* Cards — price-dominant, asymmetric */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {services.map((service, i) => (
            <div
              key={i}
              className="relative flex flex-col"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 600ms ease, transform 600ms ease',
                transitionDelay: `${200 + i * 80}ms`,
              }}
            >
              <div
                className="studio-card flex flex-col h-full p-7"
                style={service.featured ? {
                  borderColor: 'var(--accent-border)',
                  background: 'var(--surface-overlay)',
                  boxShadow: '0 0 0 1px oklch(78% 0.155 72 / 0.1), 0 16px 48px oklch(0% 0 0 / 0.4)',
                } : {}}
              >
                {/* Featured badge */}
                {service.featured && (
                  <div
                    className="absolute -top-3 left-7"
                  >
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{
                        background: 'var(--accent)',
                        color: 'var(--accent-text)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.65rem',
                        letterSpacing: '0.1em',
                      }}
                    >
                      MOST POPULAR
                    </span>
                  </div>
                )}

                {/* Tag */}
                <p
                  className="mb-4"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.14em',
                    color: service.featured ? 'var(--accent)' : 'var(--text-muted)',
                    textTransform: 'uppercase',
                  }}
                >
                  {service.tag}
                </p>

                {/* Title */}
                <h3
                  className="mb-3"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.375rem',
                    lineHeight: 1.15,
                    color: 'var(--text-primary)',
                  }}
                >
                  {service.title}
                </h3>

                {/* Description */}
                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
                >
                  {service.description}
                </p>

                {/* Price — dominant */}
                <div className="mb-6 pb-6" style={{ borderBottom: '1px solid var(--surface-border)' }}>
                  <div className="flex items-end gap-2">
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '2.75rem',
                        lineHeight: 1,
                        letterSpacing: '-0.03em',
                        color: service.featured ? 'var(--accent)' : 'var(--text-primary)',
                      }}
                    >
                      {service.price}
                    </span>
                    <span
                      className="mb-1.5"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)',
                        letterSpacing: '0.06em',
                      }}
                    >
                      / {service.priceNote}
                    </span>
                  </div>
                  <p
                    className="mt-1.5"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.65rem',
                      color: 'var(--text-muted)',
                      letterSpacing: '0.08em',
                    }}
                  >
                    DELIVERY · {service.turnaround.toUpperCase()}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 flex-1 mb-8" role="list">
                  {service.features.map((feat, fi) => (
                    <li
                      key={fi}
                      className="flex items-start gap-2.5 text-sm"
                      style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
                    >
                      <Check
                        className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                        style={{ color: 'var(--accent)' }}
                        aria-hidden="true"
                      />
                      {feat}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={handleCta}
                  className={service.featured ? 'btn-primary w-full' : 'btn-ghost w-full'}
                  aria-label={`${service.cta} — ${service.title}`}
                >
                  {service.cta}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p
          className="mt-8 text-center text-sm transition-all duration-500"
          style={{
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            letterSpacing: '0.08em',
            opacity: isVisible ? 1 : 0,
            transitionDelay: '540ms',
          }}
        >
          ALL PRICES NEGOTIABLE · CONTACT VIA WHATSAPP FOR CUSTOM SCOPE
        </p>

      </div>
    </section>
  );
}
