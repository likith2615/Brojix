import React, { useEffect, useRef } from 'react';
import { animate, createSpring, createScope } from 'animejs';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  const fabRef = useRef(null);

  useEffect(() => {
    if (!fabRef.current) return;

    const scope = createScope({
      mediaQueries: { noMotion: '(prefers-reduced-motion: reduce)' }
    });

    scope.add(({ matches }) => {
      if (matches.noMotion) return;

      // Spring bounce-in on load
      animate(fabRef.current, {
        scale: [0, 1],
        translateY: [20, 0],
        ease: createSpring({ stiffness: 200, damping: 12 }),
        delay: 1500,
      });

      // Pulse ring animation loop on the pseudo-element / border
      animate(fabRef.current, {
        boxShadow: [
          '0 0 0px 0px rgba(16, 185, 129, 0)',
          '0 0 20px 8px rgba(16, 185, 129, 0.4)',
          '0 0 0px 0px rgba(16, 185, 129, 0)',
        ],
        duration: 2000,
        loop: true,
        ease: 'inOutSine',
      });
    });

    return () => scope.revert();
  }, []);

  const whatsappNumber = '918179072511';

  return (
    <a
      ref={fabRef}
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-fab fixed bottom-6 right-6 z-50 bg-success text-white p-4 rounded-full shadow-xl hover:bg-success/90 transition-colors transform scale-0"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle className="w-8 h-8" />
    </a>
  );
}
