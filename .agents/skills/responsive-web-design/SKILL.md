---
name: responsive-web-design
description: Mobile-first responsive web design patterns, adaptive navigation, touch ergonomics, fluid scaling, and cross-device testing.
---

# Responsive Web Design Skill

## When to Use
- Building responsive layouts that look exceptional across mobile phones, tablets, laptops, and ultra-wide screens.
- Implementing mobile navigation drawers, bottom sheets, and responsive tables.
- Optimizing tap target sizes and touch gestures for mobile users.

## Best Practices
1. **Touch Ergonomics:**
   - Interactive elements must maintain a minimum touch target size of 44x44px (`min-h-[44px]`).
2. **Adaptive Navigation:**
   - Clean sticky header with hamburger drawer for mobile viewports, full horizontal navigation bar on `md` and above.
3. **Responsive Data Display:**
   - Tables on small screens should support horizontal scroll with overflow indicators (`overflow-x-auto`) or transform into stacked card views.
4. **Fluid Typography & Spacing:**
   - Scale padding and typography across breakpoints (e.g. `text-2xl sm:text-3xl md:text-5xl`).
