# TinkerHub.org — UI & Animation Reference for Project Implementation

> **Reference purpose:** This document captures the observable UI structure, layout patterns, content hierarchy, and interaction/motion principles from the current TinkerHub homepage, then translates them into reusable implementation references for a new Next.js + React project.
>
> **Important:** This is a reference document, not a cloning specification. Preserve the structural and experiential principles while creating original branding, content, assets, and visual identity.
>
> **Verification note:** The current web crawl reliably exposes rendered content structure and section hierarchy. Exact animation timelines, easing curves, scroll triggers, CSS transforms, and JavaScript libraries are not fully exposed by the crawl. Animation items are therefore explicitly marked as either:
>
> - **Observed/structural reference** — supported by the rendered homepage structure.
> - **Implementation interpretation** — a recommended recreation of the visual experience where exact animation code could not be confirmed.

---

# 1. Reference Identity

## Core experience

The homepage presents itself as a mission-driven editorial experience rather than a conventional corporate landing page.

Its strongest characteristics are:

- Large statement-based typography.
- Small contextual labels before major ideas.
- Generous whitespace.
- A documentary/editorial section rhythm.
- Repeated numerical indexing (`01`, `02`, `03`, etc.).
- Large illustrations used as visual punctuation.
- Community stories and events embedded into the mission narrative.
- A progression from vision → mission → method → impact → participation → community.

## Experience model

```text
VISION
  ↓
MISSION
  ↓
PILLARS
  ↓
LONG-TERM GOAL
  ↓
ACTION PLAN
  ↓
IMPACT
  ↓
GET INVOLVED
  ↓
COMMUNITY STORIES
  ↓
UPCOMING EVENTS
  ↓
PARTNERS
  ↓
FOOTER
```

This storytelling sequence is one of the most valuable patterns to reuse.

---

# 2. Global UI Reference

## 2.1 Editorial hierarchy

The site repeatedly uses this hierarchy:

```text
SMALL CONTEXT LABEL

LARGE IDEA / STATEMENT

SUPPORTING COPY

RELEVANT VISUAL / CTA
```

Recommended reusable component:

```tsx
<EditorialSection>
  <Eyebrow>THE VISION</Eyebrow>
  <DisplayHeading>
    Large statement here
  </DisplayHeading>
  <BodyCopy>
    Supporting explanation
  </BodyCopy>
</EditorialSection>
```

---

## 2.2 Numbered visual language

The `01`, `02`, `03` motif is a major recurring identity pattern.

Use numbers as:

- Section indexes.
- Journey steps.
- CTA identifiers.
- Program identifiers.
- Feature ordering.

Recommended component:

```tsx
<SectionIndex number="01" />
```

Do not use the numbering only once. Repetition is important because it creates visual continuity across the experience.

---

## 2.3 Large statement typography

Major headings should communicate complete ideas rather than generic labels.

Weak:

```text
ABOUT US
```

Reference-inspired:

```text
THE KNOWLEDGE
TO BUILD A
BETTER FUTURE
SHOULD BE
ACCESSIBLE.
```

Use short labels for context and large statements for meaning.

---

## 2.4 Whitespace

The layout should use large visual gaps between major narrative sections.

Implementation guidance:

```css
.section {
  padding-block: clamp(5rem, 12vw, 12rem);
}
```

**Implementation interpretation:** Exact spacing values should be measured from the live site separately if pixel-level matching is required.

---

# 3. Section-by-Section UI Reference

# 3.1 Hero / Vision

## Observed structure

The homepage begins with:

```text
the VISION

[ large visual / illustration ]

Everyone has access to the knowledge required
to set the course for a better future

INDEX
```

## UI characteristics

- Small contextual eyebrow.
- Large visual element.
- Statement-based mission headline.
- Minimal supporting controls.
- Immediate emphasis on purpose rather than navigation-heavy content.

## Recommended project implementation

```tsx
<section className="hero">
  <Eyebrow>THE VISION</Eyebrow>

  <HeroVisual />

  <DisplayHeading>
    Your mission statement goes here
  </DisplayHeading>

  <ScrollCue />
</section>
```

## Motion reference

### Implementation interpretation

Use restrained layered movement:

- Background pattern: very slow parallax.
- Decorative pixel objects: medium parallax.
- 3D hero artifact: independent subtle motion.
- Heading: almost static; optional small reveal.

Recommended motion intensity:

```text
Background        LOW
Decorations       MEDIUM
Hero 3D object    MEDIUM
Typography        VERY LOW
```

Do not make the hero text continuously move.

---

# 3.2 Mission / "The Space Between"

## Observed structure

The next narrative block uses:

```text
the space between

dream&
reality

Mission description

[ decorative pillar-like illustrations ]
```

