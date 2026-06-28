import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { animate, createScope, stagger, onScroll } from 'animejs';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  whatsapp: z.string().min(10, 'Valid WhatsApp number is required'),
  college: z.string().min(2, 'College/University is required'),
  service: z.string().min(1, 'Please select a service'),
  topic: z.string().min(5, 'Topic is required'),
  deadline: z.string().min(1, 'Deadline is required'),
  requirements: z.string().optional(),
});

const serviceOptions = [
  { value: 'software', label: 'Software Project', price: 500 },
  { value: 'report', label: 'Internship Report', price: 300 },
  { value: 'bundle', label: 'Project + Report Bundle', price: 700 },
  { value: 'custom', label: 'Custom Requirement', price: 0 },
];

export default function Contact() {
  const cardRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { service: '' }
  });

  const selectedService = watch('service');

  useEffect(() => {
    const scope = createScope({
      mediaQueries: { noMotion: '(prefers-reduced-motion: reduce)' }
    });

    scope.add(({ matches }) => {
      if (matches.noMotion) return;

      animate('.contact-header', {
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 600,
        ease: 'outExpo',
        autoplay: onScroll({ enter: 'bottom 100%' }),
      });

      animate('.contact-step', {
        opacity: [0, 1],
        translateY: [40, 0],
        delay: stagger(120),
        duration: 750,
        ease: 'outExpo',
        autoplay: onScroll({ enter: 'bottom 100%' }),
      });

      animate('.form-group', {
        opacity: [0, 1],
        translateY: [20, 0],
        delay: stagger(100),
        duration: 500,
        ease: 'outQuad',
        autoplay: onScroll({ enter: 'bottom 100%' }),
      });
    });

    return () => scope.revert();
  }, []);

  const onSubmit = async (data, type) => {
    const selected = serviceOptions.find(s => s.value === data.service);
    const serviceName = selected ? selected.label : data.service;

    if (type === 'whatsapp') {
      const message = `*New Order Request*%0A
*Name:* ${data.name}%0A
*College:* ${data.college}%0A
*Service:* ${serviceName}%0A
*Topic:* ${data.topic}%0A
*Deadline:* ${data.deadline}%0A
*Requirements:* ${data.requirements || 'None'}`;
      
      const whatsappNumber = '918179072511';
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
      toast.success('WhatsApp opened!');
      return;
    }

    if (type === 'linkedin') {
      window.open('https://linkedin.com/in/likith-kumar-chippe', '_blank');
      toast.success('LinkedIn profile opened!');
      return;
    }

    // 2. Submit via Email (Gmail)
    // 1. Insert into localStorage
    const dbPromise = (async () => {
      try {
        const existing = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
        const newSubmission = {
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          name: data.name,
          whatsapp: data.whatsapp,
          college: data.college,
          service: serviceName,
          topic: data.topic,
          deadline: data.deadline,
          requirements: data.requirements || '',
          status: 'Pending'
        };
        existing.unshift(newSubmission);
        localStorage.setItem('contact_submissions', JSON.stringify(existing));
      } catch (err) {
        console.error('LocalStorage Write Error:', err);
        throw new Error('Failed to save to local dashboard.');
      }
    })();

    // 2. Send email via Web3Forms
    const emailPromise = (async () => {
    // Web3Forms key — set VITE_WEB3FORMS_ACCESS_KEY in Netlify environment variables
      const web3formsKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '';
      if (!web3formsKey) {
        throw new Error('Email credentials missing: Please add VITE_WEB3FORMS_ACCESS_KEY to your .env file.');
      }

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: web3formsKey,
          subject: `New Request from ${data.name} (${serviceName})`,
          from_name: 'BROJIX Portfolio',
          name: data.name,
          whatsapp: data.whatsapp,
          college: data.college,
          service: serviceName,
          topic: data.topic,
          deadline: data.deadline,
          requirements: data.requirements || 'None'
        })
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Email dispatch failed.');
      }
    })();

    // Toast loader
    toast.promise(
      Promise.all([dbPromise, emailPromise]),
      {
        loading: 'Processing request and sending email...',
        success: () => 'Form submitted! Your entry is saved and you will receive an email confirmation.',
        error: (err) => err.message || 'Failed to process request.'
      }
    );
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = ((y - centerY) / centerY) * -3;
    const tiltY = ((x - centerX) / centerX) * 3;
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.01, 1.01, 1.01)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <section id="contact" className="py-32 px-container-padding-mobile md:px-container-padding-desktop relative z-10 scroll-mt-24">
      <div className="max-w-5xl mx-auto w-full">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-center gap-4 mb-10 overflow-x-auto whitespace-nowrap">
          <div className="flex items-center text-primary-fixed">
            <span className="material-symbols-outlined mr-2" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
            <span className="font-label-caps text-label-caps">01 DETAILS</span>
          </div>
          <div className="h-px w-8 bg-outline-variant"></div>
          <div className="flex items-center text-on-surface">
            <span className="material-symbols-outlined mr-2">shield</span>
            <span className="font-label-caps text-label-caps">02 SECURE SUBMIT</span>
          </div>
        </div>

        {/* Secure Checkout Glass Card */}
        <div 
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="liquid-glass p-6 md:p-12 rounded-xl neon-border-shimmer transition-transform duration-200 ease-out"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="contact-header font-headline-lg text-headline-lg mb-2 opacity-0">Secure Checkout</h1>
              <p className="contact-header text-on-surface-variant font-body-md opacity-0">Finalize your project request requirements.</p>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-1">
              <span className="bg-secondary-container/30 text-secondary px-3 py-1 rounded-full text-[10px] font-label-caps border border-secondary/20">TLS 1.3 ACTIVE</span>
              <span className="text-on-surface-variant text-[10px] font-label-caps">ID: PX-992-ALPHA</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <div className="contact-step opacity-0 bg-surface-container-lowest/80 border border-white/10 rounded-3xl p-5" style={{ transform: 'translateY(40px)' }}>
                <p className="text-xs font-label-caps text-secondary uppercase tracking-[0.35em] mb-3">Step 1</p>
                <h2 className="text-lg font-semibold text-white mb-2">Share the brief</h2>
                <p className="text-on-surface-variant">Mention your topic, deadline, and preferred tech stack or report style.</p>
              </div>
              <div className="contact-step opacity-0 bg-surface-container-lowest/80 border border-white/10 rounded-3xl p-5" style={{ transform: 'translateY(40px)' }}>
                <p className="text-xs font-label-caps text-secondary uppercase tracking-[0.35em] mb-3">Step 2</p>
                <h2 className="text-lg font-semibold text-white mb-2">Choose a package</h2>
                <p className="text-on-surface-variant">Pick software, internship report, or both together for a complete solution.</p>
              </div>
              <div className="contact-step opacity-0 bg-surface-container-lowest/80 border border-white/10 rounded-3xl p-5" style={{ transform: 'translateY(40px)' }}>
              <h2 className="text-lg font-semibold text-white mb-2">Submit & connect</h2>
              <p className="text-on-surface-variant">Send your form details over WhatsApp or Gmail for the next steps.</p>
            </div>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-8 relative">
            {/* Ambient subtle glow behind form */}
            <div className="absolute inset-0 bg-primary-fixed/5 rounded-3xl blur-3xl -z-10 pointer-events-none"></div>

            <div className="form-group opacity-0 bg-surface-container-lowest/40 p-8 rounded-3xl border border-white/5 shadow-lg backdrop-blur-md">
              <h3 className="font-display-sm text-2xl text-white mb-6 tracking-tight flex items-center gap-3">
                <span className="w-8 h-px bg-primary-fixed block"></span>
                01. Digital Identity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <input 
                    {...register('name')} 
                    className="w-full bg-surface-container-lowest border border-white/10 rounded-xl px-5 py-4 text-white placeholder-on-surface-variant focus:outline-none focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed transition-all duration-300" 
                    placeholder="Full Name" 
                    type="text"
                  />
                  {errors.name && <p className="text-error text-xs mt-2 ml-1">{errors.name.message}</p>}
                </div>
                
                <div className="relative">
                  <input 
                    {...register('whatsapp')} 
                    className="w-full bg-surface-container-lowest border border-white/10 rounded-xl px-5 py-4 text-white placeholder-on-surface-variant focus:outline-none focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed transition-all duration-300" 
                    placeholder="WhatsApp No. (e.g. +91 9876543210)" 
                    type="text"
                  />
                  {errors.whatsapp && <p className="text-error text-xs mt-2 ml-1">{errors.whatsapp.message}</p>}
                </div>
              </div>
            </div>

            <div className="form-group opacity-0 bg-surface-container-lowest/40 p-8 rounded-3xl border border-white/5 shadow-lg backdrop-blur-md relative z-10">
              <h3 className="font-display-sm text-2xl text-white mb-6 tracking-tight flex items-center gap-3">
                <span className="w-8 h-px bg-primary-fixed block"></span>
                02. Project Scope
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <input 
                    {...register('college')} 
                    className="w-full bg-surface-container-lowest border border-white/10 rounded-xl px-5 py-4 text-white placeholder-on-surface-variant focus:outline-none focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed transition-all duration-300" 
                    placeholder="University / College" 
                  />
                  {errors.college && <p className="text-error text-xs mt-2 ml-1">{errors.college.message}</p>}
                </div>
                
                <div className="relative">
                  <input 
                    {...register('deadline')} 
                    type="date"
                    className="w-full bg-surface-container-lowest border border-white/10 rounded-xl px-5 py-4 text-white placeholder-on-surface-variant focus:outline-none focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed transition-all duration-300" 
                  />
                  {errors.deadline && <p className="text-error text-xs mt-2 ml-1">{errors.deadline.message}</p>}
                </div>
                
                <div className="relative md:col-span-2">
                  <input type="hidden" {...register('service')} />
                  
                  <div className="relative w-full">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full bg-surface-container-lowest border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed transition-all duration-300 flex justify-between items-center"
                    >
                      <span className={selectedService ? "text-white" : "text-on-surface-variant"}>
                        {selectedService ? serviceOptions.find(o => o.value === selectedService)?.label : "Select a Service Tier..."}
                      </span>
                      <span className={`material-symbols-outlined text-white/50 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                        expand_more
                      </span>
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute z-[200] mt-2 w-full bg-surface-container-lowest border border-white/10 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.7)] overflow-hidden backdrop-blur-xl">
                        {serviceOptions.map((opt) => (
                          <div 
                            key={opt.value}
                            className="px-5 py-4 cursor-pointer hover:bg-primary-fixed/20 hover:text-primary-fixed text-white transition-colors duration-200 border-b border-white/5 last:border-b-0"
                            onClick={() => {
                              setValue('service', opt.value, { shouldValidate: true });
                              setIsDropdownOpen(false);
                            }}
                          >
                            {opt.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.service && <p className="text-error text-xs mt-2 ml-1">{errors.service.message}</p>}
                </div>
              </div>
            </div>

            <div className="form-group opacity-0 bg-surface-container-lowest/40 p-8 rounded-3xl border border-white/5 shadow-lg backdrop-blur-md">
              <h3 className="font-display-sm text-2xl text-white mb-6 tracking-tight flex items-center gap-3">
                <span className="w-8 h-px bg-primary-fixed block"></span>
                03. Requirements Payload
              </h3>
              <div className="flex flex-col gap-6">
                <div className="relative">
                  <input 
                    {...register('topic')} 
                    className="w-full bg-surface-container-lowest border border-white/10 rounded-xl px-5 py-4 text-white placeholder-on-surface-variant focus:outline-none focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed transition-all duration-300" 
                    placeholder="Project Topic (e.g. Hospital Management System)" 
                  />
                  {errors.topic && <p className="text-error text-xs mt-2 ml-1">{errors.topic.message}</p>}
                </div>
                <div className="relative">
                  <textarea 
                    {...register('requirements')} 
                    rows="4"
                    className="w-full bg-surface-container-lowest border border-white/10 rounded-xl px-5 py-4 text-white placeholder-on-surface-variant focus:outline-none focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed transition-all duration-300 resize-none" 
                    placeholder="Any specific instructions, tech stack preferences, or core features..." 
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="form-group opacity-0 pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                type="button" 
                onClick={() => {
                  handleSubmit((data) => onSubmit(data, 'linkedin'))();
                }}
                disabled={isSubmitting}
                className="w-full bg-surface-container-lowest border border-white/10 hover:border-[#0A66C2]/30 text-white text-base px-6 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 group"
              >
                <span>LINKEDIN CONNECT</span>
                <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-y-[-2px]">share</span>
              </button>
              <button 
                type="button" 
                onClick={() => {
                  handleSubmit((data) => onSubmit(data, 'whatsapp'))();
                }}
                disabled={isSubmitting}
                className="w-full bg-surface-container-lowest border border-white/10 hover:border-primary-fixed/30 text-white text-base px-6 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 group"
              >
                <span>WHATSAPP DIRECT</span>
                <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-1">send</span>
              </button>
              <button 
                type="button"
                onClick={() => {
                  handleSubmit((data) => onSubmit(data, 'email'))();
                }}
                disabled={isSubmitting}
                className="w-full bg-primary-fixed text-on-primary-fixed text-base px-6 py-4 rounded-xl font-bold hover:shadow-[0_0_30px_rgba(210,240,0,0.4)] transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 group"
              >
                <span>{isSubmitting ? 'SENDING EMAIL...' : 'SUBMIT via GMAIL'}</span>
                <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-1">mail</span>
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </section>
  );
}
