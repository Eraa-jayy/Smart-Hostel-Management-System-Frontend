# AGENTS.md

## Stack

React 18 + Vite 5 + Tailwind CSS 3. No TypeScript. No ESLint/Prettier configured. No test framework.

## Commands

```bash
npm run dev       # start dev server (localhost:5173)
npm run build     # production build to dist/
npm run preview   # preview production build
```

There is no lint, typecheck, or test command.

## Architecture

**Route-to-role mapping** (enforced by `ProtectedRoute` which reads `localStorage.role`):

| Route prefix | Role constant | Layout | 
|---|---|---|
| `/student` | `STUDENT` | `StudentLayout` |
| `/student-affairs` | `STUDENT_AFFAIRS` | `StudentAffairsLayout` |
| `/subwarden` | `SUB_WARDEN` | `SubWardenLayout` |
| `/maintenance` | `MAINTENANCE` | `MaintenanceLayout` |
| `/canteen` | `CANTEEN` | `CanteenLayout` |
| `/admin` | `ADMIN` | `AdminLayout` |

**Entry point:** `src/main.jsx` -> `src/App.jsx` (all routes defined here with `react-router-dom` v6).

**Auth:** Token and role stored in `localStorage`. Axios interceptor in `src/service/axios.js` attaches `Bearer` token. Backend expected at `http://localhost:8080/api` (hardcoded).

## Conventions

- **All pages are lazy-loaded** with `React.lazy` + `Suspense`. Public pages (HomePage, LoginPage, About) have an artificial 2-second delay.
- **Directory typo:** Image assets are in `src/assests/` (misspelled), not `src/assets/`. Preserve this.
- **Icons:** `lucide-react` throughout.
- **Custom brand colors** override Tailwind's `blue`, `indigo`, `violet`, `purple`, `orange`, `amber`, `emerald`, `teal`, `green`, `red`, `gray`, `slate` palettes with a single `uniNestPalette` in `tailwind.config.js`. Use `brand-500` for the primary brand color (`#212880`).
- **CSS hacks in `index.css`** override hardcoded hex colors (`#0a0f1e`, `#101c5c`, `#000080`, etc.) to `var(--un-primary)`. Prefer using Tailwind brand classes; the CSS overrides exist for legacy inline styles.
- **Font:** Montserrat (loaded via Google Fonts in `index.html`), set as the default `font-sans`.
- **Service files** (`src/service/`) wrap Axios calls per domain (admin, canteen, complaint, maintenance, etc.). `subWardenData.js` is the largest service file.

## Gotchas

- Role matching in `ProtectedRoute` normalizes by stripping underscores and uppercasing (`SUB_WARDEN` -> `SUBWARDEN`).
- `LoginPage` logs credentials to console — no real auth endpoint is wired yet.
- Content arrays (hostels, services, announcements) are hardcoded in `HomePage.jsx` — not from an API.
- Several pages are empty shells (0 bytes): `src/pages/studentAffairs/Notifications.jsx`, `src/pages/studentAffairs/Reports.jsx`, `src/components/studentAffairs/Topbar.jsx`.
- No `.gitignore` exists — `node_modules` and `dist/` are tracked unless added.