## Key UI pattern

A small conceptual label introduces a large expressive phrase.

This is a signature pattern worth adapting.

## Recommended implementation

```tsx
<MissionSection>
  <Eyebrow>THE SPACE BETWEEN</Eyebrow>

  <DecorativeDisplayHeading>
    <span>YOUR</span>
    <AccentObject />
    <span>REALITY</span>
  </DecorativeDisplayHeading>

  <MissionCopy />
</MissionSection>
```

## Motion reference

### Implementation interpretation

Recommended effects:

- Accent object moves at a different parallax depth.
- Decorative illustration has slow vertical translation.
- Large word can reveal through clipping/masking.
- Do not animate every individual character.

Preferred reveal:

```text
opacity: 0 → 1
translateY: 24px → 0
duration: 600–900ms
```

---

# 3.3 Four Pillars

## Observed structure

A heading introduces four conceptual pillars, including themes around:

1. Learning culture.
2. Community and belonging.
3. Empathy and volunteering.
4. Career growth, innovation, and entrepreneurship.

## UI reference

This should be treated as a content-first editorial grid rather than a generic SaaS feature section.

## Recommended project implementation

```tsx
<PillarGrid>
  <Pillar index="01" />
  <Pillar index="02" />
  <Pillar index="03" />
  <Pillar index="04" />
</PillarGrid>
```

## Layout recommendation

Desktop:

```text
01 ───────── 02
│             │
03 ───────── 04
```

Mobile:

```text
01
──
02
──
03
──
04
```

## Motion reference

### Implementation interpretation

On hover:

- Small `translateY`.
- Offset shadow movement.
- Optional 2–4 degree 3D tilt.
- Pixel icon movement.

Avoid strong rotation or long animation.

Recommended duration:

```text
150–250ms
```

---

# 3.4 Long-Term Goal / Numbered Statement

## Observed structure

The page introduces a numbered focus area:

```text
01

Learning Paradigm

[ illustration ]

Large future-oriented goal statement

Supporting methodology

CTA
```

## UI principle

The number, title, visual, statement, and CTA form one editorial block.

## Recommended implementation

```tsx
<GoalSection>
  <SectionIndex number="01" />
  <Eyebrow>YOUR PROGRAM / FOCUS</Eyebrow>

  <GoalVisual />

  <DisplayHeading>
    Long-term statement
  </DisplayHeading>

  <BodyCopy />
  <EditorialLink />
</GoalSection>
```

## Motion reference

Recommended:

- Illustration: parallax or subtle floating.
- Number: scroll reveal.
- CTA arrow: small horizontal movement on hover.

---

# 3.5 Action Plan

## Observed structure

The site presents:

```text
here is how we bring our vision to life

ACTION PLAN

01 Learn & Lead
02 Build & Innovate
03 Connect & Grow
04 Skill Up
05 Tinker & Shine
```

Each step includes concise explanatory text.

## UI principle

This section is a visual sequence.

The user should perceive:

```text
STEP 01
    ↓
STEP 02
    ↓
STEP 03
    ↓
STEP 04
    ↓
STEP 05
```

## Recommended implementation

```tsx
<ActionPlan>
  {steps.map((step, index) => (
    <ActionStep
      number={`0${index + 1}`}
      title={step.title}
      description={step.description}
    />
  ))}
</ActionPlan>
```

## Recommended advanced interaction

### Implementation interpretation

Use scroll activation.

When a step becomes active:

- Its number becomes dominant.
- Text opacity increases.
- Other steps become slightly muted.
- Background accent can change.
- Decorative pixel object changes position.

Recommended desktop layout:

```text
01 ─── Learn
02 ─── Build
03 ─── Connect
04 ─── Grow
05 ─── Create
```

Recommended mobile layout:

Vertical stacked sequence with no heavy scroll pinning.

---

# 3.6 Impact / Statistics

## Observed structure

The site communicates impact as a flowing narrative:

```text
We are now a community of 18K+ makers
with over 20 partners.
Together, we've hosted 1K+ events,
completed 5K+ projects and helped create
100+ career opportunities.
```

## Key UI principle

Statistics are embedded into a sentence rather than isolated dashboard tiles.

## Recommended implementation

```tsx
<ImpactStatement>
  Together, our community has
  <StatHighlight>18K+</StatHighlight> makers,
  <StatHighlight>1K+</StatHighlight> events
  and <StatHighlight>5K+</StatHighlight> projects.
</ImpactStatement>
```

## Motion reference

### Implementation interpretation

Use viewport-triggered number animation only once.

Recommended:

```text
0 → target number
duration: 900–1400ms
ease: easeOut
```

Do not repeatedly restart counters while scrolling.

---

# 3.7 Get Involved

