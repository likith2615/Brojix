import React from 'react';
import { Shield, Clock, CheckCircle2, MessageSquare } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export default function Trust() {
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.05 });

  const pillars = [
    { icon: Shield, title: "100% Confidential", desc: "Your identity and college details are never shared." },
    { icon: Clock, title: "On-Time Delivery", desc: "Deadlines are strictly met, no excuses." },
    { icon: CheckCircle2, title: "Plagiarism-Free", desc: "Original code and custom-written reports." },
    { icon: MessageSquare, title: "Direct Support", desc: "Direct WhatsApp communication for instant updates." }
  ];

  const testimonials = [
    {
      text: "Got my internship AI study buddy project in just 1 day through Streamlit.",
      author: "Usha",
      course: "B.Tech CSM 3rd Year"
    },
    {
      text: "Got my report of AI travel planner with just 1 day and I got full score along with interview preparation guide.",
      author: "Jaya Chandra",
      course: "CSC 3rd Year"
    }
  ];

  return (
    <section ref={sectionRef} id="trust" className="py-24 px-container-padding-mobile md:px-container-padding-desktop scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-16">
          <span className={`inline-block text-[11px] tracking-[0.18em] text-primary-fixed mb-4 font-medium uppercase transition-all duration-700 delay-100 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            MY GUARANTEES
          </span>
          <h2 className={`text-[clamp(32px,5vw,52px)] font-bold text-white mb-4 tracking-tight transition-all duration-700 delay-200 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Trust &amp; Reliability</h2>
          <p className={`text-base text-on-surface-variant max-w-[480px] mx-auto leading-relaxed transition-all duration-700 delay-300 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            Clear promises. No excuses. I deliver exactly what I say.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={index} 
                style={{ transitionDelay: `${40 + index * 40}ms` }}
                className={`glass-panel p-8 rounded-2xl text-center border-white/5 hover:border-secondary/30 transition-all duration-500 transform ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="bg-surface-container-highest w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-headline-md text-white mb-3">{pillar.title}</h3>
                <p className="text-on-surface-variant text-sm">{pillar.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              style={{ transitionDelay: `${80 + index * 60}ms` }}
              className={`liquid-glass p-6 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden transition-all duration-750 transform ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
            >
              <div className="absolute top-8 right-8 text-primary-fixed opacity-10">
                <MessageSquare className="w-16 h-16" />
              </div>
              <div className="flex gap-1 mb-6 text-primary-fixed text-lg">
                <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
              </div>
              <p className="text-white text-xl md:text-2xl font-body-lg italic mb-8 relative z-10 leading-relaxed tracking-tight">"{testimonial.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary-fixed/10 rounded-full flex items-center justify-center font-bold text-primary-fixed text-xl border border-primary-fixed/30">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg tracking-wide">{testimonial.author}</h4>
                  <p className="text-primary-fixed font-label-caps">{testimonial.course}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
