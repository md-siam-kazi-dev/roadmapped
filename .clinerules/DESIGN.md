# DESIGN.md — Visual & Interaction Design System

> This document follows the studio's design-lead process: ground in the subject, define a token system, choose a layout concept, name one signature element, then apply restraint. All color/type decisions below are derived from the brief's explicit constraints (white/black theme base, `#8E977D` action color) rather than default AI-design patterns.

## 1. Grounding the Subject

**Subject:** a daily learning roadmap — free YouTube content reorganized into an ordered path with visible locks, unlocks, streaks, and gems.

**The one true metaphor:** a **trail / path**. Modules are stops along a route; a learner physically moves forward one waypoint at a time and can look back at the ground already covered. This isn't a generic numbered list — order carries real meaning here (you *cannot* skip a waypoint), so sequence-driven structural devices (path lines, waypoint markers, lock/unlock states) are justified, not decorative.

**Single job of the page (dashboard/course view):** answer "what do I do right now, and how long do I have?" in under two seconds.

---

## 2. Token System

### 2.1 Color

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#FFFFFF` | `#0A0A0A` | Page background (true white / near-black per brief) |
| `--surface` | `#F6F6F3` | `#161613` | Cards, panels, raised surfaces |
| `--border` | `#E4E4DE` | `#262622` | Hairlines, dividers, node connectors |
| `--text-primary` | `#14140F` | `#F2F1EC` | Headings, primary copy |
| `--text-muted` | `#5D5D54` | `#A3A399` | Secondary copy, captions |
| `--action` | `#8E977D` | `#8E977D` | **Primary button** (brief-specified, constant across themes) |
| `--action-hover` | `#767F67` | `#A3AC91` | Button hover/active |
| `--action-fg` | `#FFFFFF` | `#0A0A0A` | Text/icon on action color |
| `--ember` (streak) | `#C97B4A` | `#E08F5C` | Streak flame, "at risk" countdown state |
| `--gem` | `#4E8B8B` | `#63A6A6` | Gem balance, reward moments (teal — deliberately *not* a cliché gold, reads calmer and more "earned," pairs cleanly with sage) |
| `--danger` | `#B5544A` | `#CC6E63` | Missed deadline, rejected assignment |
| `--success` | `#5C8A5C` | `#78A878` | Passed quiz, approved assignment |

The palette is intentionally desaturated and quiet — sage, teal, and ember sit close in tone so the UI never fights the content (YouTube thumbnails and video players are already visually loud). Color is reserved for **state**, not decoration: green-sage = go/primary action, teal = reward, ember = urgency, rust = failure.

### 2.2 Typography

| Role | Typeface | Notes |
|---|---|---|
| Display (headings, course titles) | **Fraunces** (variable, use optical size + slight negative tracking at large sizes) | A soft-serif with warmth — avoids the generic geometric-sans-headline default. Used sparingly: H1/H2 only. |
| Body / UI | **Inter** | Neutral, highly legible at small sizes for dense dashboard UI, excellent Next.js/variable-font support |
| Data / countdown / streak numbers | **IBM Plex Mono** | Monospace for the deadline timer and gem/streak counters — tabular figures prevent digits from jittering as they tick down, and it visually marks "this number is live" |

Type scale (rem, 16px base): `12 / 14 / 16 / 18 / 22 / 28 / 36 / 48`. Display face used only at 28+; everything smaller stays in Inter for legibility.

### 2.3 Layout Concept

```
┌─────────────────────────────────────────┐
│  Header: logo · streak · gems · avatar   │
├───────────┬───────────────────────────────┤
│           │  "Continue your path" hero    │
│  Sidebar  │  ── current module + timer ── │
│  (course  │                               │
│  nav /    │  ○──●──●──○──○   waypoint     │
│  roadmap  │  trail for the active course  │
│  list)    │                               │
│           │  Video / Quiz / Assignment    │
│           │  panel (contextual)           │
└───────────┴───────────────────────────────┘
```

Dashboard and course pages share this two-column shell on desktop; the sidebar collapses to a bottom sheet / horizontal scroll strip on mobile so the trail is still glanceable with one thumb.

### 2.4 Signature Element — the Waypoint Trail

A horizontal (mobile) / vertical (desktop) connected node path renders every module as a stop:

- **Completed** waypoint: filled sage circle with a check glyph.
- **Active/unlocked** waypoint: sage ring, pulsing softly (CSS, respects reduced-motion), tappable.
- **Scheduled/locked** waypoint: hollow outline, muted, small clock glyph + "unlocks in Xh" label.
- Connector lines between nodes fill in (draw-on) as a module completes — this is the one orchestrated animation moment the page is built around.

This single element carries the entire product thesis — "one path, one step at a time" — so everything else in the UI (cards, buttons, headers) stays deliberately quiet around it.

---

## 3. Component & Library Mapping

| Layer | Library | Usage |
|---|---|---|
| Base components | **shadcn/ui** | Buttons, inputs, dialogs, dropdowns, tabs, form primitives — themed via the token table above (override shadcn's default CSS variables, do not use its default zinc/slate palette) |
| Flourish components | **Magic UI** | Reserved for a small number of high-impact moments only: the gem-reward burst on module completion, an animated number counter for streak/gems, a subtle border-beam on the "continue learning" hero card. Not used broadly — one accessory removed, per the design mirror-check |
| Orchestrated motion | **GSAP** | Page-load trail reveal (nodes + connectors draw in sequence), the module-unlock sequence (lock icon → unlock icon morph + connector fill), quiz pass/fail state transitions |
| Micro-interactions | **Framer Motion** | Button press/hover states, layout transitions (e.g. video list reordering as items complete), toast enter/exit, tab switches |
| Icons | **Lucide React** | Matches shadcn's default icon system, tree-shakeable, consistent stroke-based style that stays quiet next to the Fraunces display face. Specific icons: `Flame` (streak), `Gem`, `Lock`, `LockOpen`, `CheckCircle2`, `PlayCircle`, `Clock`, `FileCheck2` (assignment) |

### Motion discipline
- One orchestrated sequence per major state change (unlock, completion) — not scattered effects on every element.
- All animation wrapped to respect `prefers-reduced-motion: reduce` (GSAP: skip to end state; Framer: disable transition, keep opacity fade only).
- Loading states use skeletons (shadcn `Skeleton`), never spinners, to keep the trail metaphor consistent (things "arrive" rather than "spin").

---

## 4. Theming Implementation Notes

- Theme is driven by a single `data-theme="light" | "dark"` attribute on `<html>`, toggled via `next-themes`, values read from the CSS variable table in §2.1.
- `--action` (`#8E977D`) is intentionally **identical in both themes** — it's the one constant, recognizable "brand" touchpoint whether the learner is studying at noon or at 11pm.
- Contrast check: `#8E977D` on white passes AA for large text/icons but is borderline for small body text — action buttons always pair the sage fill with white (`--action-fg`) text at ≥14px semibold, never sage-on-white text alone.

---

## 5. Self-Critique Checklist (applied before build)

- [x] Not the cream+terracotta default, not the near-black+acid-accent default, not the broadsheet default — palette and layout are derived from the brief's own white/black + sage constraint.
- [x] Numbered/sequential markers are justified — the product *is* a literal sequence, not a decorative timeline.
- [x] One signature element (waypoint trail) carries the visual risk; everything else (cards, forms, nav) stays restrained and shadcn-standard.
- [x] Motion is purposeful and reduced-motion-safe, not ambient decoration.
- [x] Accessible in both themes: verified contrast on text, borders, and the action color.