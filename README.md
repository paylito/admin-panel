# payli — owner dashboard

Internal owner/admin dashboard for **Payli**, a crypto payment gateway. Light
theme, fully responsive (desktop + mobile), built with **Vite + React 18 +
TypeScript** and **React Router**. Backed by the live Payli admin API.

## Pages

| Route        | Page      | Summary                                                              |
| ------------ | --------- | ------------------------------------------------------------------- |
| `/`          | overview  | volume, revenue, pending payouts, KPI tiles, payment methods, top merchants, recent payments |
| `/payments`  | payments  | filterable, paginated list of every payment                          |
| `/merchants` | merchants | paginated list of businesses (paid out, revenue)                    |
| `/donatees`  | donatees  | paginated list of donation recipients                               |

A login screen gates the whole app.

## Develop

```bash
npm install
npm run dev      # vite dev server (proxies /admin → the API)
npm run build    # tsc -b && vite build
npm run lint     # oxlint
```

The dev server proxies `/admin`, `/config`, `/health` to the API. Defaults to
`http://localhost:3030`; override with `VITE_PROXY_TARGET`. In the browser the
app calls relative `/admin/*` URLs, so production just needs the panel served
from the same origin as the API — or set `VITE_API_BASE` for a cross-origin API.

## Auth & data flow

- **Login** (`POST /admin/login` with `id` + `secret`) returns a JWT, stored in
  `localStorage` (`payli.admin.token`). `src/auth/` holds the provider + hook.
- **On every load**, if a token exists the app shows a **full-screen loader**
  and bulk-fetches everything it needs — overview, all payments, all merchants,
  all donatees (paging through each endpoint) — via `loadAll()` in
  `src/api/client.ts`. The result is held in `src/data/AppDataContext.ts` and
  pages render from it (client-side filtering + pagination).
- If any request returns **401/403** (missing / expired / invalid token), the
  token is cleared and the user is sent back to the login screen. A logout
  button in the nav does the same.

## Architecture

- **`src/api/client.ts`** — `fetch` wrapper (`ApiError`), typed endpoints, and
  `loadAll()`. Augments list items with a client-side avatar color.
- **`src/auth/`** — `context.ts` (context + `useAuth`) and `AuthContext.tsx`
  (the provider).
- **`src/data/AppDataContext.ts`** — `useData()` for the fetched payload.
- **`src/lib/`** — `format.ts` (compact money, percentages, pagination helpers),
  `constants.ts` (avatar palette, asset colors, filter options, null-safe
  helpers), `useMediaQuery.ts` (mobile breakpoint `max-width: 760px`).
- **`src/components/`** — shared UI (`Layout`, `Card`, `Pagination`,
  `FullScreen`, `Avatar`, `StatusPill`, `StatStrip`, `Sparkline`, cells).
- **`src/pages/`** — `Login` + one component/CSS-module per route.

Styling uses **CSS Modules** with design tokens in `src/index.css`. Fonts:
Gabarito (display/numbers) + Plus Jakarta Sans (body) via Google Fonts.

### Notes on the API payload

- Payment `usd` and `date` arrive pre-formatted; `asset` / `network` / `crypto`
  / `payoutTx` are `null` until a payment is `completed` (rendered as a muted
  em-dash). Merchant/donatee names, usernames, and handles are nullable.
- `/admin/overview` returns raw KPI numbers but **no trend series or growth
  deltas**, so the hero sparkline and the ▲% pills only render if the API later
  adds `volumeSeries` / `volumeDelta` (the components are wired for it).
