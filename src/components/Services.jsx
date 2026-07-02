import React, { useRef } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export default function Services() {
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.05 });

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

  const handleGetStarted = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} id="services" className="py-24 px-container-padding-mobile md:px-container-padding-desktop relative scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className={`inline-block text-[11px] tracking-[0.18em] text-primary-fixed mb-4 font-medium uppercase transition-all duration-700 delay-100 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            INVESTMENT
          </span>
          <h2 className={`text-[clamp(32px,5vw,52px)] font-bold text-white mb-4 tracking-tight transition-all duration-700 delay-200 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Pricing Options</h2>
          <p className={`text-base text-on-surface-variant max-w-[480px] mx-auto leading-relaxed transition-all duration-700 delay-300 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>Select the package for your final year project. Straightforward pricing, no hidden fees.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {services.map((service, index) => {
            const delayStyle = { transitionDelay: `${200 + index * 100}ms` };
            if (service.isBundle) {
              // The Bundle / Popular Card
              return (
                <div 
                  key={index} 
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={delayStyle}
                  className={`glass-panel p-6 md:p-10 rounded-2xl flex flex-col border-primary-fixed/50 md:scale-105 shadow-[0_0_20px_rgba(210,240,0,0.1)] z-20 relative overflow-hidden group transition-all duration-700 transform ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
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
                    <span className="text-primary-fixed text-4xl font-bold tracking-tighter drop-shadow-[0_0_10px_rgba(210,240,0,0.2)]">₹{service.price}</span>
                    <p className="text-on-surface-variant text-xs mt-2 italic">Starting from • Price is negotiable</p>
                  </div>
                  <ul className="space-y-4 mb-12 flex-grow">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-white">
                        <span className="material-symbols-outlined text-sm text-primary-fixed">check_circle</span> 
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button onClick={handleGetStarted} className="w-full py-4 bg-primary-fixed text-on-primary-fixed rounded-lg font-bold hover:shadow-[0_0_20px_rgba(210,240,0,0.4)] transition-all duration-300">
                    Get Started
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
                style={delayStyle}
                className={`glass-panel p-6 md:p-10 rounded-2xl flex flex-col border-white/5 hover:border-primary-fixed/30 transition-all duration-700 transform ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                } group`}
              >
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-white mb-1">{service.title}</h3>
                    <p className="text-on-surface-variant text-sm">{service.subtitle}</p>
                  </div>
                  <span className="material-symbols-outlined text-secondary">{service.icon}</span>
                </div>
                <div className="mb-10">
                  <span className={`text-4xl font-bold tracking-tighter ${index === 0 ? 'text-white' : 'text-secondary drop-shadow-[0_0_10px_rgba(220,184,255,0.3)]'}`}>
                    ₹{service.price}
                  </span>
                  <p className="text-on-surface-variant text-xs mt-2 italic">Starting from • Price is negotiable</p>
                </div>
                <ul className="space-y-4 mb-12 flex-grow">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-on-surface-variant">
                      <span className={`material-symbols-outlined text-sm ${index === 0 ? 'text-white' : 'text-secondary'}`}>check_circle</span> 
                      {feature}
                    </li>
                  ))}
                </ul>
                <button onClick={handleGetStarted} className={`w-full py-4 border border-outline-variant rounded-lg text-white font-bold transition-all duration-300 ${index === 0 ? 'hover:bg-white hover:text-black' : 'hover:border-secondary hover:text-secondary'}`}>
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
