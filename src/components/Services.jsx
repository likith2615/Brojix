import React, { useRef, useEffect } from 'react';
import { useAnimeOnScroll } from '../hooks/useAnimeOnScroll';
import { animate, createScope, stagger, onScroll } from 'animejs';

export default function Services() {
  const cardsRef = useRef([]);

  useEffect(() => {
    // Scroll Entrance Animations
    const scope = createScope({
      mediaQueries: { noMotion: '(prefers-reduced-motion: reduce)' }
    });

    scope.add(({ matches }) => {
      if (matches.noMotion) return;

      // Section title stagger
      animate('.service-header', {
        opacity: [0, 1],
        translateY: [40, 0],
        delay: stagger(100),
        duration: 600,
        ease: 'outExpo',
        autoplay: onScroll({ enter: 'bottom 100%' }),
      });

      // Cards stagger
      animate('.service-card', {
        opacity: [0, 1],
        translateY: [40, 0],
        delay: stagger(100),
        duration: 600,
        ease: 'outExpo',
        autoplay: onScroll({ enter: 'bottom 100%' }),
      });
    });

    return () => scope.revert();
  }, []);

  const services = [
    {
      title: "Software Project",
      subtitle: "Full-stack application",
      icon: "token",
      price: 500,
      features: [
        "React, Node.js, Next.js",
        "Responsive UI",
        "Source code & DB included",
        "Free deployment setup"
      ],
      turnaround: "5-7 Days",
      isBundle: false
    },
    {
      title: "Project + Report",
      subtitle: "The complete ecosystem",
      icon: "analytics",
      price: 700,
      features: [
        "Everything in Project tier",
        "Everything in Report tier",
        "Report perfectly matches code",
        "Priority 24/7 support"
      ],
      turnaround: "7-10 Days",
      isBundle: true
    },
    {
      title: "Internship Report",
      subtitle: "Professional diagnostic suite",
      icon: "layers",
      price: 300,
      features: [
        "Plagiarism-free content",
        "UML Diagrams included",
        "Formatting & referencing",
        "IEEE standard format"
      ],
      turnaround: "3-5 Days",
      isBundle: false
    }
  ];

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.transition = 'none';
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    card.style.transition = 'transform 0.5s ease-out';
  };

  return (
    <section id="services" className="py-32 px-container-padding-mobile md:px-container-padding-desktop relative scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="service-header inline-block text-[11px] tracking-[0.18em] text-primary-fixed mb-4 font-medium uppercase opacity-0">
            INVESTMENT
          </span>
          <h2 className="service-header text-[clamp(32px,5vw,52px)] font-bold text-white mb-4 tracking-tight opacity-0" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Pricing Options</h2>
          <p className="service-header text-base text-on-surface-variant max-w-[480px] mx-auto leading-relaxed opacity-0">Select the package for your final year project. Straightforward pricing, no hidden fees.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {services.map((service, index) => {
            if (service.isBundle) {
              // The Bundle / Popular Card
              return (
                <div 
                  key={index} 
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  className="service-card opacity-0 glass-panel p-6 md:p-10 rounded-2xl flex flex-col border-primary-fixed/50 md:scale-105 shadow-[0_0_40px_rgba(210,240,0,0.15)] z-20 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 bg-primary-fixed text-on-primary-fixed text-[10px] font-bold px-4 py-1 rounded-bl-lg tracking-widest uppercase">Popular</div>
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="font-headline-md text-headline-md text-white mb-1">{service.title}</h3>
                      <p className="text-on-surface-variant text-sm">{service.subtitle}</p>
                    </div>
                    <span className="material-symbols-outlined text-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>{service.icon}</span>
                  </div>
                  <div className="mb-10">
                    <span className="text-primary-fixed text-4xl font-bold tracking-tighter drop-shadow-[0_0_10px_rgba(210,240,0,0.5)]">₹{service.price}</span>
                  </div>
                  <ul className="space-y-4 mb-12 flex-grow">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-white">
                        <span className="material-symbols-outlined text-sm text-primary-fixed">check_circle</span> 
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-4 bg-primary-fixed text-on-primary-fixed rounded-lg font-bold hover:shadow-[0_0_20px_#d2f000] transition-all duration-300">
                    Access Diagnostic
                  </button>
                </div>
              );
            }

            // Normal Card
            return (
              <div 
                key={index} 
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="service-card opacity-0 glass-panel p-6 md:p-10 rounded-2xl flex flex-col border-white/5 hover:border-primary-fixed/30 transition-all duration-500 group"
              >
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-white mb-1">{service.title}</h3>
                    <p className="text-on-surface-variant text-sm">{service.subtitle}</p>
                  </div>
                  <span className="material-symbols-outlined text-secondary">{service.icon}</span>
                </div>
                <div className="mb-10">
                  <span className={`text-4xl font-bold tracking-tighter ${index === 0 ? 'text-white' : 'text-secondary drop-shadow-[0_0_10px_rgba(220,184,255,0.5)]'}`}>
                    ₹{service.price}
                  </span>
                </div>
                <ul className="space-y-4 mb-12 flex-grow">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-on-surface-variant">
                      <span className={`material-symbols-outlined text-sm ${index === 0 ? 'text-white' : 'text-secondary'}`}>check_circle</span> 
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-4 border border-outline-variant rounded-lg text-white font-bold transition-all duration-300 ${index === 0 ? 'hover:bg-white hover:text-black' : 'hover:border-secondary hover:text-secondary'}`}>
                  {index === 0 ? 'Start Your Project' : 'Secure Report'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
