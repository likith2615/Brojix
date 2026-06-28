import React, { useEffect, useRef } from "react";

export default function HeroBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animFrame;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Neon yellow-green particles — 3 flavors
    const colors = [
      "217,255,0",   // pure lemon neon yellow
      "180,255,10",  // lime yellow
      "255,240,0",   // warm neon yellow
    ];

    const count = window.innerWidth < 768 ? 45 : 100;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.4,
        dx: (Math.random() - 0.5) * 0.35,
        dy: (Math.random() - 0.5) * 0.35,
        opacity: Math.random() * 0.5 + 0.15,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let tick = 0;

    const draw = () => {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ── Deep dark background (near-black, slight green tint) ──
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0,   "#060a03");
      grad.addColorStop(0.5, "#080c04");
      grad.addColorStop(1,   "#040804");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ── Large central neon yellow glow ──
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const glowR = 400 + Math.sin(tick * 0.012) * 70;
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
      glow.addColorStop(0,    "rgba(200,255,0, 0.09)");
      glow.addColorStop(0.4,  "rgba(160,220,0, 0.05)");
      glow.addColorStop(1,    "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ── Floating secondary glow (drifts slowly) ──
      const ox = cx + Math.sin(tick * 0.008) * 200;
      const oy = cy + Math.cos(tick * 0.010) * 130;
      const glow2 = ctx.createRadialGradient(ox, oy, 0, ox, oy, 250);
      glow2.addColorStop(0,   "rgba(217,255,0, 0.07)");
      glow2.addColorStop(0.5, "rgba(180,240,0, 0.03)");
      glow2.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.fillStyle = glow2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ── Third glow bottom-left corner ──
      const glow3 = ctx.createRadialGradient(0, canvas.height, 0, 0, canvas.height, 300);
      glow3.addColorStop(0,   "rgba(180,255,0, 0.06)");
      glow3.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.fillStyle = glow3;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ── Particles ──
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const pulse = Math.sin(tick * 0.025 + p.x * 0.01) * 0.3 + 0.7;

        // Glow around each particle
        const pGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
        pGlow.addColorStop(0,   `rgba(${p.color}, ${p.opacity * pulse * 0.4})`);
        pGlow.addColorStop(1,   "rgba(0,0,0,0)");
        ctx.fillStyle = pGlow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
        ctx.fill();

        // Bright core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity * pulse})`;
        ctx.fill();
      });

      // ── Connecting lines (neon yellow) ──
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(200,255,0,${0.15 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -50,
        display: "block",
        pointerEvents: "none",
      }}
    />
  );
}
