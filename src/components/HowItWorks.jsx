import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export default function HowItWorks() {
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.05 });

  const steps = [
    {
      num: "01",
      title: "Discuss & Plan",
      desc: "Send your requirements via WhatsApp. We will finalize the scope, features, and pricing."
    },
    {
      num: "02",
      title: "Development",
      desc: "Clean code and structured reports are built securely with regular progress updates."
    },
    {
      num: "03",
      title: "Delivery Sync",
      desc: "You get the final source code, database, and a fully formatted project report on time."
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
    <section ref={sectionRef} id="how-it-works" className="py-24 px-container-padding-mobile md:px-container-padding-desktop scroll-mt-24">
      <div className="text-center mb-16">
        <span className={`inline-block text-[11px] tracking-[0.18em] text-primary-fixed mb-4 font-medium uppercase transition-all duration-700 delay-100 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          THE PROCESS
        </span>
        <h2 className={`text-[clamp(32px,5vw,52px)] font-bold text-white mb-4 tracking-tight transition-all duration-700 delay-200 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>How It Works</h2>
        <p className={`text-base text-on-surface-variant max-w-[480px] mx-auto leading-relaxed transition-all duration-700 delay-300 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          A seamless process designed for speed and clarity.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 overflow-hidden px-4 sm:px-6 lg:px-8">
        {steps.map((step, index) => (
          <div 
            key={index} 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transitionDelay: `${200 + index * 150}ms` }}
            className={`glass-panel rounded-3xl p-6 md:p-10 border border-white/5 relative overflow-hidden group transition-all duration-700 transform ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="text-primary-fixed/20 font-display-lg text-8xl absolute top-4 right-4 z-0 transition-transform duration-500 group-hover:scale-110">
              {step.num}
            </div>
            <div className="relative z-10 mt-16">
              <h4 className="font-headline-md text-headline-md text-white mb-4">{step.title}</h4>
              <p className="text-on-surface-variant">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
