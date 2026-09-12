# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Project Name

**Neo Maker Experience — UI Redesign**

## Project Type

Frontend UI/UX redesign

## Technology Foundation

- Next.js
- React
- Existing project architecture
- AWS-compatible deployment
- Cloudflare-compatible delivery and caching

## Project Phase

**Phase 1: Frontend UI and experience redesign only**

---

# 1. PRODUCT OVERVIEW

## 1.1 Vision

Build a next-generation digital experience inspired by the editorial storytelling and community-driven structure of TinkerHub.

The new experience should not be a visual clone.

It should evolve the structural philosophy into a distinct digital identity combining:

- Editorial storytelling
- Neo-brutalist UI
- Minimal neon accents
- Pixel-art visual culture
- Interactive 3D experiences
- Scroll-driven parallax
- Community and technology storytelling

The final product should feel less like a traditional institutional or corporate website and more like an interactive digital universe for builders, creators, learners, and communities.

---

## 1.2 Product Goal

Create a visually memorable, highly responsive, reusable frontend UI system that can later support the existing website's full functionality and future features.

The Phase 1 deliverable is a complete frontend experience that:

- Preserves the existing website's brand identity
- Supports the existing content structure
- Does not modify backend infrastructure
- Creates reusable React components
- Supports desktop, tablet, and mobile
- Remains performant despite visual complexity
- Is ready for future data/API integration

---

# 2. PRODUCT OBJECTIVES

## Primary Objectives

### O1 — Create a distinctive visual identity

Create a website experience that immediately differentiates itself from conventional institutional, SaaS, and corporate websites.

---

### O2 — Preserve content storytelling

Use TinkerHub's editorial section rhythm and storytelling philosophy while preserving the existing website's content.

---

### O3 — Create an immersive experience

Introduce controlled visual depth through:

- Parallax
- Scroll-based transitions
- 3D objects
- Interactive visual elements
- Layered pixel-art assets

---

### O4 — Maintain performance

Ensure the visual experience does not compromise:

- Page load performance
- Core Web Vitals
- Mobile usability
- Accessibility

---

### O5 — Build a reusable UI system

The redesign must not be built as one large page component.

It should provide reusable:

- Layout components
- UI primitives
- Section components
- Motion utilities
- Data structures

---

# 3. PRODUCT SCOPE

## In Scope

### Visual Design

- Complete design system
- Typography
- Color system
- Spacing system
- Responsive layouts
- Neo-brutalist visual components
- Pixel-art decorative system

### Homepage UI

- Navigation
- Hero
- Mission section
- Pillars/features
- Numbered journey
- Impact section
- CTA section
- Community stories
- Events/content feed
- Partner section
- Footer

### Motion

- Scroll reveal
- Parallax
- Hover interactions
- Section transitions
- Number animations

### 3D

- Hero 3D experience
- One additional optional interactive 3D moment

### Responsive Experience

- Desktop
- Laptop
- Tablet
- Mobile

---

## Out of Scope — Phase 1

Do not modify:

- Backend APIs
- AWS infrastructure
- Cloudflare configuration
- Authentication
- Database
- Payment systems
- Admin systems
- API endpoint architecture
- Business logic

The existing functionality should remain untouched.

---

# 4. TARGET EXPERIENCE

The user should feel that they are entering a:

> Digital maker universe.

The website should communicate:

- Creativity
- Technology
- Experimentation
- Community
- Learning
- Building
- Innovation

The visual experience should balance two forces.

## Structured

- Clear hierarchy
- Readable content
- Predictable navigation
- Consistent spacing

## Experimental

- Pixel characters
- Unexpected typography
- Neon interactions
- 3D artifacts
- Scroll-based movement
- Parallax layers

---

# 5. DESIGN PRINCIPLES

## Principle 01 — Content First

Visual effects should support storytelling.

Content must never become difficult to read because of:

- Neon effects
- Animation
- Pixel assets
- 3D objects

---

## Principle 02 — Controlled Chaos

The visual identity can be experimental.

The layout cannot be confusing.

---

## Principle 03 — Motion Has Purpose

Every animation must serve one of the following:

- Indicate interaction
- Create depth
- Guide attention
- Explain progression
- Improve storytelling

No decorative motion without purpose.

---

## Principle 04 — Pixel Art Is an Accent Layer

Pixel art should provide personality.

It should not replace:

- Navigation
- Long-form typography
- Accessibility
- Core UI controls

---

## Principle 05 — 3D Is a Special Experience

3D should create memorable moments.

It should not dominate every page.

---

# 6. VISUAL DESIGN SYSTEM

## 6.1 Design Formula

The approximate visual composition should be:

- 60% Editorial minimalism
- 20% Neo-brutalism
- 10% Pixel-art identity
- 10% Neon and immersive effects

These are design priorities rather than strict visual measurements.

---

# 6.2 Color System

Use a neutral foundation.

## Primary Foundation

- Near-black
- Off-white
- Neutral surfaces

## Accent System

Use limited neon accents.

Potential categories:

- Neon green
- Electric blue
- Acid yellow
- Hot magenta

Rules:

- One dominant accent per major visual area.
- Avoid multiple competing neon colors.
- Ensure accessible contrast.
- Do not use neon as the default body text color.

---

# 6.3 Typography

Create four major typography levels.

## Display

For:

- Hero
- Mission statements
- Major transitions

Characteristics:

- Large
- Bold
- Editorial
- Expressive

---

## Section Heading

For:

- Major page sections
- Community content
- Programs
- Events

---

## Body

For:

- Descriptions
- Explanations
- Supporting information

Readable and restrained.

---

## Technical Metadata

Use a technical/monospace visual language for:

- Section numbers
- Dates
- Labels
- Coordinates
- Metadata

---

# 7. CORE UI PATTERNS

## Pattern 01 — Section Index

Example:

`01 // THE VISION`

Used consistently throughout the website.

---

## Pattern 02 — Mega Statement

Large sentence-based typography.

Example:

> WE BUILD THE FUTURE TOGETHER.

Used instead of generic page headings.

---

## Pattern 03 — Decorative Overlap

A large word combined with:

- Pixel object
- Accent character
- Neon visual element

The object may overlap typography without affecting readability.

---

## Pattern 04 — Brutalist CTA

Characteristics:

- Strong borders
- Sharp corners
- High contrast
- Offset shadow
- Controlled neon hover

---

## Pattern 05 — Numbered Content

The numbering system:

`01 / 02 / 03`

must appear in multiple major sections.

---

# 8. INFORMATION ARCHITECTURE

The homepage experience should follow this journey.

```text
01  NAVIGATION

02  HERO / VISION

03  MISSION

04  CORE PILLARS

05  JOURNEY

06  IMPACT

07  GET INVOLVED

08  COMMUNITY STORIES

09  EVENTS / ACTIVITY

10  PARTNERS

11  FOOTER
```

The exact content inside each section should be mapped from the existing website.

---

# 9. SECTION REQUIREMENTS

## 9.1 Navigation

### Requirements

- Responsive
- Accessible
- Minimal
- Clear navigation hierarchy
- Mobile menu

### Motion

- Subtle hover state
- Menu transition
- Optional pixel indicator

---

## 9.2 Hero

### Required Elements

- Eyebrow
- Large statement
- Supporting description
- Primary CTA
- Secondary CTA if necessary

### Visual Experience

- Multi-layer parallax
- Decorative pixel objects
- Central or supporting 3D artifact

---

## 9.3 Mission

### Required Elements

- Context label
- Large expressive word/statement
- Existing mission content
- Decorative visual layer

### Visual Treatment

Use:

**Large typography + overlapping accent element**

---

## 9.4 Core Pillars

Display important themes as editorial brutalist blocks.

### Each Pillar

- Number
- Title
- Description
- Optional icon

### Interaction

- Hover elevation
- Small 3D tilt
- Offset shadow movement

---

## 9.5 Numbered Journey

This is one of the main storytelling experiences.

### Each Step

- Large number
- Title
- Description
- Relevant CTA

### Scroll Behavior

- Active step becomes dominant
- Background/decorative layer changes
- Pixel objects shift in parallax

