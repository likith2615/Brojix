import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full mt-auto border-t border-white/10 relative z-10 pt-32 pb-16">
      <div className="px-container-padding-mobile md:px-container-padding-desktop max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-24">
          <div className="flex flex-col items-start max-w-sm">
            <div className="font-headline-lg text-4xl sm:text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 flex items-center">BRO<span className="text-primary-fixed drop-shadow-[0_0_10px_rgba(217,255,0,0.3)]">JIX</span></div>
            <p className="text-on-surface-variant text-lg leading-relaxed">
              Premium software solutions, dynamic web experiences, and industry-ready internship reports delivered with precision.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-16 md:gap-32">
            <div className="flex flex-col gap-6">
              <span className="font-label-caps text-label-caps text-secondary text-sm tracking-[0.2em] mb-2 uppercase">Connect</span>
              
              <a href="https://wa.me/918179072511" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 hover:translate-x-2 transition-transform duration-300">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary-fixed group-hover:bg-primary-fixed/10 transition-colors">
                  <span className="material-symbols-outlined text-white group-hover:text-primary-fixed text-lg">chat</span>
                </div>
                <div>
                  <div className="text-[10px] text-on-surface-variant font-label-caps uppercase tracking-wider">WhatsApp</div>
                  <div className="text-white font-medium group-hover:text-primary-fixed transition-colors">+91 8179072511</div>
                </div>
              </a>

              <a href="mailto:chippelikith@gmail.com" className="group flex items-center gap-3 hover:translate-x-2 transition-transform duration-300">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary-fixed group-hover:bg-primary-fixed/10 transition-colors">
                  <span className="material-symbols-outlined text-white group-hover:text-primary-fixed text-lg">mail</span>
                </div>
                <div>
                  <div className="text-[10px] text-on-surface-variant font-label-caps uppercase tracking-wider">Email</div>
                  <div className="text-white font-medium group-hover:text-primary-fixed transition-colors">chippelikith@gmail.com</div>
                </div>
              </a>

              <a href="https://in.linkedin.com/in/likith-kumar-chippe" rel="me" target="_blank" className="group flex items-center gap-3 hover:translate-x-2 transition-transform duration-300">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary-fixed group-hover:bg-primary-fixed/10 transition-colors">
                  <span className="material-symbols-outlined text-white group-hover:text-primary-fixed text-lg">public</span>
                </div>
                <div>
                  <div className="text-[10px] text-on-surface-variant font-label-caps uppercase tracking-wider">Network</div>
                  <div className="text-white font-medium group-hover:text-primary-fixed transition-colors">LinkedIn Profile</div>
                </div>
              </a>
            </div>

            <div className="flex flex-col gap-6">
              <span className="font-label-caps text-label-caps text-secondary text-sm tracking-[0.2em] mb-2 uppercase">Navigation</span>
              <a href="#home" className="text-on-surface-variant hover:text-white text-lg transition-colors flex items-center gap-2 group">
                <span className="w-0 h-px bg-primary-fixed group-hover:w-4 transition-all duration-300"></span>
                Home
              </a>
              <a href="#services" className="text-on-surface-variant hover:text-white text-lg transition-colors flex items-center gap-2 group">
                <span className="w-0 h-px bg-primary-fixed group-hover:w-4 transition-all duration-300"></span>
                Services
              </a>
              <a href="#portfolio" className="text-on-surface-variant hover:text-white text-lg transition-colors flex items-center gap-2 group">
                <span className="w-0 h-px bg-primary-fixed group-hover:w-4 transition-all duration-300"></span>
                Products
              </a>
              <a href="#contact" className="text-on-surface-variant hover:text-white text-lg transition-colors flex items-center gap-2 group">
                <span className="w-0 h-px bg-primary-fixed group-hover:w-4 transition-all duration-300"></span>
                Start Project
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 gap-4">
          <div className="font-label-caps text-label-caps text-outline text-xs text-center md:text-left tracking-widest flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} BROJIX. ALL RIGHTS RESERVED.</span>
            <a href="/admin" className="text-white/10 hover:text-primary-fixed hover:drop-shadow-[0_0_8px_rgba(210,240,0,0.5)] transition-all duration-300" title="Admin Gateway">
              <span className="material-symbols-outlined text-xs">lock</span>
            </a>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-primary-fixed font-label-caps tracking-widest bg-primary-fixed/10 px-4 py-2 rounded-full border border-primary-fixed/20">
            <span className="w-2 h-2 rounded-full bg-primary-fixed animate-pulse"></span>
            SYSTEMS ONLINE
          </div>
        </div>
      </div>
    </footer>
  );
}
