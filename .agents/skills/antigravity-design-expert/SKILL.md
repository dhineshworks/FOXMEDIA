---
name: antigravity-design-expert
description: Core UI/UX engineering skill for building highly interactive, spatial, weightless, and glassmorphism-based web interfaces using 3D CSS transforms and smooth animations.
---

# Antigravity UI & Motion Design Expert

## When to Use
- Building highly interactive web interfaces with spatial depth, glassmorphism, and motion-heavy UI.
- Applying weightless card elevations, isometric perspective, and glowing gradient accents.
- Designing high-conversion landing pages, premium dashboards, or immersive product surfaces.

## Design Principles
1. **Weightlessness & Elevation:**
   - Elements should appear to float above their canvas using soft, diffuse multi-layered drop shadows:
     `box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 25px -5px rgba(249, 115, 22, 0.15)`.
2. **Spatial Depth & Glassmorphism:**
   - Use subtle translucent backgrounds with `backdrop-filter: blur(16px)` and semi-transparent border strokes (`border: 1px solid rgba(255, 255, 255, 0.08)`).
3. **Smooth Micro-Transitions:**
   - Never snap abruptly. Transition hover, active, and focus states with `transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1)`.
4. **GPU-Accelerated Performance:**
   - Animate `transform` and `opacity` properties with `will-change: transform`.
   - Respect `prefers-reduced-motion: reduce`.
