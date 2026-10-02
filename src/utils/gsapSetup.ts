// src/utils/gsapSetup.ts
// Centralized GSAP + ScrollTrigger registration.
// Import this file once (e.g., from page.tsx) instead of calling
// gsap.registerPlugin(ScrollTrigger) in every component file.

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);

export { gsap, ScrollTrigger, SplitText };
