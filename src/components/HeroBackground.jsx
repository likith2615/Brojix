import React from "react";

export default function HeroBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[-50] bg-[#080c04]"
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 30%, rgba(210, 240, 0, 0.05) 0%, transparent 60%),
          radial-gradient(circle at 15% 80%, rgba(180, 255, 10, 0.04) 0%, transparent 50%),
          radial-gradient(circle at 85% 80%, rgba(220, 184, 255, 0.03) 0%, transparent 50%)
        `,
      }}
    />
  );
}
