'use client';

import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );

    const init = () => {
      const elements = document.querySelectorAll('.reveal, .reveal-scale, .reveal-clip');
      elements.forEach((el) => {
        if (prefersReduced) {
          el.classList.add('visible');
        } else {
          observer.observe(el);
        }
      });
    };

    // Run on initial load and on route changes
    init();
    const mo = new MutationObserver(() => {
      requestAnimationFrame(init);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