---

## 9.6 Impact

Present metrics as a narrative statement.

Do not use conventional dashboard tiles.

Numbers should:

- Be visually emphasized
- Animate when entering the viewport
- Remain accessible

---

## 9.7 Get Involved

Display major user actions as numbered brutalist panels.

### Requirements

- Number
- Title
- Description
- CTA

### Interaction

- Border transition
- Shadow movement
- Neon activation

---

## 9.8 Community Stories

### Requirements

- Horizontal scroll
- Responsive cards
- Image support
- Metadata
- Story title
- CTA

### Desktop

Optional controlled carousel.

### Mobile

Native horizontal scroll with scroll snap preferred.

---

## 9.9 Events / Content

Display existing or future content using an editorial feed.

### Each Item

- Date
- Category
- Title
- Metadata
- Optional image

---

## 9.10 Partners

Group partners by relationship.

Example:

- Funding Partners
- Institutional Partners
- Community Partners

Use a calm visual design.

This section should provide visual breathing room after the more immersive sections.

---

## 9.11 Footer

Create an ending experience.

Include:

- Navigation
- Contact
- Social links
- Legal information

Optional:

Large closing statement.

---

# 10. MOTION REQUIREMENTS

## Motion Categories

### Micro Interactions

- Button hover
- Link arrow movement
- Card elevation

### Scroll Reveal

- Content entrance
- Number activation
- Section transitions

### Parallax

Use multiple controlled depth layers.

#### Layer 0

Static content.

#### Layer 1

Background patterns.

#### Layer 2

Pixel assets.

#### Layer 3

Illustrations.

#### Layer 4

3D objects.

---

# 11. 3D REQUIREMENTS

## Primary 3D Experience

Hero object.

Potential forms:

- Abstract technological artifact
- Pixel-inspired cube
- Network sculpture
- Maker object

---

## Secondary 3D Experience

One additional moment elsewhere in the experience.

Potential placement:

- Journey section
- Impact section
- CTA transition

---

## Performance Rules

3D components must:

- Load dynamically
- Be isolated
- Be lazy-loaded
- Have fallback states
- Respect reduced motion

---

# 12. TECHNICAL IMPLEMENTATION PLAN

# Phase 0 — Existing UI Audit

## Tasks

- Inspect Next.js architecture
- Identify App Router or Pages Router
- Identify Tailwind/CSS system
- Inspect component structure
- Inspect installed animation libraries
- Inspect image handling
- Identify reusable UI components

## Deliverable

Frontend architecture map.

---

# Phase 1 — Design Foundation

## Tasks

Create:

- Color tokens
- Typography tokens
- Spacing tokens
- Responsive rules
- Border rules
- Shadow system
- Neon accent system

## Deliverable

Reusable design system.

---

# Phase 2 — Base Components

Build:

```text
Container
Section
Eyebrow
DisplayHeading
NumberLabel
Button
EditorialLink
BrutalistCard
PixelDecoration
```

## Deliverable

Reusable component library.

---

# Phase 3 — Layout Components

Build:

```text
Navbar
MobileNavigation
Footer
PageWrapper
```

## Deliverable

Global UI shell.

---

# Phase 4 — Homepage Static UI

Build sections in this order:

```text
Hero
↓
Mission
↓
Pillars
↓
Journey
↓
Impact
↓
Get Involved
↓
Stories
↓
Events
↓
Partners
```

Use static/mock frontend data where dynamic integration is not connected.

## Deliverable

Complete static homepage.

---

# Phase 5 — Pixel Visual System

Create:

- Pixel icons
- Pixel decorations
- Background patterns
- Decorative characters
- Section visual markers

Use reusable assets.

Prefer:

- SVG
- Optimized PNG/WebP

Avoid unnecessarily large assets.

---

# Phase 6 — Motion Layer

Implement:

- CSS transitions
- Intersection Observer reveals
- Scroll-based section activation
- Lightweight parallax

Use:

`requestAnimationFrame`

for continuous scroll/cursor animation.

Avoid expensive calculations on every raw scroll event.

---

# Phase 7 — 3D Layer

