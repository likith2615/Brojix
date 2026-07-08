import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const connectLinks = [
  { label: 'WhatsApp', value: '+91 8179072511',           href: 'https://wa.me/918179072511',                    external: true },
  { label: 'Email',    value: 'chippelikith@gmail.com',    href: 'mailto:chippelikith@gmail.com',                 external: false },
  { label: 'LinkedIn', value: 'Likith Kumar Chippe',       href: 'https://in.linkedin.com/in/likith-kumar-chippe', external: true },
];

const navLinks = [
  { name: 'Home',          href: '/' },
  { name: 'About',         href: '/about' },
  { name: 'Services',      href: '/#services' },
  { name: 'Work',          href: '/#portfolio' },
  { name: 'Start Project', href: '/#contact' },
];

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--surface-border)',
        padding: 'clamp(3rem, 7vw, 6rem) clamp(1.25rem, 5vw, 4rem) clamp(2rem, 4vw, 3rem)',
        position: 'relative',
        zIndex: 10,
      }}
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto">

        {/* Top grid — stacks fully on mobile */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
          gap: 'clamp(2.5rem, 6vw, 4rem)',
          marginBottom: 'clamp(3rem, 6vw, 5rem)',
        }}>

          {/* Brand column */}
          <div>
            <a
              href="/"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 8vw, 4rem)',
                letterSpacing: '-0.04em',
                lineHeight: 1,
                color: 'var(--text-primary)',
                display: 'block',
                marginBottom: 'clamp(0.75rem, 2vw, 1.25rem)',
                textDecoration: 'none',
              }}
              aria-label="Brojix home"
            >
              BRO<span style={{ color: 'var(--accent)' }}>JIX</span>
            </a>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.875rem, 1.5vw, 0.9375rem)',
              lineHeight: 1.65,
              color: 'var(--text-secondary)',
              maxWidth: '280px',
            }}>
              Software projects, internship reports, and full-stack delivery — built by someone who actually cares.
            </p>
          </div>

          {/* Connect column */}
          <div>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: 'clamp(1.25rem, 3vw, 1.75rem)',
            }}>
              Connect
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 2vw, 1.25rem)' }}>
              {connectLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="group"
                    style={{ textDecoration: 'none', display: 'flex', alignItems: 'flex-start', gap: '0.375rem' }}
                    aria-label={`${link.label}: ${link.value}`}
                  >
                    <div>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.125rem' }}>
                        {link.label}
                      </p>
                      <p
                        className="group-hover:text-accent transition-colors duration-200"
                        style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.8125rem, 1.2vw, 0.9rem)', fontWeight: 500, color: 'var(--text-secondary)' }}
                      >
                        {link.value}
                      </p>
                    </div>
                    {link.external && (
                      <ArrowUpRight
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{ width: '0.75rem', height: '0.75rem', marginTop: '1.1rem', flexShrink: 0, color: 'var(--accent)' }}
                        aria-hidden="true"
                      />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation column */}
          <div>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: 'clamp(1.25rem, 3vw, 1.75rem)',
            }}>
              Navigation
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'clamp(0.625rem, 1.5vw, 0.875rem)' }}>
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      transition: 'color 180ms ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--surface-border)',
          paddingTop: 'clamp(1.25rem, 3vw, 2rem)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.875rem',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.58rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}>
            © {new Date().getFullYear()} Brojix · Chippe Likith Kumar · All rights reserved
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Hidden admin link */}
            <a href="/admin" style={{ color: 'transparent', fontSize: 0, pointerEvents: 'all' }} aria-label="Admin" title="Admin Gateway">·</a>

            {/* Status pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                background: 'var(--accent-surface)',
                border: '1px solid var(--accent-border)',
              }}
              role="status"
              aria-label="System status: online"
            >
              <span
                className="animate-pulse"
                style={{ width: '0.375rem', height: '0.375rem', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }}
                aria-hidden="true"
              />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                Online
              </span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
