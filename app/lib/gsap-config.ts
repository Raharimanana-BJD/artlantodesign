"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// The one place ScrollTrigger (and the useGSAP plugin) gets registered.
// Every other file imports gsap from here, never from "gsap" directly,
// so registration only ever runs once (module caching does the rest).
gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };
