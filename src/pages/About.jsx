import React, { useEffect, useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';
import { Terminal, Database, Code, Shield, Brain, Rocket, GraduationCap, Crosshair, ArrowUpRight, Zap, Target, BookOpen, Users } from 'lucide-react';
import profileImg from '../assets/profile.png';
import { Link } from 'react-router-dom';

export default function About() {
  useDocumentMetadata({
    title: "About | Chippe Likith Kumar — Building Products, Not Just Projects",
    description: "Chippe Likith Kumar is a developer and builder transforming complex problems into clean, functional software. Currently building BROJIX — an educational platform for students.",
    canonicalUrl: "https://brojix.netlify.app/about",
    ogTitle: "About | BROJIX — Chippe Likith Kumar",
    ogDescription: "Developer transforming complex problems into clean, functional software. Building real products with real impact.",
    ogUrl: "https://brojix.netlify.app/about"
  });

  const [isLoaded, setIsLoaded] = useState(false);

  // Hook up observers for each major page section
  const [approachRef, approachVisible] = useIntersectionObserver({ threshold: 0.05 });
  const [arsenalRef, arsenalVisible] = useIntersectionObserver({ threshold: 0.05 });
  const [valuesRef, valuesVisible] = useIntersectionObserver({ threshold: 0.05 });
  const [philRef, philVisible] = useIntersectionObserver({ threshold: 0.05 });
  const [ctaRef, ctaVisible] = useIntersectionObserver({ threshold: 0.05 });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const technologies = [
    { category: "Languages", icon: <Code className="w-5 h-5 text-primary-fixed" />, items: ["Python", "Java", "JavaScript", "TypeScript", "SQL"] },
    { category: "Frontend", icon: <Terminal className="w-5 h-5 text-primary-fixed" />, items: ["React", "Next.js", "Tailwind CSS", "HTML5", "CSS3", "Framer Motion"] },
    { category: "Backend", icon: <Database className="w-5 h-5 text-primary-fixed" />, items: ["FastAPI", "Flask", "Node.js", "Express", "REST APIs"] },
    { category: "Database", icon: <Database className="w-5 h-5 text-primary-fixed" />, items: ["PostgreSQL", "MongoDB", "SQLite", "Firebase"] },
    { category: "Cloud & Ops", icon: <Rocket className="w-5 h-5 text-primary-fixed" />, items: ["AWS", "Docker", "GitHub Actions", "Vercel", "Netlify"] },
    { category: "AI & ML", icon: <Brain className="w-5 h-5 text-primary-fixed" />, items: ["OpenAI", "Gemini", "LangChain", "Prompt Engineering", "RAG", "Vector DBs"] },
  ];

  const builds = [
    "Artificial Intelligence Applications", "Full Stack Web Applications", 
    "Cybersecurity Tools", "Developer Platforms", "Business Automation Systems", 
    "Portfolio Websites", "Dashboard Applications", "REST APIs", 
    "Cloud-Based Solutions", "Product MVPs"
  ];

  const coreValues = [
    { icon: <Zap />, title: "Innovation", desc: "Building modern software using emerging technologies." },
    { icon: <Shield />, title: "Quality", desc: "Writing maintainable, scalable, and production-ready code." },
    { icon: <BookOpen />, title: "Learning", desc: "Continuously improving through experimentation and hands-on projects." },
    { icon: <Users />, title: "Collaboration", desc: "Working with teams to build impactful solutions." }
  ];

  return (
    <div className="pt-32 pb-24 relative z-10 px-container-padding-mobile md:px-container-padding-desktop overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-32">
        
        {/* --- 1. HERO / INTRO --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className={`lg:col-span-7 transition-all duration-700 delay-100 transform ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}>
            <span className="font-label-caps text-xs md:text-sm text-primary-fixed mb-6 block tracking-[0.2em] uppercase">
              ABOUT THE FOUNDER
            </span>
            <h1 className="font-display-lg text-4xl sm:text-6xl font-bold text-white mb-6 tracking-tight leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Building Products,<br/>Not Just Projects.
            </h1>
            <p className="font-display-md text-xl md:text-2xl text-primary-fixed mb-8">
              Hello, I'm Likith Kumar Chippe.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              {['Software Engineer', 'AI Builder', 'Full Stack Developer', 'Startup Enthusiast'].map((tag, i) => (
                <span key={i} className="px-4 py-2 bg-surface-container border border-outline-variant rounded-full text-sm font-label-caps text-on-surface-variant uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
            <div className="space-y-4 text-on-surface-variant text-base md:text-lg leading-relaxed font-body-lg max-w-2xl">
              <p>
                I'm a full-stack developer and AI enthusiast focused on building scalable, production-ready products.
              </p>
              <p>
                I transform complex problems into clean, functional software. Currently building <strong>BROJIX</strong>, an educational platform for students to master real-world software development.
              </p>
            </div>
          </div>
          <div className={`lg:col-span-5 transition-all duration-700 delay-300 transform ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
            <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-2">
              <div className="absolute inset-0 bg-primary-fixed/10 animate-pulse"></div>
              <img src={profileImg} alt="Chippe Likith Kumar, founder and developer of BROJIX" loading="eager" className="w-full h-auto rounded-2xl object-cover relative z-10" />
            </div>
          </div>
        </section>

        {/* --- 2. INFORMATION CARDS --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`glass-panel p-8 rounded-3xl border border-white/5 hover:border-primary-fixed/30 transition-all duration-500 transform ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`} style={{ transitionDelay: '300ms' }}>
            <GraduationCap className="w-8 h-8 text-primary-fixed mb-6" />
            <h3 className="font-headline-md text-xl text-white mb-2">Education</h3>
            <p className="text-on-surface-variant font-medium">B.Tech CSE</p>
            <p className="text-sm text-gray-500 mt-1">MITS Deemed to be University</p>
            <p className="text-xs text-primary-fixed mt-4 uppercase tracking-widest font-label-caps">Class of 2028</p>
          </div>
          
          <div className={`glass-panel p-8 rounded-3xl border border-white/5 hover:border-primary-fixed/30 transition-all duration-500 transform ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`} style={{ transitionDelay: '400ms' }}>
            <Target className="w-8 h-8 text-primary-fixed mb-6" />
            <h3 className="font-headline-md text-xl text-white mb-4">Primary Focus</h3>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li>Artificial Intelligence</li>
              <li>Full Stack Development</li>
              <li>Cybersecurity</li>
              <li>Cloud Computing</li>
            </ul>
          </div>

          <div className={`glass-panel p-8 rounded-3xl border border-white/5 hover:border-primary-fixed/30 transition-all duration-500 transform ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`} style={{ transitionDelay: '500ms' }}>
            <Rocket className="w-8 h-8 text-primary-fixed mb-6" />
            <h3 className="font-headline-md text-xl text-white mb-4">Currently Building</h3>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li className="text-white font-bold">BROJIX</li>
              <li>Premium Project Marketplace</li>
              <li>AI Resume Builder</li>
              <li>Developer Portfolio Platform</li>
            </ul>
          </div>

          <div className={`glass-panel p-8 rounded-3xl border border-white/5 hover:border-primary-fixed/30 transition-all duration-500 transform bg-primary-fixed/5 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`} style={{ transitionDelay: '600ms' }}>
            <Crosshair className="w-8 h-8 text-primary-fixed mb-6" />
            <h3 className="font-headline-md text-xl text-white mb-4">Mission</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              To build digital products that simplify complex problems and help students and businesses leverage technology more effectively.
            </p>
          </div>
        </section>

        {/* --- 3. METHODOLOGY --- */}
        <section ref={approachRef} className="max-w-4xl mx-auto mb-20 text-center">
          <span className={`inline-block text-[11px] tracking-[0.18em] text-primary-fixed mb-4 font-medium uppercase transition-all duration-700 delay-100 transform ${
            approachVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            METHODOLOGY
          </span>
          <h2 className={`text-[clamp(32px,4vw,42px)] font-bold text-white mb-10 tracking-tight transition-all duration-700 delay-200 transform ${
            approachVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            My Approach
          </h2>
          <div className={`glass-panel p-8 md:p-10 rounded-3xl border border-white/5 transition-all duration-700 delay-300 transform ${
            approachVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-6">
              {['Understand', 'Research', 'Design', 'Develop', 'Test', 'Deploy', 'Scale'].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high border border-white/10 flex items-center justify-center text-xs font-bold text-primary-fixed">
                    {i + 1}
                  </div>
                  <div className="text-white font-medium text-base md:text-lg">{step}</div>
                  {i < 6 && <div className="hidden md:block w-8 h-[1px] bg-white/10 ml-4"></div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- 4. TECHNOLOGIES & WHAT I BUILD --- */}
        <section ref={arsenalRef}>
          <div className="text-center mb-16">
            <span className={`inline-block text-[11px] tracking-[0.18em] text-primary-fixed mb-4 font-medium uppercase transition-all duration-700 delay-100 transform ${
              arsenalVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              THE ARSENAL
            </span>
            <h2 className={`text-[clamp(32px,5vw,52px)] font-bold text-white mb-4 tracking-tight transition-all duration-700 delay-200 transform ${
              arsenalVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Technologies &amp; Scope
            </h2>
          </div>

          <div className={`mb-16 transition-all duration-700 delay-300 transform ${
            arsenalVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}>
            <h3 className="font-headline-md text-2xl text-white mb-6 text-center">What I Build</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {builds.map((build, i) => (
                <span key={i} className="px-5 py-3 glass-panel border border-white/10 rounded-xl text-on-surface-variant font-medium hover:border-primary-fixed/50 hover:text-primary-fixed transition-colors cursor-default">
                  {build}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map((tech, i) => (
              <div 
                key={i} 
                style={{ transitionDelay: `${400 + i * 100}ms` }}
                className={`glass-panel p-8 rounded-3xl border border-white/5 hover:border-primary-fixed/20 transition-all duration-500 transform ${
                  arsenalVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                  <div className="p-3 bg-surface-container rounded-xl border border-white/5">
                    {tech.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white">{tech.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tech.items.map((item, j) => (
                    <span key={j} className="text-sm px-3 py-1 bg-white/5 rounded-md text-on-surface-variant border border-white/5">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- 5. CORE VALUES --- */}
        <section ref={valuesRef} className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className={`text-[clamp(32px,5vw,52px)] font-bold text-white tracking-tight transition-all duration-700 delay-100 transform ${
              valuesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Core Values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, i) => (
              <div 
                key={i} 
                style={{ transitionDelay: `${200 + i * 100}ms` }}
                className={`glass-panel p-8 rounded-3xl border border-white/5 text-center hover:border-primary-fixed/20 transition-all duration-500 transform ${
                  valuesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="text-primary-fixed mb-6 flex justify-center">
                  <div className="p-4 bg-surface-container rounded-2xl border border-white/5">
                    {value.icon}
                  </div>
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{value.title}</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- 6. ACHIEVEMENTS & PHILOSOPHY --- */}
        <section ref={philRef} className="glass-panel rounded-3xl border border-primary-fixed/20 p-6 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-fixed/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-[100px]"></div>
          
          <div className={`relative z-10 max-w-4xl mx-auto transition-all duration-700 transform ${
            philVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-[clamp(32px,5vw,52px)] font-bold text-white mb-10 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              What Makes Me Different
            </h2>
            <div className="space-y-6 text-lg md:text-xl text-on-surface-variant font-medium leading-relaxed mb-16">
              <p>I don't believe in building projects simply to fill a resume.</p>
              <p>I believe in creating software that solves genuine problems, delivers real value, and provides meaningful user experiences.</p>
              <p>Every product I build is an opportunity to learn something new, improve my engineering skills, and move one step closer to becoming a successful software entrepreneur.</p>
            </div>
            
            <div className="bg-surface-container-lowest/50 border border-white/10 p-6 md:p-10 rounded-2xl">
              <span className="inline-block text-[11px] tracking-[0.18em] text-primary-fixed mb-6 font-medium uppercase">
                PERSONAL PHILOSOPHY
              </span>
              <p className="text-xl md:text-3xl text-white font-bold italic leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                "I don't just build projects to complete a portfolio. I build products to solve problems, learn continuously, and create technology that people genuinely find useful."
              </p>
            </div>
          </div>
        </section>

        {/* --- 7. FINAL CTA --- */}
        <section ref={ctaRef} className={`text-center pb-12 transition-all duration-750 transform ${
          ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Let's Build Something<br/>Amazing Together
          </h2>
          <p className="text-base md:text-lg text-on-surface-variant max-w-3xl mx-auto mb-10 leading-relaxed">
            Whether it's an AI application, full-stack platform, cybersecurity solution, or a custom software product, I'm always excited to work on challenging ideas that create real impact.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/#portfolio" className="bg-primary-fixed text-on-primary-fixed px-10 py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(210,240,0,0.4)] transition-all duration-300 active:scale-95 text-center">
              View Products
            </Link>
            <Link to="/#contact" className="bg-surface-container-high border-2 border-white/10 text-white px-10 py-4 rounded-xl font-bold text-lg hover:border-primary-fixed/50 hover:bg-white/5 transition-all duration-300 active:scale-95 text-center">
              Hire Me
            </Link>
            <a href="https://linkedin.com/in/likith-kumar-chippe" target="_blank" rel="noreferrer" className="bg-surface-container-high border-2 border-white/10 text-white px-10 py-4 rounded-xl font-bold text-lg hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10 transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 text-center">
              Let's Connect <ArrowUpRight className="w-5 h-5" />
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
