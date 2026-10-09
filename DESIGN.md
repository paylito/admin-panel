---
name: Payli dashboard
description: Existing light dashboard shared by admin and public payment views.
colors:
  purple: "#6449ff"
  purple-2: "#7b5cff"
  purple-3: "#9c84ff"
  purple-tint: "#f1efff"
  cyan: "#20ecff"
  page-bg: "#f7f7ff"
  card-bg: "#ffffff"
  card-border: "#ededf4"
  hairline: "#f0f0f6"
  input-border: "#e4e4ee"
  input-bg: "#fbfbfe"
  text: "#15152a"
  text-3: "#5a5a72"
  muted: "#7a7a92"
  muted-2: "#8888a0"
  ok-bg: "#e8f8ef"
  ok-fg: "#15803d"
  warn-bg: "#fef2e2"
  warn-fg: "#b45309"
  err-bg: "#fce9e9"
  err-fg: "#b91c1c"
typography:
  display: { fontFamily: "Gabarito, system-ui, 'Segoe UI', sans-serif", fontSize: "50px", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.01em" }
  headline: { fontFamily: "Gabarito, system-ui, 'Segoe UI', sans-serif", fontSize: "27px", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.01em" }
  title: { fontFamily: "Gabarito, system-ui, 'Segoe UI', sans-serif", fontSize: "16px", fontWeight: 800 }
  body: { fontFamily: "Plus Jakarta Sans, system-ui, 'Segoe UI', sans-serif" }
  label: { fontFamily: "Plus Jakarta Sans, system-ui, 'Segoe UI', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.04em" }
  mono: { fontFamily: "ui-monospace, 'SF Mono', 'SFMono-Regular', Menlo, monospace", fontSize: "12px" }
rounded:
  control: "10px"
  navigation: "11px"
  button: "12px"
  compact-card: "18px"
  card: "20px"
  hero: "22px"
spacing:
  panel-gap: "16px"
  section-gap: "18px"
  card-padding: "22px"
components:
  button-primary: { backgroundColor: "{colors.purple}", textColor: "{colors.card-bg}", rounded: "{rounded.button}", padding: "13px" }
  button-primary-hover: { backgroundColor: "{colors.purple-2}" }
  button-clear: { backgroundColor: "{colors.purple-tint}", textColor: "{colors.purple}", rounded: "{rounded.control}", padding: "10px 16px" }
  input: { backgroundColor: "{colors.input-bg}", textColor: "{colors.text}", rounded: "{rounded.navigation}", padding: "11px 13px" }
  navigation-active: { backgroundColor: "{colors.purple-tint}", textColor: "{colors.purple}", rounded: "{rounded.navigation}", padding: "9px 14px" }
  status-completed: { backgroundColor: "{colors.ok-bg}", textColor: "{colors.ok-fg}", rounded: "{rounded.card}", padding: "4px 11px" }
  card: { backgroundColor: "{colors.card-bg}", textColor: "{colors.text}", rounded: "{rounded.card}", padding: "{spacing.card-padding}" }
---

# Design System: Payli dashboard

## Overview

**Creative North Star: "Existing Payli dashboard"**

Preserve the incumbent light dashboard. Public overview and transaction pages reuse its typography, navigation, cards, filters, and spacing.

**Key Characteristics:**

- Purple actions and selected states on pale surfaces.
- Heavy display figures with compact supporting labels.
- Rounded white cards and subtle shadows.

## Colors

Purple is the primary accent for actions, active navigation, transaction links, and the volume card. Cyan supplies the faint background glow. White cards sit on the pale page background with quiet borders and dark text.

Green, amber, and red pair tinted backgrounds with darker text for completed, pending, and failed status pills. Public pages override muted, muted-2, and faint text with text-3 for stronger contrast.

## Typography

Gabarito serves headings, the wordmark, and financial figures; Plus Jakarta Sans serves labels and body copy. Transaction hashes use the monospace stack. Numeric displays use tabular figures.

The hierarchy uses the frontmatter roles. Supporting text is generally (12–14px); filter labels are uppercase. At the mobile breakpoint, page headings become (21px) and hero figures become (38px).

## Layout

Navigation and content share a centered container (1440px maximum). Desktop content padding is (24px 34px 52px), with section gaps from the spacing tokens. Overview panels and metric tiles wrap with the panel gap.

At (760px), navigation labels and the wordmark hide, content padding becomes (18px 15px 44px), and public metric tiles form two columns. Public activity summaries change from four columns to two; their three trace columns stack vertically. Filters wrap naturally.

## Elevation & Depth

White cards use the shared soft purple shadow and a thin border. The sticky navigation uses a translucent page-colored surface with backdrop blur (10px). Faint cyan and purple blurred circles sit behind content; the volume card keeps its gradient and decorative ring. Exact effects live in the sidecar.

## Shapes

Use the existing rounded controls and cards. Default cards use the card radius; metric and filter cards use compact-card, and the volume card uses hero. Status pills use fully curved ends. Borders and dividers remain thin (1px).

## Components

- **Buttons:** purple primary actions; pale-purple clear actions; small bordered pagination buttons. Existing state transitions use (0.12s ease).
- **Fields:** pale input surfaces, thin borders, compact labels, and a purple-3 border on focus. Filter controls use (9px 11px) padding and the control radius.
- **Navigation:** icon and lowercase label, pale-purple active fill, purple active text, and a faint purple hover fill. Mobile keeps accessible icon links.
- **Cards:** shared white surface, border, and shadow; padding and radius are explicit overrides where needed.
- **Status pills:** lowercase text, bold weight (700), and semantic foreground/background pairs.
- **Public activity:** native expandable rows show route, amount, status, and a trace action. Expanded content presents funding, execution, and delivery; hashes retain copy and explorer controls. Summary focus uses a purple outline (2px).

## Do's and Don'ts

- **Do** reuse the shared components and CSS variables before adding local styles.
- **Do** retain the public text contrast overrides and responsive trace layout.
- **Do** keep labels readable alongside figures and transaction hashes.
- **Don't** replace the inherited palette, fonts, navigation, or card treatment when extending these pages.
- **Don't** introduce another visual system for anonymous views.