## Observed structure

Three numbered actions:

```text
01 DONATE
02 VOLUNTEER
03 START A CAMPUS
```

Each includes a short statement and destination.

## Recommended implementation

```tsx
<GetInvolvedGrid>
  <ActionCard number="01" />
  <ActionCard number="02" />
  <ActionCard number="03" />
</GetInvolvedGrid>
```

## Neo-brutalist adaptation

Use:

- Thick borders.
- Sharp corners.
- Offset shadows.
- One neon accent per active card.

## Hover reference

Recommended:

```text
DEFAULT
border + hard shadow

HOVER
translate(-4px, -4px)
shadow moves with opposite offset
accent object activates
```

Keep interaction fast.

---

# 3.8 Community Stories

## Observed structure

The page includes:

```text
stories from the community

CATEGORY
PERSON NAME
by AUTHOR

learning story
```

Multiple stories appear as a repeated collection.

## Recommended implementation

Desktop:

Horizontal card rail.

Mobile:

Native horizontal scrolling.

```css
.story-rail {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}
```

## Motion reference

Recommended:

- Active card: slight scale increase.
- Images: subtle zoom on hover.
- Horizontal movement: user controlled.

Avoid autoplay as the default.

---

# 3.9 Upcoming Events

## Observed structure

Each event communicates:

```text
DATE
TIME
TITLE
```

with visual media support and a "View All" CTA.

## Recommended implementation

```tsx
<EventCard>
  <EventImage />
  <EventMeta />
  <EventTitle />
</EventCard>
```

## Motion reference

Recommended:

- Image scale on hover.
- Border reveal.
- Arrow movement.

Keep this calmer than the hero and action-plan sections.

---

# 3.10 Partners

## Observed structure

Partners are grouped under:

```text
Funding partners

Institutional partners
```

## UI principle

Grouping gives context.

Do not create one unstructured logo wall.

## Recommended implementation

```tsx
<PartnerGroup title="Funding Partners" />
<PartnerGroup title="Institutional Partners" />
```

## Motion reference

Recommended:

- Minimal.
- Grayscale → normal or increased contrast on hover.
- Optional pixel frame reveal.

This should be a visually calm section.

---

# 3.11 Footer

## Observed structure

The page ends with a minimal credit line.

## Recommended project adaptation

Create a minimal footer containing:

- Navigation.
- Contact.
- Social links.
- Legal links.
- Small closing statement.

Optional closing visual:

```text
END OF TRANSMISSION.

KEEP BUILDING.
```

---

# 4. Motion System Reference

## 4.1 Motion hierarchy

Not every section should move equally.

Recommended hierarchy:

```text
LEVEL 0
Static content

LEVEL 1
Hover interactions

LEVEL 2
Viewport reveals

LEVEL 3
Parallax decorative layers

LEVEL 4
Selective 3D interaction
```

---

# 5. Parallax Reference System

Use a consistent depth model.

## Depth 0 — Content

Text and important UI.

Movement:

```text
None or almost none.
```

## Depth 1 — Background

Patterns, grids, textures.

Movement:

```text
0.05x–0.10x
```

## Depth 2 — Pixel Decorations

Small decorative objects.

Movement:

```text
0.10x–0.20x
```

## Depth 3 — Illustrations

Large visual assets.

Movement:

```text
0.15x–0.30x
```

## Depth 4 — 3D Object

Independent movement.

Movement:

```text
Scroll + pointer response.
```

**Implementation interpretation:** Tune these values after testing; they are starting ranges, not values extracted from the reference site.

---

# 6. 3D Reference Strategy

The reference homepage is primarily an editorial content experience. For the new project, 3D should be an evolution of that experience rather than something applied everywhere.

## Recommended placement

### Primary

Hero:

```text
ONE memorable 3D artifact.
```

### Secondary

One section transition or action-plan visual.

## Recommended architecture

```text
Next.js UI
   │
   ├── Server-rendered editorial content
   │
   ├── CSS / lightweight motion
   │
   └── Lazy-loaded 3D island
```

## Technical recommendation

```text
React Three Fiber
+
Three.js
+
dynamic import
+
loading fallback
```

Do not:

- Create a WebGL canvas for every section.
- Load heavy 3D dependencies on pages that do not need them.
- Make important text or controls exist only inside WebGL.

---

# 7. Recommended Animation Stack

For a Next.js + React implementation:

## Base UI motion

```text
CSS transitions
```

Use for:

- Buttons.
- Links.
- Cards.
- Borders.
- Shadows.

## Scroll reveals

Use:

```text
Intersection Observer
```

or an existing lightweight animation library.

## Parallax

Use:

```text
requestAnimationFrame
+
passive scroll tracking
```

