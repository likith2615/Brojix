import React, { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const navLinks = [
    { name: 'Home',          href: '/' },
    { name: 'About',         href: '/about' },
    { name: 'Services',      href: '/#services' },
    { name: 'Work',          href: '/#portfolio' },
    { name: 'Client Portal', href: '/dashboard' },
    { name: 'Policies',      href: '/#policies' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full transition-all duration-300 nav-fixed-main ${
          isScrolled ? 'navbar-scrolled py-3' : 'bg-transparent py-5'
        }`}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-14">
            {/* Wordmark */}
            <a
              href="/"
              className="font-display text-2xl tracking-tight flex items-end leading-none"
              style={{ letterSpacing: '-0.03em' }}
              aria-label="Brojix home"
            >
              BRO<span style={{ color: 'var(--accent)' }}>JIX</span>
            </a>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium transition-colors duration-200"
                  style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              <a href="/#contact" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
                Start a Project
              </a>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden focus:outline-none p-2"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              style={{ color: 'var(--text-primary)' }}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className={`md:hidden fixed inset-0 transition-opacity duration-300 backdrop-fixed-overlay ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-y-0 right-0 w-72 border-l transition-transform duration-300 ease-in-out pt-24 drawer-fixed-menu ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ borderColor: 'var(--surface-border)' }}
        aria-label="Mobile navigation menu"
      >
        {/* Drawer wordmark */}
        <div className="px-6 pb-6 border-b" style={{ borderColor: 'var(--surface-border)' }}>
          <span className="font-display text-xl" style={{ letterSpacing: '-0.03em' }}>
            BRO<span style={{ color: 'var(--accent)' }}>JIX</span>
          </span>
        </div>

        <nav className="px-4 pt-4 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-3.5 rounded-lg text-base font-medium transition-colors duration-150"
              style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
              onMouseEnter={e => {
                e.currentTarget.style.color = 'var(--accent)';
                e.currentTarget.style.background = 'var(--accent-surface)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="px-4 pt-6">
          <a
            href="/#contact"
            onClick={() => setIsOpen(false)}
            className="btn-primary w-full"
            style={{ fontSize: '0.9rem' }}
          >
            Start a Project
          </a>
        </div>
      </div>
    </>
  );
}
