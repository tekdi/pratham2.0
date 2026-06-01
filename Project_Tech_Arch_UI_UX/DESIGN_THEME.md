# Pratham 2.0 — Design Theme & UI/UX Reference

> This document is the single source of truth for the Pratham 2.0 design system.
> It is intended for use with AI design tools (Figma AI, Adobe Firefly, Midjourney, v0.dev, Galileo AI, etc.)
> to generate new screens, components, and assets that are consistent with the existing product.

---

## Brand Overview

**Product Name:** Pratham 2.0
**Product Type:** Educational platform (Admin portal, Teacher portal, Learner app)
**Design Personality:** Warm, approachable, accessible, mobile-first
**Primary Users:** Learners (students), Teachers/Facilitators, Admins
**Design Framework:** Material UI (MUI) v5, React, Next.js
**RTL Support:** Yes (stylis-plugin-rtl)

---

## 1. Brand Colors

### Primary Brand Palette

| Role | Hex | Usage |
|------|-----|-------|
| **Brand Yellow** (Primary) | `#FDBE16` | CTAs, active states, highlights, nav active indicator |
| **Brand Yellow Light** | `#FFDEA1` | Hover states, light backgrounds |
| **Brand Yellow Dark** (Amber) | `#FFC64D` | Dark-mode primary |
| **Brand Blue** (Secondary) | `#0D599E` | Secondary actions, hyperlinks, informational |
| **Brand Blue Light** | `#E7F3F8` | Info card backgrounds |
| **Brand Dark** (Text) | `#1E1B16` | Primary text, dark backgrounds |
| **Success Green** | `#1A8825` | Positive states, completed progress |
| **Success Green Light** | `#C0FFC7` | Success card backgrounds |
| **Error Red** | `#BA1A1A` | Error states, destructive actions |
| **Error Red Light** | `#FFDAD6` | Error card backgrounds |
| **Info Dark Blue** | `#064471` | Informational headings |
| **Info Light Blue** | `#D6EEFF` | Info section backgrounds |

### Warm Neutral Scale (Core UI Colors)

This is the most important palette — all surfaces, text, borders, and dividers use these warm off-white to near-black tones.

| Token | Light Mode | Dark Mode | Use |
|-------|-----------|-----------|-----|
| `neutral-100` | `#17130B` | `#1A1A1A` | Near-black |
| `neutral-200` | `#261900` | `#FFFFFF` | Deep dark text |
| `neutral-300` | `#1F1B13` | `#FFFFFF` | **Primary text color** |
| `neutral-400` | `#7C766F` | `#4D4D4D` | Secondary text, labels |
| `neutral-500` | `#969088` | `#666666` | Placeholder, muted text |
| `neutral-600` | `#B1AAA2` | `#808080` | Disabled text |
| `neutral-700` | `#DED8E1` | `#999999` | Dividers, borders |
| `neutral-800` | `#F8EFE7` | `#B3B3B3` | Card surfaces, input backgrounds |
| `neutral-900` | `#DADADA` | `#CCCCCC` | Drag handles, separators |
| `neutral-A100` | `#D0C5B4` | `#E6E6E6` | Border/separator |
| `neutral-A200` | `#4D4639` | `#4D4639` | Dark warm grey accent |
| `neutral-BG` | `#FFFFFF` | `#121212` | Page background |
| `neutral-ALT` | `#EDEDED` | `#FFFFFF` | Alternate surface |

### Surface & Background Colors

| Surface | Value |
|---------|-------|
| App background (learner) | `linear-gradient(#FFFDF7, #F8EFDA)` — warm cream gradient |
| Page background (admin) | `#F3F5F8` |
| Card background | `#FFFFFF` |
| Input background | `#F8EFE7` |
| Sidebar background | `linear-gradient(to bottom, #FFFFFF, #F8EFDA)` |
| Header background | `linear-gradient(to right, #FFFFFF, #F8EFDA)` |
| Auth page background | `linear-gradient(135deg, #FFFDF6, #F8EFDA)` |

### Status / Progress Colors

| Status | Color |
|--------|-------|
| In Progress | `#FFB74D` |
| Completed | `#21A400` |
| Pending/Skeleton | `#FFDCC2` |
| Assessment highlight | `linear-gradient(135deg, #FFC107, #FFB300)` |

### Custom Accent Colors (Content Tags / Labels)

| Name | Hex |
|------|-----|
| Tomato | `#FF6347` |
| Sea Green | `#20B2AA` |
| Steel Blue | `#4682B4` |
| Orange Red | `#FF4500` |
| Lime Green | `#32CD32` |
| Medium Purple | `#9370DB` |
| Parrot Green | `#2AC300` |