Do not perform expensive work directly in raw scroll handlers.

## Advanced timeline motion

If the project already uses it or requires complex sequencing:

```text
GSAP
```

Use selectively.

## 3D

```text
Three.js / React Three Fiber
```

Only for dedicated visual moments.

---

# 8. Animation Performance Rules

## Required

- Animate `transform` and `opacity` whenever possible.
- Avoid animating layout properties.
- Use `will-change` sparingly.
- Pause or simplify offscreen animations.
- Dynamically load 3D.
- Respect reduced-motion preferences.

## Avoid

```text
width animation
height animation
left/right animation
top/bottom animation
large DOM reflows
multiple simultaneous WebGL canvases
continuous background animation everywhere
```

---

# 9. Reduced Motion

Required implementation:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

For reduced motion:

- Disable continuous parallax.
- Disable auto-floating 3D.
- Replace reveal motion with instant visibility.
- Keep hover feedback where possible.

---

# 10. Responsive Motion Rules

## Desktop

Enable:

- Full parallax.
- 3D cursor interaction.
- Rich hover states.
- Larger decorative layers.

## Tablet

Reduce:

- Parallax intensity.
- Decorative layers.
- Complex hover dependencies.

## Mobile

Prefer:

- Static or low-intensity parallax.
- Native scroll.
- No cursor-dependent interactions.
- Reduced 3D complexity.
- Smaller asset count.

The mobile site should not feel like a broken desktop animation.

---

# 11. Recommended Component Architecture

```text
components/
│
├── ui/
│   ├── Container
│   ├── Section
│   ├── Eyebrow
│   ├── DisplayHeading
│   ├── SectionIndex
│   ├── EditorialLink
│   ├── BrutalistButton
│   └── BrutalistCard
│
├── motion/
│   ├── Reveal
│   ├── ParallaxLayer
│   ├── ScrollProgress
│   └── ReducedMotionProvider
│
├── visual/
│   ├── PixelDecoration
│   ├── PixelPattern
│   ├── AccentObject
│   └── Scene3D
│
└── sections/
    ├── Hero
    ├── Mission
    ├── Pillars
    ├── Goal
    ├── ActionPlan
    ├── Impact
    ├── GetInvolved
    ├── Stories
    ├── Events
    └── Partners
```

---

# 12. Implementation Order

## Phase 1 — Static structure

Build:

```text
Layout
↓
Typography
↓
Hero
↓
Mission
↓
Pillars
↓
Action Plan
↓
Impact
↓
CTA
↓
Stories
↓
Events
↓
Partners
↓
Footer
```

No complex animation yet.

---

## Phase 2 — Design identity

Add:

- Neo-brutalist borders.
- Pixel decorations.
- Accent color system.
- Offset shadows.
- Decorative typography.

---

## Phase 3 — Micro-interactions

Add:

- Link movement.
- Button states.
- Card elevation.
- Image hover effects.

---

## Phase 4 — Scroll motion

Add:

- Viewport reveals.
- Section activation.
- Controlled parallax.

---

## Phase 5 — 3D

Add:

- Hero artifact.
- One secondary interactive visual.

---

## Phase 6 — Performance

Verify:

- Lazy loading.
- Bundle size.
- Mobile performance.
- Reduced motion.
- No layout shift.
- No horizontal overflow.

---

# 13. Final Design Translation Rules

When applying this reference to the new project:

## Reuse

- Storytelling sequence.
- Editorial hierarchy.
- Small eyebrow + large statement pattern.
- Numbered visual language.
- Narrative statistics.
- Community story format.
- Event feed structure.
- Partner grouping.

## Transform

- Branding.
- Color palette.
- Decorative assets.
- Illustrations.
- Interaction style.

## Add to the new project

- Simple neon brutalism.
- Pixel-art accents.
- Selective 3D.
- Structured parallax.
- More immersive transitions.

## Do not copy

- Logos.
- Brand assets.
- Exact illustrations.
- Text.
- Partner branding arrangements unless they are genuinely your project's partners.

---

# 14. Final Experience Formula

```text
TINKERHUB-STYLE STORYTELLING
            +
EDITORIAL TYPOGRAPHY
            +
NUMBERED NAVIGATION LANGUAGE
            +
NEO-BRUTALIST STRUCTURE
            +
PIXEL ART IDENTITY
            +
CONTROLLED NEON ACCENTS
            +
SELECTIVE 3D
            +
PURPOSEFUL PARALLAX
```

## Final rule

The website must still look intentional when:

```text
JavaScript is slow.
3D is unavailable.
Animations are disabled.
Reduced motion is enabled.
```

The static design system and content hierarchy must carry the experience first.

Motion and 3D should enhance the experience, not become its foundation.
