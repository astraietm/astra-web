# Prompt: Apply TinkerHub.org UI to My Existing Site

Use this prompt with Claude Code, Claude Cowork, or by pasting it into a new chat along with the 4 reference files (`tinkerhub-ui-structure.md`, `tinkerhub-design-tokens.css`, `tailwind.config.tinkerhub.js`, `tinkerhub-hero-heading.html`).

---

## PROMPT

I want to restyle my existing website to match the UI/UX of tinkerhub.org, using the reference files I'm attaching:

- `tinkerhub-ui-structure.md` — full section-by-section layout, content hierarchy, and component patterns of the reference site
- `tinkerhub-design-tokens.css` — extracted color palette (CSS variables) and font setup
- `tailwind.config.tinkerhub.js` — the same tokens mapped into Tailwind's `theme.extend`
- `tinkerhub-hero-heading.html` — exact reconstructed markup/sizing for the site's signature "big word + decorative overlapping accent character" heading style

Please do the following:

1. **Audit my current site first.** Look at my existing pages/components and tell me what stack I'm on (plain CSS, Tailwind, styled-components, etc.) before changing anything.
2. **Merge, don't overwrite blindly.** Integrate the color tokens and font setup from `tinkerhub-design-tokens.css` / `tailwind.config.tinkerhub.js` into my existing config/theme without breaking anything already working (forms, auth, existing components, etc.).
3. **Re-map my existing content into TinkerHub's section structure**, following `tinkerhub-ui-structure.md` section-by-section:
   - Hero with a big statement headline (not a short title)
   - Mission/about block using the "big word + decorative overlapping accent" heading style from `tinkerhub-hero-heading.html`
   - A feature grid (my equivalent of their "four pillars")
   - A numbered step/plan section (01, 02, 03...) — reuse this numbered-block motif in at least one more place, since it's the strongest recurring visual identity element on the reference site
   - A stats section written as a flowing sentence rather than isolated number tiles
   - CTA cards (numbered, each linking somewhere)
   - A testimonials/stories section (carousel style, using Swiper.js or an equivalent if I don't already have one)
   - A list/feed section (their "upcoming events" pattern) if relevant to my content
   - A partner/logo strip grouped under sub-headings, if relevant
   - Footer credit line
4. **Preserve my actual content and copy** — don't replace my text with TinkerHub's; just apply their layout, spacing rhythm, typography scale, and color usage patterns to what I already have.
5. **Flag anything you're guessing at.** Some values (exact fonts, spacing scale, hover/shadow states) were not fully captured from the reference site — if you have to estimate any of these, tell me clearly rather than presenting a guess as confirmed.
6. **Show me a diff/preview** of the key changed files before applying everything, so I can sanity-check the result matches my expectations.

Ask me any clarifying questions about my site structure before starting if something is ambiguous.

---

## Before you use this prompt
For the best result, first fill any remaining gaps noted in `tinkerhub-ui-structure.md` (section 4 → "Still needed for 100% completeness") by pasting more DevTools "Computed" panel output from tinkerhub.org — nav bar, buttons, cards, spacing — so the AI applying this prompt has real values instead of placeholders.