---

## 2. Typography

### Font Families

| Font | Role | Weights | Source |
|------|------|---------|--------|
| **Poppins** | Primary brand font — all UI text | 400, 500, 600, 700 | Google Fonts |
| **Montserrat** | Thematic/editorial content pages | 100–900 (variable) | Google Fonts |

**Font stack fallback:**
```
Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif
```

**Rule:** Never use uppercase transform on buttons or labels — set `text-transform: none`.

### Type Scale

| Variant | Size | Weight | Line Height | Letter Spacing | Use |
|---------|------|--------|-------------|----------------|-----|
| `h1` | 22px | 400 | 28px | — | Page titles |
| `h2` | 16px | 500 | 24px | — | Section headers |
| `h3` | 14px | 500 | 20px | — | Subsection headers |
| `h4` | 14px | 400 | 20px | 0.1px | Card titles |
| `h5` | 12px | 500 | 16px | 0.5px | Labels, badge text |
| `h6` | 11px | 500 | 16px | 0.5px | Caption, micro-labels |
| `body1` | 16px | 400 | 24px | 0.5px | Default body text |
| `body2` | 14px | 400 | 20px | 0.25px | Secondary body text |
| `button` | 14px | 600 | — | — | All button labels |

### Display / Hero Scale (Learner App)

| Variant | Size | Use |
|---------|------|-----|
| `display-xl` | 72px | Large number/score display |
| `display-lg` | 45px | Hero numbers |
| `display-md` | 40px | Milestone numbers |
| `display-sm` | 36px | Section emphasis |
| `display-body` | 32px | Large body display |
| `display-title` | 28px | Section title |
| `display-sub` | 24px | Sub-display |
| `display-xs` | 18px | Subtitle |

### Accessibility: Dynamic Font Scaling

Users can adjust font size from **80% to 140%** in 10% steps. All font sizes should be expressed as scalable values so this system works.

---

## 3. Spacing & Layout

### Spacing Scale (MUI Default — 8px base)

| Step | px | Use |
|------|-----|-----|
| 0.5 | 4px | Micro gap |
| 1 | 8px | Icon padding, tight spacing |
| 2 | 16px | Default component padding |
| 3 | 24px | Section inner padding |
| 4 | 32px | Section gap |
| 5 | 40px | Large section gap |
| 6 | 48px | Page section spacing |

### Content Width Constraints

| Context | Max Width |
|---------|-----------|
| Admin/desktop content | `1600px` |
| Learner/mobile content | `768px` |
| Confirmation modal | `350px` |
| Standard modal | `340px` (90vw) |
| Centered modal | `450px` (at 600px+ breakpoint) |

### Header & Navigation

| Element | Height |
|---------|--------|
| AppBar (desktop) | `64px` |
| AppBar (mobile) | `56px` |
| Sidebar width (admin) | `284px` |
| Content left padding when sidebar open | `308px` |

### Responsive Breakpoints

| Name | Min Width | Layout Behavior |
|------|-----------|-----------------|
| `xs` | 0px | Mobile: stacked layout, bottom nav |
| `sm` | 600px | Small tablet: modal widths expand |
| `md` | 900px | Tablet: sidebar becomes persistent |
| `lg` | 1280px | Desktop: full sidebar visible |
| `xl` | 1536px | Large desktop |

---

## 4. Shape & Border Radius

| Component | Radius | Notes |
|-----------|--------|-------|
| **Primary buttons** | `100px` | Fully pill-shaped — brand signature shape |
| **Secondary/outline buttons** | `100px` | Same pill shape |
| **Cards** | `12px` | Standard content cards |
| **Admin cards** | `20px` | Larger radius in admin panels |
| **Dialogs / Modals** | `16px` | |
| **Bottom sheet modals** | `28px` top corners | Mobile sheet style |
| **Sidebar active item** | `100px` | Pill highlight on active nav |
| **Input fields** | `8px` | Form inputs in drawers |
| **Chips / Tags** | `0.75rem` | MUI chip default |
| **Progress bar** | `6px` | |
| **Swiper nav buttons** | `4px` | |
| **Search input** | `100px` | Pill search bar |
| **Floating action button** | `100px` | Full circle |
| **Mobile preview frame** | `55px` | iPhone-style simulator |

---

## 5. Shadows & Elevation

