---
name: tailwind-css-mastery
description: Advanced Tailwind CSS v4 patterns, component utilities, responsive layout orchestration, gradient styling, and custom theme tokens.
---

# Tailwind CSS Mastery Skill

## When to Use
- Implementing production UI components with Tailwind CSS.
- Crafting responsive flexbox and CSS grid layouts with mobile-first breakpoints.
- Creating sophisticated gradient masks, backdrop filters, and subtle ambient glows.

## Architectural Guidelines
1. **Component Composition:**
   - Group related utility classes logically: Layout (`flex`, `grid`) $\rightarrow$ Sizing (`w-full`, `h-12`) $\rightarrow$ Spacing (`p-4`, `gap-3`) $\rightarrow$ Typography (`text-sm`, `font-bold`) $\rightarrow$ Color (`bg-zinc-900`, `text-white`) $\rightarrow$ Effects (`shadow-xl`, `border`) $\rightarrow$ Transitions & Interactivity (`hover:scale-105`, `transition-all`).
2. **Ambient Glows & spatial backgrounds:**
   - Use radial and conic gradient blur containers: `bg-orange-500/10 blur-[120px] rounded-full pointer-events-none`.
3. **Responsive Breakpoints:**
   - Always design mobile-first: Base style for small screens, `sm:` for tablet, `md:` for landscape, `lg:` and `xl:` for desktops.
