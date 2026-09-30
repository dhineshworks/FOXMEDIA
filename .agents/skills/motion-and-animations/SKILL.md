---
name: motion-and-animations
description: Animation orchestration, CSS keyframes, spring physics transitions, entrance reveals, micro-interactions, and accessible motion controls.
---

# UI Motion & Animations Skill

## When to Use
- Adding motion, smooth entrance reveals, and interactive feedback to UI elements.
- Designing loading spinners, pulse badges, skeleton screens, and countdown timers.
- Preventing layout shifts and optimizing animation frame rates.

## Core Rules
1. **Purposeful Motion:**
   - Every animation should serve a functional purpose: guiding attention, signaling state changes, or confirming user actions.
2. **Spring Physics & Easing:**
   - Use natural easing curves rather than linear transitions (`cubic-bezier(0.16, 1, 0.3, 1)` or `ease-out`).
3. **Micro-Interactions:**
   - Button presses should have active scale downs (`active:scale-[0.98]`).
   - Cards should lift smoothly on hover (`hover:translate-y-[-2px] hover:shadow-2xl`).
4. **Accessibility:**
   - Respect user system settings by wrapping heavy animations in `@media (prefers-reduced-motion: no-preference)`.