| Level | Value | Use |
|-------|-------|-----|
| None | `none` | Flat surfaces |
| Subtle | `0px 2px 3px rgba(0,0,0,0.10)` | Gentle lift |
| Card (admin) | `0px 7px 30px 0px rgba(90, 114, 123, 0.11)` | Default cards |
| Card (learner) | `0px 2px 6px rgba(0,0,0,0.1)` | Content cards |
| Card (learner hover) | `0px 4px 12px rgba(0,0,0,0.2)` | Card hover state |
| Card (taxonomy) | `0px 2px 8px rgba(0,0,0,0.06)` | Light card lift |
| Modal | `0px 4px 10px rgba(0,0,0,0.1)` | Dialogs |
| Sidebar | `0px 7px 30px 0px rgba(113,122,131,0.11)` | Side navigation |
| FAB / floating | `0 4px 8px 3px rgba(0,0,0,0.15)` | Floating action buttons |

---

## 6. Components

### Buttons

**Primary Button**
- Background: `#FDBE16` (Brand Yellow)
- Text color: `#1E1B16` (near-black)
- Border radius: `100px` (pill)
- Font: Poppins 14px / weight 600
- No text-transform (no uppercase)
- No box-shadow (flat)
- Hover: slightly darker yellow background

**Outlined/Secondary Button**
- Background: transparent
- Border: `1px solid #1E1B16`
- Text color: `#1E1B16`
- Border radius: `100px` (pill)
- Same sizing as primary

**Text/Link Button**
- Color: `#0D599E` (Brand Blue)
- No background or border
- Underline on hover

**Disabled Button**
- Background: `gainsboro` / `rgba(73,82,88,0.12)`
- Text: muted (neutral-500)

### Cards

- Background: white
- Border radius: `12px` (learner/content) or `20px` (admin)
- Shadow: subtle — `0px 2px 6px rgba(0,0,0,0.1)`
- Hover: `translateY(-5px)` + stronger shadow
- Padding: `14px–16px`
- No hard borders (shadow-only separation)

### Navigation / Sidebar

- Background: `linear-gradient(to bottom, #FFFFFF, #F8EFDA)`
- Active item: `background #FDBF34`, `color: black`, `border-radius: 100px`
- Inactive item: `color: #4D4639`
- Items have `borderRadius: 9px` when in list form

### Inputs / Form Fields

- Background: `#F8EFE7` (warm off-white)
- Border radius: `8px`
- Border: subtle (no heavy border lines)
- Focus state: color `#1F1B13`
- Label color: neutral-400 unfocused, neutral-300 focused
- Full width by default

### Dialogs / Modals

- Border radius: `16px`
- Max-width: `340px` (mobile), `450px` (tablet)
- Backdrop: standard MUI dark overlay
- Title: `h2` size (16px, weight 500)
- Body text: `body2` (14px)

**Bottom Sheet Modal (mobile)**
- Border radius: `28px` on top corners only
- Slides up from bottom of screen
- No fixed max-width

### Chips / Tags

- Font: Poppins 12px, weight 500
- Rounded (default MUI chip)
- Colors from the custom accent palette or semantic colors

### Progress Indicators

- **Linear progress**: warm grey track, primary/error colored bar, `6px` height, `6px` border-radius
- **Circular progress**: uses `react-circular-progressbar`
- Status: In Progress `#FFB74D`, Completed `#21A400`

### Swiper / Carousel

- Pagination bullets: `#CDC5BD` inactive, `#FFC107` active
- Bullet shape: `40px × 4px`, `8px` border-radius (elongated pill)
- Navigation buttons: `32px × 32px`, `4px` radius, arrow icon `14px`

### Toast Notifications

- Library: `react-toastify`
- Position: top-right (default)
- Style: follows semantic colors (success/error/info/warning)

### Tabs

- Active tab text: `#1F1B13`
- Inactive tab text: `#4D4639`
- Indicator: Brand Yellow `#FDBE16`

---

## 7. Gradients

| Name | CSS Value | Where Used |
|------|-----------|------------|
| Warm Cream (App BG) | `linear-gradient(#FFFDF7, #F8EFDA)` | Learner app background |
| Sidebar | `linear-gradient(to bottom, #FFFFFF, #F8EFDA)` | Admin/teacher sidebar |
| Header | `linear-gradient(to right, #FFFFFF, #F8EFDA)` | Admin/teacher top bar |
| Calendar | `linear-gradient(180deg, #FFFDF7 0%, #F8EFDA 100%)` | Calendar view |
| Auth Pages | `linear-gradient(135deg, #FFFDF6, #F8EFDA)` | Login/signup background |
| Assessment Score | `linear-gradient(135deg, #FFC107, #FFB300)` | Score/achievement display |
| Achievement Alt | `linear-gradient(135deg, #FFC107, #FF9800)` | Alternate achievement |
| Pink Accent | `linear-gradient(45deg, #FF1A79 0%, #EB82B3 40%)` | Decorative only |

