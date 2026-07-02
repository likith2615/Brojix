import React, { useState, useEffect } from 'react';
import { ExternalLink, Code } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { animate, stagger } from 'animejs';

export default function Portfolio() {
  const [filter, setFilter] = useState('all');
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.05 });

  // When filter changes, animate the items
  useEffect(() => {
    animate('.portfolio-item', {
      opacity: [0, 1],
      scale: [0.95, 1],
      delay: stagger(60, { grid: [1, 10], from: 'center' }),
      duration: 400,
      ease: 'outBack'
    });
  }, [filter]);

  const projects = [
    {
      title: "FitMind AI",
      category: "ai",
      displayCategory: "AI • HealthTech • Productivity",
      description: "An AI-powered fitness companion that creates personalized workout routines, calorie tracking, BMI analysis, nutrition guidance, and progress monitoring to help users achieve their health goals. Built with Python and Streamlit for an interactive experience.",
      tech: ["Python", "Streamlit", "AI APIs", "Pandas", "Plotly", "Machine Learning", "Data Visualization"],
      status: "Live",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='800' height='600' fill='%230f172a'/><path d='M100,300 L250,300 L280,200 L320,400 L360,260 L400,340 L430,300 L700,300' stroke='%23d2f000' stroke-width='6' stroke-linejoin='round' stroke-linecap='round' fill='none'/><circle cx='320' cy='400' r='10' fill='%23d2f000'/><text x='400' y='120' font-family='sans-serif' font-weight='bold' font-size='32' fill='%23ffffff' text-anchor='middle'>FITMIND AI</text><text x='400' y='500' font-family='sans-serif' font-size='20' fill='%2394a3b8' text-anchor='middle'>AI Fitness Tracker</text></svg>",
      demoLink: "https://ai-fitness-tracker.streamlit.app/",
      caseStudyLink: "#"
    },
    {
      title: "TravelGen AI",
      category: "ai",
      displayCategory: "AI • Travel • Productivity",
      description: "An AI-powered travel planning platform that generates personalized travel itineraries based on destination, budget, travel duration, and preferences. The application simplifies trip planning by offering intelligent recommendations for accommodation, transportation, and attractions.",
      tech: ["Python", "Streamlit", "AI APIs", "Maps APIs", "Prompt Engineering"],
      status: "Live",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='800' height='600' fill='%230f172a'/><circle cx='400' cy='300' r='150' stroke='%2338bdf8' stroke-width='4' stroke-dasharray='10,10' fill='none'/><path d='M250,300 C300,150 500,150 550,300 C500,450 300,450 250,300 Z' stroke='%2338bdf8' stroke-width='2' fill='none'/><circle cx='350' cy='220' r='8' fill='%2338bdf8'/><circle cx='450' cy='380' r='8' fill='%2338bdf8'/><text x='400' y='120' font-family='sans-serif' font-weight='bold' font-size='32' fill='%23ffffff' text-anchor='middle'>TRAVELGEN AI</text><text x='400' y='500' font-family='sans-serif' font-size='20' fill='%2394a3b8' text-anchor='middle'>AI Travel Planner</text></svg>",
      demoLink: "https://ai-travel-planner-bufget.streamlit.app/",
      caseStudyLink: "#"
    },
    {
      title: "Personal Portfolio",
      category: "web",
      displayCategory: "Portfolio • Frontend",
      description: "A modern personal portfolio showcasing my projects, technical skills, achievements, certifications, and development journey. Designed with a clean, responsive interface to reflect my work as a software developer and aspiring entrepreneur.",
      tech: ["React", "Tailwind CSS", "Lovable", "TypeScript"],
      status: "Live",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='800' height='600' fill='%230f172a'/><rect x='200' y='180' width='400' height='260' rx='10' stroke='%23fbbf24' stroke-width='4' fill='none'/><line x1='200' y1='230' x2='600' y2='230' stroke='%23fbbf24' stroke-width='2'/><circle cx='230' cy='205' r='6' fill='%23ef4444'/><circle cx='250' cy='205' r='6' fill='%23f59e0b'/><circle cx='270' cy='205' r='6' fill='%2310b981'/><text x='400' y='120' font-family='sans-serif' font-weight='bold' font-size='32' fill='%23ffffff' text-anchor='middle'>PERSONAL PORTFOLIO</text><text x='400' y='500' font-family='sans-serif' font-size='20' fill='%2394a3b8' text-anchor='middle'>Frontend Portfolio</text></svg>",
      demoLink: "https://likith-kumar-chippe.lovable.app/",
      caseStudyLink: "#"
    },
    {
      title: "NXTGEN Resume",
      category: "saas",
      displayCategory: "AI • Career • SaaS",
      description: "NXTGEN Resume is an AI-powered platform that helps users create ATS-friendly resumes, professional portfolios, and personalized career documents. The platform streamlines resume creation while enabling users to showcase projects and achievements effectively.",
      tech: ["React", "FastAPI", "Python", "PostgreSQL", "Gemini AI", "Tailwind CSS"],
      status: "Beta",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='800' height='600' fill='%230f172a'/><rect x='250' y='180' width='300' height='280' rx='8' stroke='%23a78bfa' stroke-width='4' fill='none'/><line x1='300' y1='240' x2='500' y2='240' stroke='%23a78bfa' stroke-width='4'/><line x1='300' y1='280' x2='450' y2='280' stroke='%23a78bfa' stroke-width='4'/><line x1='300' y1='320' x2='480' y2='320' stroke='%23a78bfa' stroke-width='4'/><line x1='300' y1='360' x2='400' y2='360' stroke='%23a78bfa' stroke-width='4'/><text x='400' y='120' font-family='sans-serif' font-weight='bold' font-size='32' fill='%23ffffff' text-anchor='middle'>NXTGEN RESUME</text><text x='400' y='500' font-family='sans-serif' font-size='20' fill='%2394a3b8' text-anchor='middle'>AI Resume Builder</text></svg>",
      demoLink: "https://nxtgen-resume.onrender.com",
      caseStudyLink: "#"
    }
  ];

  const filteredProjects = filter === 'all' ? projects : projects.filter(p => p.category === filter);

  return (
    <section ref={sectionRef} id="portfolio" className="py-24 px-container-padding-mobile md:px-container-padding-desktop scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className={`inline-block text-[11px] tracking-[0.18em] text-primary-fixed mb-4 font-medium uppercase transition-all duration-700 delay-100 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            PRODUCTS
          </span>
          <h2 className={`text-[clamp(32px,5vw,52px)] font-bold text-white mb-4 tracking-tight transition-all duration-700 delay-200 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Flagship Products</h2>
          <p className={`text-base text-on-surface-variant max-w-[540px] mx-auto leading-relaxed transition-all duration-700 delay-300 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            A curated selection of AI-powered solutions, SaaS applications, and interactive platforms.
          </p>

          <div className="flex justify-center gap-4 flex-wrap mt-8">
            {['all', 'ai', 'saas', 'web'].map((btn, index) => (
              <button
                key={btn}
                onClick={() => setFilter(btn)}
                style={{ transitionDelay: `${350 + index * 50}ms` }}
                className={`px-6 py-2 rounded-full font-label-caps text-label-caps uppercase tracking-widest transition-all duration-300 transform ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                } ${
                  filter === btn
                    ? 'bg-primary-fixed text-on-primary-fixed shadow-[0_0_15px_rgba(210,240,0,0.25)]'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-white border border-white/10'
                }`}
              >
                {btn === 'all' ? 'All Products' : btn}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {filteredProjects.map((project, index) => (
            <div
              key={index}
              className="portfolio-item glass-panel rounded-2xl overflow-hidden group border-white/5 hover:border-primary-fixed/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 overflow-hidden bg-[#0f172a] flex items-center justify-center">
                  <div className="absolute inset-0 bg-primary-fixed/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay"></div>
                  <img 
                    src={project.image} 
                    alt={`Screenshot or diagram of ${project.title} - ${project.description}`} 
                    loading="lazy"
                    className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-500 ease-out"
                  />
                  {/* Status Badge */}
                  <div className={`absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-[10px] font-label-caps uppercase font-bold tracking-wider ${
                    project.status.includes('Live') 
                      ? 'bg-primary-fixed/20 text-primary-fixed border border-primary-fixed/30' 
                      : 'bg-secondary/20 text-secondary border border-secondary/30'
                  }`}>
                    {project.status}
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Category */}
                  <span className="text-[10px] font-label-caps text-secondary uppercase tracking-widest block mb-1">
                    {project.displayCategory}
                  </span>
                  
                  {/* Title */}
                  <h3 className="font-headline-md text-2xl text-white mb-3 font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-6 min-h-[72px]">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.tech.map((t, i) => (
                      <span key={i} className="font-label-caps text-label-caps text-[9px] bg-surface-container border border-white/5 px-2.5 py-1 rounded text-on-surface-variant">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 border-t border-white/5 flex gap-3 mt-auto">
                <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2.5 px-3 bg-primary-fixed text-on-primary-fixed rounded-lg text-xs font-bold hover:shadow-[0_0_15px_rgba(210,240,0,0.3)] transition-all duration-300 active:scale-95">
                  Live Demo
                </a>
                {project.githubLink && (
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2.5 px-3 bg-surface-container border border-white/5 text-on-surface hover:text-primary-fixed hover:border-primary-fixed/20 rounded-lg text-xs font-bold transition-all duration-300 active:scale-95">
                    GitHub
                  </a>
                )}
                {project.caseStudyLink && project.caseStudyLink !== '#' && (
                  <a href={project.caseStudyLink} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2.5 px-3 bg-surface-container border border-white/5 text-on-surface hover:text-primary-fixed hover:border-primary-fixed/20 rounded-lg text-xs font-bold transition-all duration-300 active:scale-95">
                    Case Study
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
