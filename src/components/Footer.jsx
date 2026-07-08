import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const connectLinks = [
  {
    label: 'WhatsApp',
    value: '+91 8179072511',
    href: 'https://wa.me/918179072511',
    external: true,
  },
  {
    label: 'Email',
    value: 'chippelikith@gmail.com',
    href: 'mailto:chippelikith@gmail.com',
    external: false,
  },
  {
    label: 'LinkedIn',
    value: 'Likith Kumar Chippe',
    href: 'https://in.linkedin.com/in/likith-kumar-chippe',
    external: true,
  },
];

const navLinks = [
  { name: 'Home',         href: '/' },
  { name: 'About',        href: '/about' },
  { name: 'Services',     href: '/#services' },
  { name: 'Work',         href: '/#portfolio' },
  { name: 'Start Project', href: '/#contact' },
];

export default function Footer() {
  return (
    <footer
      className="w-full relative z-10 pt-24 pb-12"
      style={{ borderTop: '1px solid var(--surface-border)' }}
      aria-label="Site footer"
    >
      <div className="px-container-padding-mobile md:px-container-padding-desktop max-w-7xl mx-auto">

        {/* Top: wordmark + columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-16">

          {/* Brand */}
          <div className="md:col-span-1">
            <a
              href="/"
              className="font-display text-5xl tracking-tight leading-none block mb-4"
              style={{ letterSpacing: '-0.04em', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              aria-label="Brojix home"
            >
              BRO<span style={{ color: 'var(--accent)' }}>JIX</span>
            </a>
            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
            >
              Software projects, internship reports, and full-stack delivery for college students — built by someone who actually cares.
            </p>
          </div>

          {/* Connect */}
          <div>
            <p
              className="mb-5"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.14em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
              }}
            >
              Connect
            </p>
            <ul className="space-y-4" role="list">
              {connectLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="group flex items-start gap-2"
                    style={{ textDecoration: 'none' }}
                    aria-label={`${link.label}: ${link.value}`}
                  >
                    <div>
                      <p
                        className="text-xs mb-0.5"
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.625rem',
                          letterSpacing: '0.1em',
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase',
                        }}
                      >
                        {link.label}
                      </p>
                      <p
                        className="text-sm font-medium transition-colors duration-200"
                        style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                      >
                        {link.value}
                      </p>
                    </div>
                    {link.external && (
                      <ArrowUpRight
                        className="w-3 h-3 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{ color: 'var(--accent)' }}
                        aria-hidden="true"
                      />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <p
              className="mb-5"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.14em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
              }}
            >
              Navigation
            </p>
            <ul className="space-y-3" role="list">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', textDecoration: 'none' }}
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
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: '1px solid var(--surface-border)' }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              letterSpacing: '0.12em',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
            }}
          >
            © {new Date().getFullYear()} Brojix · Chippe Likith Kumar · All rights reserved
          </p>

          <div className="flex items-center gap-4">
            {/* Admin hidden link */}
            <a
              href="/admin"
              title="Admin Gateway"
              style={{ color: 'transparent', fontSize: '0' }}
              aria-label="Admin"
            >
              ·
            </a>

            {/* Status pill */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background: 'var(--accent-surface)',
                border: '1px solid var(--accent-border)',
              }}
              role="status"
              aria-label="System status: online"
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: 'var(--accent)' }}
                aria-hidden="true"
              />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.1em',
                  color: 'var(--accent)',
                  textTransform: 'uppercase',
                }}
              >
                Systems online
              </span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
