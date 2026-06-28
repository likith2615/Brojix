import { useEffect, useRef } from 'react';
import { animate, onScroll, createScope } from 'animejs';

export function useAnimeOnScroll(selector, animProps, scrollOptions = {}) {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (isReducedMotion) {
      // Set the final state immediately if reduced motion is on
      const elements = typeof selector === 'string' ? document.querySelectorAll(selector) : selector;
      if (elements) {
        animate(selector, { ...animProps, duration: 0 });
      }
      return;
    }

    const scope = createScope({
      mediaQueries: {
        noMotion: '(prefers-reduced-motion: reduce)'
      }
    });

    scope.add(({ matches }) => {
      if (matches.noMotion) return;
      
      animate(selector, {
        ...animProps,
        autoplay: onScroll({
          enter: 'bottom 88%',
          ...scrollOptions,
        }),
      });
    });

    return () => scope.revert();
  }, []);
}
