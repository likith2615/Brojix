import React, { useState } from "react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

const policies = [
  {
    id: "01",
    title: "Payment",
    icon: "₹",
    short: "50% before. 50% after delivery.",
    rules: [
      "You pay 50% upfront before work begins — this confirms your order and locks your slot.",
      "The remaining 50% is due once the final work is delivered and you've reviewed it.",
      "Accepted methods: UPI, Google Pay, PhonePe, Paytm, or cash.",
      "No work starts without advance payment. Verbal agreements are not binding.",
      "For express orders (under 24 hours), 100% payment is required upfront.",
    ],
    note: "Payment confirms your order. Your slot is only reserved once advance is received.",
  },
  {
    id: "02",
    title: "Revisions",
    icon: "↺",
    short: "1 free round. Within 3 days.",
    rules: [
      "Every order includes 1 free revision round — no questions asked.",
      "Revision must be requested within 3 days of delivery. After that, the order is considered accepted.",
      "A revision means fixing what was already agreed upon — not adding new features or topics.",
      "Additional revision rounds beyond the first are charged at ₹100 per round.",
      "If the original requirements were unclear and the fault is mine, I'll revise at no charge.",
    ],
    note: "Revision = fixing what was agreed. New requirements = new order.",
  },
  {
    id: "03",
    title: "Delivery",
    icon: "⚡",
    short: "3–5 days standard. 24hrs express available.",
    rules: [
      "Standard delivery: 3–5 working days from the date payment is confirmed.",
      "Express delivery (24–48 hours) is available at an additional charge — ask before ordering.",
      "Work is delivered via WhatsApp or email as agreed during discussion.",
      "If you delay sending required information (topic, guidelines, etc.), the deadline shifts accordingly.",
      "I'll keep you updated throughout — no ghosting, no surprises.",
    ],
    note: "Delays caused by missing info from your side push the deadline forward, not mine.",
  },
  {
    id: "04",
    title: "Refunds",
    icon: "⚠",
    short: "Refund only if work hasn't started.",
    rules: [
      "Full refund is available only if you cancel before work has started.",
      "Once work is in progress, a partial refund may be considered based on completion percentage.",
      "No refund is issued after the final work is delivered and approved by you.",
      "If I fail to deliver within the agreed timeline with no valid reason, a full refund is guaranteed.",
      "Refunds are processed within 24–48 hours via the same payment method used.",
    ],
    note: "Once delivered and approved — the order is closed. Plan your requirements carefully.",
  },
  {
    id: "05",
    title: "Privacy",
    icon: "🔒",
    short: "Your details never leave this conversation.",
    rules: [
      "Your name, college, phone number, and project details are kept strictly confidential.",
      "I never share, sell, or discuss your work with any third party — ever.",
      "Your project will never be reused, resold, or shown to another client without written permission.",
      "All communication between us stays private — no screenshots shared, no references made publicly.",
      "You may request deletion of your details at any time after order completion.",
    ],
    note: "What you share with me stays with me. Always.",
  },
  {
    id: "06",
    title: "Originality",
    icon: "✦",
    short: "Everything is built from scratch. Every time.",
    rules: [
      "All code is written fresh for your specific project — never copied from another client's work.",
      "All reports are written from scratch — not spun, not paraphrased from templates.",
      "No AI-generated bulk content is submitted as your final report without human review and editing.",
      "Plagiarism check (Turnitin or similar) can be provided on request for an additional fee.",
      "If originality is ever in question, I'll provide proof of my work process.",
    ],
    note: "Your project is yours alone. Built for you, not recycled from someone else.",
  },
];

export default function Policies() {
  const [open, setOpen] = useState(null);
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.05 });

  const toggle = (id) => setOpen(open === id ? null : id);

  return (
    <section ref={sectionRef} id="policies" className="py-24 px-container-padding-mobile md:px-container-padding-desktop relative z-10 scroll-mt-24">
      {/* Header */}
      <div className="text-center mb-16">
        <span className={`inline-block text-[11px] tracking-[0.18em] text-primary-fixed mb-4 font-medium uppercase transition-all duration-700 delay-100 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>BEFORE WE START</span>
        <h2 className={`text-[clamp(32px,5vw,52px)] font-bold text-white mb-4 tracking-tight transition-all duration-700 delay-200 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Policies &amp; Terms</h2>
        <p className={`text-base text-on-surface-variant max-w-[480px] mx-auto leading-relaxed transition-all duration-700 delay-300 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          Everything is transparent. Read this once — so there are no
          surprises on either side.
        </p>
      </div>

      {/* Policy list */}
      <div className={`max-w-[780px] mx-auto flex flex-col gap-3 transition-all duration-700 delay-400 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}>
        {policies.map((p) => {
          const isOpen = open === p.id;
          return (
            <div
              key={p.id}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                isOpen 
                  ? 'bg-primary-fixed/[0.04] border-primary-fixed/20' 
                  : 'bg-white/[0.03] border-white/10 hover:border-white/20'
              }`}
            >
              {/* Row header — always visible */}
              <button
                onClick={() => toggle(p.id)}
                className="w-full flex items-center justify-between p-5 md:p-6 bg-transparent cursor-pointer text-left gap-4"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-4 text-left">
                  <span className="text-[11px] text-on-surface-variant/50 font-mono min-w-[24px] tracking-wide">{p.id}</span>
                  <span className="text-lg w-9 h-9 bg-primary-fixed/10 border border-primary-fixed/20 rounded-lg flex items-center justify-center text-primary-fixed flex-shrink-0">{p.icon}</span>
                  <div>
                    <div className="text-base font-bold text-white mb-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{p.title}</div>
                    <div className="text-xs text-on-surface-variant">{p.short}</div>
                  </div>
                </div>
                <span
                  className={`text-xl text-primary-fixed font-light transition-transform duration-300 ${
                    isOpen ? 'rotate-45' : 'rotate-0'
                  }`}
                >
                  +
                </span>
              </button>

              {/* Expandable body */}
              {isOpen && (
                <div className="p-5 pt-0 pl-6 md:pl-20 pr-5 md:pr-6">
                  <ul className="list-none m-0 mb-5 p-0 flex flex-col gap-3">
                    {p.rules.map((rule, i) => (
                      <li key={i} className="flex gap-3 text-sm text-on-surface-variant leading-relaxed">
                        <span className="text-primary-fixed flex-shrink-0 mt-0.5 text-xs font-bold">—</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-3 items-start bg-primary-fixed/5 border border-primary-fixed/10 rounded-lg p-4">
                    <span className="text-[10px] tracking-widest text-primary-fixed font-bold flex-shrink-0 mt-0.5">NOTE</span>
                    <span className="text-xs text-on-surface-variant/80 italic leading-relaxed">{p.note}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom trust strip */}
      <div className={`max-w-[780px] mx-auto mt-14 flex flex-wrap justify-center gap-x-8 gap-y-3 border-t border-white/10 pt-10 transition-all duration-700 delay-500 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        {["Transparent pricing", "No hidden fees", "Direct WhatsApp support", "Confidential always"].map(
          (t, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-on-surface-variant">
              <span className="text-primary-fixed text-[10px]">✦</span>
              {t}
            </div>
          )
        )}
      </div>
    </section>
  );
}