**The "Warm Cream" family (`#FFFDF7` → `#F8EFDA`) is the signature background treatment of Pratham 2.0. Use it on large background areas to give a warm, paper-like feel.**

---

## 8. Animation & Motion

### Standard Transitions

| Property | Duration | Easing |
|----------|----------|--------|
| Background, color, fill, stroke | `150ms` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| Buttons, borders | `300ms` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| Card hover effects | `0.3s` | `ease` |
| Icon hover | `0.15s–0.25s` | `ease-out` |
| Opacity fade | `0.25s–0.5s` | `ease-out` / `ease-in` |
| General micro | `0.2s` | `ease-in-out` |

### Card Hover Effect
```
On hover: translateY(-5px) + box-shadow increase
Transition: transform 0.3s ease, box-shadow 0.3s ease
```

### Motion Principles

1. **Subtle lift** — cards rise slightly on hover, not jump
2. **Quick feedback** — button and input transitions ≤ 300ms
3. **Fade over slide** — prefer opacity transitions for content changes
4. **No unnecessary animation** — motion only when it communicates meaning

---

## 9. Iconography

| Library | Usage |
|---------|-------|
| `@mui/icons-material` | Primary icon set — all UI icons |
| Material Icons (font) | CSS-based icons via `font-family: 'Material Icons'` |

### Commonly Used Icons

| Category | Icons |
|----------|-------|
| Navigation | `ArrowBack`, `ArrowForward`, `Menu`, `Close`, `West`, `KeyboardArrowRight` |
| Actions | `Add`, `Edit`, `Delete`, `GetApp` (download), `Translate` |
| Status | `CheckCircleOutline`, `Warning` |
| Content | `FolderOutlined` |
| Accessibility | `Brightness4` (dark mode), `Brightness7` (light mode) |
| Layout | `ExpandLess`, `ExpandMore` |

---

## 10. Dark Mode

The product supports full dark/light mode switching.

### Key Dark Mode Differences

| Element | Light | Dark |
|---------|-------|------|
| Page background | `#FFFFFF` | `#121212` |
| Primary text | `#1F1B13` | `#FFFFFF` |
| Secondary text | `#7C766F` | `#4D4D4D` |
| Brand yellow | `#FDBE16` | `#FDBE16` (unchanged) |
| Error | `#BA1A1A` | `#FF4C4C` |
| Surface/card | `#F8EFE7` | `#B3B3B3` |
| Border/divider | `#DED8E1` | `#999999` |

**Brand Yellow stays the same in both modes** — it is the consistent visual anchor across light and dark.

---

## 11. Accessibility

### Features to Maintain in New Designs

1. **Font Size Scaling** — All designs must support 80%–140% font size without breaking layout. Use relative units (`rem`, `em`) or `calc()` based sizing.

2. **Color Inversion** — A "High Contrast" mode applies `filter: invert(1) hue-rotate(180deg)` to the entire page. Media (images/video) counter-applies this filter. Designs must not rely solely on color to communicate state.

3. **Touch Targets** — Minimum `44×44px` interactive area for all tappable elements on mobile.

4. **Contrast Ratios** — Primary text (`#1F1B13`) on white/cream backgrounds — WCAG AA compliant.

5. **RTL Support** — All layouts must work mirrored for right-to-left languages.

6. **Keyboard Navigation** — All interactive elements must have visible focus states.

---

## 12. Layout Patterns

### Mobile-First (Learner App)

- Single column layout, max-width `768px`
- **Bottom navigation bar** — primary navigation on mobile
- Content stacks vertically
- Cards: full width with `12px` radius
- Floating action button in bottom-right area
- Warm cream gradient as page background

### Admin / Teacher App (Desktop-First)

- **Persistent left sidebar** (`284px` wide) on desktop (lg+)
- Top AppBar fixed (`64px`) with title, actions, avatar
- Main content area: padded `308px` from left
- **Temporary drawer** on mobile (hamburger menu)
- Background: flat `#F3F5F8`
- Content cards on white background with shadow

### Shared Pattern: TopAppBar + Content + Footer

- Logo (`32px` height) in top-left
- Navigation links in header or drawer
- Consistent `64px` header offset for all page content

---

## 13. Content Hierarchy Patterns

### Page Structure (Typical Screen)

