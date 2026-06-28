import React, { useEffect, useRef } from "react";

export default function GlobalBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animFrame;

    // Particles array
    let particles = [];
    
    // Blobs array
    let blobs = [
      { type: 'center', x: 0, y: 0, r: 0, phase: 0 },
      { type: 'drifter', x: 0, y: 0, r: 0, dx: 0.5, dy: 0.3 },
      { type: 'bottomLeft', x: 0, y: 0, r: 0 }
    ];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Reset blobs
      blobs[0].x = canvas.width / 2;
      blobs[0].y = canvas.height / 2;
      blobs[0].r = Math.min(canvas.width, canvas.height) * 0.4;
      
      blobs[1].x = canvas.width * 0.8;
      blobs[1].y = canvas.height * 0.2;
      blobs[1].r = Math.min(canvas.width, canvas.height) * 0.35;
      
      blobs[2].x = canvas.width * 0.1;
      blobs[2].y = canvas.height * 0.9;
      blobs[2].r = Math.min(canvas.width, canvas.height) * 0.25;
    };
    
    resize();
    window.addEventListener("resize", resize);

    // 3 color variants for particles
    const colors = [
      "217, 255, 0",   // pure lemon
      "180, 255, 10",  // lime-yellow
      "255, 240, 0",   // warm yellow
    ];

    const count = window.innerWidth < 768 ? 30 : 60;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        glowRadius: Math.random() * 10 + 5,
        phase: Math.random() * Math.PI * 2
      });
    }

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Blobs
      blobs[0].phase += 0.01;
      const pulseR = blobs[0].r + Math.sin(blobs[0].phase) * 50;
      
      // Drifter
      blobs[1].x += blobs[1].dx;
      blobs[1].y += blobs[1].dy;
      if (blobs[1].x < 0 || blobs[1].x > canvas.width) blobs[1].dx *= -1;
      if (blobs[1].y < 0 || blobs[1].y > canvas.height) blobs[1].dy *= -1;

      // Render Blobs
      blobs.forEach((blob, i) => {
        const r = i === 0 ? pulseR : blob.r;
        const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, r);
        grad.addColorStop(0, "rgba(217, 255, 0, 0.08)");
        grad.addColorStop(0.5, "rgba(200, 255, 0, 0.03)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Particles
      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        p.phase += 0.02;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Halo
        const haloGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.glowRadius);
        const alpha = Math.abs(Math.sin(p.phase)) * 0.5 + 0.3; // Twinkle effect
        haloGrad.addColorStop(0, `rgba(${p.color}, ${alpha})`);
        haloGrad.addColorStop(1, `rgba(${p.color}, 0)`);
        
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `rgba(255, 255, 255, 0.9)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrame);
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
        pointerEvents: "none"
      }}
    />
  );
}
