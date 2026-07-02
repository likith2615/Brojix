import React, { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/#services' },
    { name: 'Products', href: '/#portfolio' },
    { name: 'Policies', href: '/#policies' },
  ];

  return (
    <>
      <nav ref={navRef} className={`fixed top-0 w-full transition-all duration-300 nav-fixed-main ${isScrolled ? 'bg-surface/80 backdrop-blur-md border-b border-white/10 shadow-lg py-2' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <a href="/" className="font-display-md text-3xl md:text-4xl font-bold text-white tracking-tighter flex items-center">BRO<span className="text-primary-fixed">JIX</span></a>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="font-body-md text-body-md text-on-surface-variant hover:text-primary-fixed hover:drop-shadow-[0_0_8px_rgba(210,240,0,0.8)] transition-all duration-300 active:scale-95"
                >
                  {link.name}
                </a>
              ))}
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <a href="/#contact" className="bg-primary-fixed text-on-primary-fixed px-6 py-2 rounded-full font-bold hover:shadow-[0_0_20px_#d2f000] transition-all duration-300 active:scale-95">
                Hire Me
              </a>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-primary-fixed hover:text-white focus:outline-none relative z-50"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Backdrop overlay - Rendered outside nav to prevent nested blur rendering bugs */}
      <div
        onClick={() => setIsOpen(false)}
        className={`md:hidden fixed inset-0 transition-opacity duration-300 backdrop-fixed-overlay ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Mobile Drawer Menu - Rendered outside nav to prevent nested blur rendering bugs */}
      <div
        className={`md:hidden fixed inset-y-0 right-0 w-64 border-l border-primary-fixed/20 shadow-[0_0_15px_rgba(210,240,0,0.1)] transition-transform duration-300 ease-in-out pt-24 drawer-fixed-menu ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-on-surface-variant hover:text-primary-fixed block px-3 py-4 rounded-md font-body-md text-base border-b border-white/5"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