```
[Header / AppBar — 64px]
  ├── Logo (left)
  ├── Title (center or left-of-center)
  └── Actions (right — avatar, notifications, theme toggle)

[Main Content Area]
  ├── Page Title (h1 — 22px, weight 400)
  ├── Subtitle / Breadcrumb (body2 — 14px, neutral-400)
  ├── [Primary Action Button — Brand Yellow, top-right]
  └── Content Cards / Lists / Tables

[Bottom Navigation (mobile) / Footer (desktop)]
```

### Card Pattern

```
[Card — 12px radius, white, subtle shadow]
  ├── Optional: Thumbnail / Icon (top)
  ├── Title (h3 or h4 — 14px, weight 500)
  ├── Subtitle / Meta (body2 — 14px, neutral-400)
  ├── Tags / Chips (row of colored chips)
  └── Actions (icon buttons or text link at bottom)
```

---

## 14. Tone & Visual Style Summary

| Attribute | Value |
|-----------|-------|
| **Color Temperature** | Warm — cream, amber, golden yellow, off-whites |
| **Contrast Style** | Soft — no harsh black/white; uses warm dark `#1F1B13` on cream |
| **Shape Language** | Rounded — pill buttons, rounded cards, no sharp corners |
| **Typography Mood** | Friendly and readable — Poppins with moderate weights |
| **Density** | Comfortable — generous padding, not cramped |
| **Elevation** | Subtle — soft shadows, no heavy borders |
| **Motion** | Gentle — short durations, ease curves, no aggressive animation |
| **Brand Signal** | Yellow `#FDBE16` — bold and consistent across all contexts |

---

## 15. Do's and Don'ts

### Do
- Use **Brand Yellow `#FDBE16`** for all primary CTAs and active states
- Use **pill-shaped buttons** (border-radius `100px`) for all primary actions
- Apply the **warm cream gradient** (`#FFFDF7` → `#F8EFDA`) to large background areas
- Use **Poppins** for all text — no other font except Montserrat for editorial/thematic sections
- Keep **text-transform: none** on all buttons
- Use **soft shadows** for elevation — never hard box borders on cards
- Maintain **warm off-white** (`#F8EFE7`) for input field backgrounds
- Design for **mobile-first** with 768px max content width

### Don't
- Don't use pure white `#FFFFFF` as the app background — use the warm cream gradient
- Don't use uppercase button text
- Don't use harsh drop shadows — keep them subtle and warm-toned
- Don't use sharp corners (0px radius) on interactive elements
- Don't rely solely on color for state (accessibility requirement)
- Don't use heavy font weights (800, 900) — max is 700, typical is 400–600
- Don't break the warm color temperature with cool blues/greys as dominant tones

---

## 16. Key Libraries & Tools Reference

| Library | Version | Purpose |
|---------|---------|---------|
| Material UI | `^5.15.x` | Core component framework |
| Emotion | `^11.11.x` | CSS-in-JS styling |
| Swiper | `^11.x` | Carousels and sliders |
| React Toastify | `^10.x` | Notification toasts |
| React Circular Progressbar | `^2.x` | Circular progress rings |
| Recharts | `^2.x` | Data charts/graphs |
| React Hook Form | `^7.x` | Form state management |
| RJSF (JSON Schema Forms) | `^5.x` | Dynamic form generation |
| React Joyride | `^2.x` | Onboarding product tours |
| React Select | `^5.x` | Enhanced dropdowns |
| KA Table | `^11.x` | Data tables |

---

## 17. File Locations (For Reference)

| Purpose | File Path |
|---------|-----------|
| Admin/Teacher theme | `apps/admin-app-repo/src/styles/customTheme.tsx` |
| Learner theme | `apps/learner-web-app/src/assets/theme/MuiThemeProvider.tsx` |
| Taxonomy theme | `mfes/taxonomy-manager/src/theme.ts` |
| Auth MFE theme | `mfes/authentication/src/styles/customTheme.tsx` |
| Admin global CSS | `apps/admin-app-repo/src/styles/globals.css` |
| Learner global CSS | `apps/learner-web-app/src/app/global.css` |
| Admin shadows | `apps/admin-app-repo/src/components/theme/Shadows.ts` |
| Component overrides | `apps/admin-app-repo/src/components/theme/ComponentOverRide.ts` |
| Font size context | `apps/learner-web-app/src/context/FontSizeContext.tsx` |
| Color inversion context | `apps/learner-web-app/src/context/ColorInversionContext.tsx` |
| Warm gradient util | `apps/learner-web-app/src/utils/style.tsx` |