Recommended architecture:

```text
Next.js Application
        │
        ├── Standard UI
        │
        └── Lazy-loaded 3D Experience
```

Potential technology:

- Three.js
- React Three Fiber

Only load 3D where required.

---

# Phase 8 — Responsive Optimization

Test:

## Desktop

1440px and above.

## Laptop

1024px–1439px.

## Tablet

768px–1023px.

## Mobile

Below 768px.

Focus on:

- Typography scaling
- Decorative positioning
- Horizontal overflow
- Touch targets
- Animation complexity

---

# Phase 9 — Accessibility

Verify:

- Keyboard navigation
- Focus visibility
- Color contrast
- Semantic structure
- Heading hierarchy
- Alt text
- Reduced motion

---

# Phase 10 — Performance

Optimize:

- Images
- Client components
- JavaScript bundles
- Animation execution
- 3D loading

Avoid:

- Multiple WebGL canvases
- Heavy textures
- Full-page animation libraries
- Unnecessary dependencies

---

# 13. PROPOSED COMPONENT STRUCTURE

Adapt this to the existing project.

```text
components/
│
├── layout/
│   ├── Navbar
│   ├── MobileNavigation
│   ├── Footer
│   └── PageWrapper
│
├── ui/
│   ├── Container
│   ├── Section
│   ├── Eyebrow
│   ├── DisplayHeading
│   ├── NumberLabel
│   ├── Button
│   ├── EditorialLink
│   └── BrutalistCard
│
├── visual/
│   ├── PixelDecoration
│   ├── PixelIcon
│   ├── ParallaxLayer
│   └── HeroScene3D
│
└── sections/
    ├── Hero
    ├── Mission
    ├── Pillars
    ├── Journey
    ├── Impact
    ├── GetInvolved
    ├── Stories
    ├── Events
    └── Partners
```

---

# 14. PERFORMANCE ACCEPTANCE CRITERIA

The final UI should:

- Avoid unnecessary client-side JavaScript
- Lazy load heavy components
- Dynamically import 3D scenes
- Optimize images
- Avoid animation-induced layout shifts
- Avoid horizontal overflow
- Remain usable while enhanced effects load

Core content must not depend on 3D or animation.

---

# 15. AWS AND CLOUDFLARE COMPATIBILITY

The UI must remain deployment-platform independent.

Do not introduce:

- Vercel-only dependencies
- Hosting-specific UI APIs
- Environment-specific frontend URLs

Ensure:

- Relative asset paths
- Standard Next.js architecture
- CDN-friendly assets
- Cacheable static resources
- Graceful rendering behind Cloudflare

No AWS or Cloudflare infrastructure changes are part of this phase.

---

# 16. IMPLEMENTATION PRIORITY

## Priority P0 — Required

- Design system
- Navigation
- Hero
- Mission
- Core pillars
- Journey
- Responsive design
- Accessibility

---

## Priority P1 — Important

- Impact section
- CTA section
- Stories
- Events
- Partners
- Parallax

---

## Priority P2 — Enhancement

- Advanced 3D
- Experimental interactions
- Advanced pixel animations
- Easter eggs

---

# 17. DEFINITION OF DONE

The UI phase is complete when:

- The homepage is visually redesigned.
- The design system is reusable.
- The website is responsive.
- The numbered motif is consistently implemented.
- Pixel art is integrated intentionally.
- Neon accents are controlled.
- Parallax adds depth without harming usability.
- At least one 3D experience exists.
- 3D is lazy-loaded.
- No backend logic is modified.
- Existing deployment compatibility remains intact.
- No horizontal overflow exists.
- Reduced-motion support exists.
- The interface is ready for future API/data integration.

---

# FINAL PRODUCT STATEMENT

The final experience should feel like:

> **An experimental digital maker universe built with editorial storytelling, neo-brutalist structure, pixel culture, controlled neon energy, and immersive 3D depth.**

The website should not look like a conventional template.

It should not look like a direct clone of TinkerHub.

It should be a new interpretation of that storytelling philosophy — designed as a memorable, modern, interactive destination for its own community and identity.