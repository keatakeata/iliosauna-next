'use client';

import { useEffect } from 'react';

export default function ScrollAnimations() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    // H2 Animation Observer
    const h2Observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, observerOptions);

    // Reveal on scroll Observer
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    // Observe all h2 elements with animation class
    const h2Elements = document.querySelectorAll('.h2-animate');
    h2Elements.forEach((el) => h2Observer.observe(el));

    // Observe all elements with reveal-on-scroll class
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach((el) => revealObserver.observe(el));

    // Cleanup
    return () => {
      h2Elements.forEach((el) => h2Observer.unobserve(el));
      revealElements.forEach((el) => revealObserver.unobserve(el));
    };
  }, []);

  return <></>;
}