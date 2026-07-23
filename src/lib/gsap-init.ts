'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Default ease
gsap.defaults({ ease: 'power3.out', duration: 0.85 });

export { gsap, ScrollTrigger };
