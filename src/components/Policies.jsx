import { useState } from "react";

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

  const toggle = (id) => setOpen(open === id ? null : id);

  return (
    <section id="policies" style={styles.section} className="relative z-10 scroll-mt-24">
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.eyebrow}>BEFORE WE START</span>
        <h2 style={styles.title}>Policies &amp; Terms</h2>
        <p style={styles.subtitle}>
          Everything is transparent. Read this once — so there are no
          surprises on either side.
        </p>
      </div>

      {/* Policy list */}
      <div style={styles.list}>
        {policies.map((p) => {
          const isOpen = open === p.id;
          return (
            <div
              key={p.id}
              style={{
                ...styles.card,
                ...(isOpen ? styles.cardOpen : {}),
              }}
            >
              {/* Row header — always visible */}
              <button
                onClick={() => toggle(p.id)}
                style={styles.row}
                aria-expanded={isOpen}
              >
                <div style={styles.left}>
                  <span style={styles.idTag}>{p.id}</span>
                  <span style={styles.icon}>{p.icon}</span>
                  <div>
                    <div style={styles.policyTitle}>{p.title}</div>
                    <div style={styles.short}>{p.short}</div>
                  </div>
                </div>
                <span
                  style={{
                    ...styles.chevron,
                    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                  }}
                >
                  +
                </span>
              </button>

              {/* Expandable body */}
              {isOpen && (
                <div style={styles.body}>
                  <ul style={styles.ruleList}>
                    {p.rules.map((rule, i) => (
                      <li key={i} style={styles.ruleItem}>
                        <span style={styles.bullet}>—</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                  <div style={styles.noteBox}>
                    <span style={styles.noteLabel}>NOTE</span>
                    <span style={styles.noteText}>{p.note}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom trust strip */}
      <div style={styles.trustStrip}>
        {["Transparent pricing", "No hidden fees", "Direct WhatsApp support", "Confidential always"].map(
          (t, i) => (
            <div key={i} style={styles.trustItem}>
              <span style={styles.trustDot}>✦</span>
              {t}
            </div>
          )
        )}
      </div>
    </section>
  );
}

const NEON = "#d9ff00";
const NEON_DIM = "rgba(217,255,0,0.08)";
const NEON_BORDER = "rgba(217,255,0,0.18)";
const CARD_BG = "rgba(255,255,255,0.03)";
const CARD_BG_OPEN = "rgba(217,255,0,0.04)";
const TEXT = "#e8e8e8";
const MUTED = "#6b7060";
const BORDER = "rgba(255,255,255,0.07)";

const styles = {
  section: {
    padding: "100px 24px",
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "64px",
  },
  eyebrow: {
    display: "inline-block",
    fontSize: "11px",
    letterSpacing: "0.18em",
    color: NEON,
    marginBottom: "16px",
    fontWeight: 500,
  },
  title: {
    fontSize: "clamp(32px, 5vw, 52px)",
    fontWeight: 700,
    color: "#ffffff",
    margin: "0 0 16px",
    fontFamily: "'Space Grotesk', sans-serif",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "16px",
    color: MUTED,
    maxWidth: "480px",
    margin: "0 auto",
    lineHeight: 1.6,
  },
  list: {
    maxWidth: "780px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  card: {
    background: CARD_BG,
    border: `1px solid ${BORDER}`,
    borderRadius: "12px",
    overflow: "hidden",
    transition: "border-color 0.2s, background 0.2s",
  },
  cardOpen: {
    background: CARD_BG_OPEN,
    borderColor: NEON_BORDER,
  },
  row: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "22px 24px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    gap: "16px",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    textAlign: "left",
  },
  idTag: {
    fontSize: "11px",
    color: MUTED,
    fontFamily: "monospace",
    minWidth: "24px",
    letterSpacing: "0.05em",
  },
  icon: {
    fontSize: "18px",
    width: "36px",
    height: "36px",
    background: NEON_DIM,
    border: `1px solid ${NEON_BORDER}`,
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: NEON,
    flexShrink: 0,
  },
  policyTitle: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#ffffff",
    fontFamily: "'Space Grotesk', sans-serif",
    marginBottom: "2px",
  },
  short: {
    fontSize: "13px",
    color: MUTED,
  },
  chevron: {
    fontSize: "22px",
    color: NEON,
    fontWeight: 300,
    transition: "transform 0.25s ease",
    lineHeight: 1,
    flexShrink: 0,
  },
  body: {
    padding: "0 24px 24px 80px",
  },
  ruleList: {
    listStyle: "none",
    margin: "0 0 20px",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  ruleItem: {
    display: "flex",
    gap: "12px",
    fontSize: "14px",
    color: TEXT,
    lineHeight: 1.6,
  },
  bullet: {
    color: NEON,
    flexShrink: 0,
    marginTop: "1px",
    fontSize: "12px",
  },
  noteBox: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    background: NEON_DIM,
    border: `1px solid ${NEON_BORDER}`,
    borderRadius: "8px",
    padding: "12px 16px",
  },
  noteLabel: {
    fontSize: "10px",
    letterSpacing: "0.12em",
    color: NEON,
    fontWeight: 700,
    flexShrink: 0,
    marginTop: "2px",
  },
  noteText: {
    fontSize: "13px",
    color: "#b8b8a0",
    lineHeight: 1.5,
    fontStyle: "italic",
  },
  trustStrip: {
    maxWidth: "780px",
    margin: "56px auto 0",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "8px 32px",
    borderTop: `1px solid ${BORDER}`,
    paddingTop: "40px",
  },
  trustItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: MUTED,
  },
  trustDot: {
    color: NEON,
    fontSize: "10px",
  },
};
