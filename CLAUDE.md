# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server
- `npm run build` — Production build
- `npm run lint` — oxlint (`.oxlintrc.json`, react + oxc plugins)
- `npm run preview` — Preview production build

No test runner is configured.

## Repository Structure

```
playbook-ui-v1/
├── public/               # Static assets (favicon)
├── src/
│   ├── api/              # Fake backend: validation, latency(), ApiError, newId()
│   ├── components/       # App shell, RequireRole route guard, SportBadge, shared UI primitives (ui.jsx)
│   ├── features/         # Feature UI pieces, grouped by area
│   │   ├── admin/        # ApprovalQueue, StatsBars, UserTable
│   │   ├── booking/      # DateStrip, SlotGrid, CheckoutDialog, BookingSummary, StarRating
│   │   ├── owner/        # OwnerCalendar, VenueForm, StatCard
│   │   └── venues/       # VenueCard, VenueFilters, AmenityChips
│   ├── lib/              # Domain logic: slots, money, ratings, theme
│   ├── routes/           # Route-level page components
│   ├── seed/             # Demo venues, users, bookings
│   ├── store/            # AppStore, useStore context, slice reducers
│   ├── App.jsx           # Root component — store + router + routes
│   ├── main.jsx          # Entry point
│   └── index.css         # Tailwind config: theme colors, dark variant, custom utilities
├── .oxlintrc.json        # oxlint config
├── vite.config.js        # Vite configuration
└── index.html            # HTML entry point
```

**Where to look:**

- Adding a new page → `src/routes/` + register route in `App.jsx` (wrap in `RequireRole` if role-restricted)
- Shared UI → `src/components/ui.jsx`
- Feature-specific UI → `src/features/<area>/`
- New mutation → fake API function in `src/api/` + action in `src/store/AppStore.jsx` + reducer case in `src/store/reducers/`
- Slot / pricing / rating rules → `src/lib/`
- Demo data changes → `src/seed/`
- Theme colors and reusable classes → `src/index.css`

## Git Conventions

### Branching

```
feature/add-venue-search               # New features
fix/slot-conflict-on-midnight          # Bug fixes
docs/update-readme                     # Documentation only
chore/upgrade-dependencies             # Maintenance, tooling
refactor/split-booking-reducer         # Code refactoring
style/mobile-slot-grid-spacing         # Visual/style changes
```

- Branch off `main` for all new work
- Keep branches short-lived; open a PR when ready
- Delete branches after merging

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add sport filter to explore page
fix: block booking of past slots
docs: update README with demo accounts
chore: upgrade vite to v8.3
refactor: extract slot state logic into lib/slots
style: fix spacing on mobile venue cards
```

- Use present tense, lowercase, no period at the end
- Keep the subject line under 72 characters
- Add a body for non-obvious changes

### Pull Requests

- PR title should match the commit message format
- Include a summary and test plan in the PR description
- Target `main` as the base branch

## Coding Standards

### General

- No TypeScript — plain JSX throughout; do not add `.ts`/`.tsx` files
- Functional components only — no class components
- One component per file with a **default export** matching the file name (e.g. `VenueCard.jsx` → `export default function VenueCard`). Exception: small shared primitives are named exports from `src/components/ui.jsx`
- Keep components focused — area-specific pieces go in `src/features/<area>/`, cross-cutting ones in `src/components/`

### Styling

- Use Tailwind CSS utility classes — no CSS modules. Inline `style` only for truly dynamic values (e.g. bar widths in `StatsBars`)
- Reuse the custom utilities from `src/index.css` (`card`, `btn`, `btn-primary`, `btn-ghost`, …) and `pitch-*`/`volt` colors instead of repeating long class lists
- Follow mobile-first responsive design (`sm:`, `md:`, `lg:` breakpoints)
- Dark mode uses Tailwind `dark:` variants (class-based, `.dark` on `<html>` via `src/lib/theme.js`) — include them on all new UI

### State & Data

- All shared state lives in the single store (`AppStore`) — no external state library, no extra contexts for app data
- Components never import from `src/api/` directly; they call `actions` from `useStore()`
- Fake API functions must `await latency()`, validate and throw `ApiError` with a user-facing message, and return the new/changed entity without mutating state
- Show `ApiError` messages via react-hot-toast
- Dates are `yyyy-MM-dd` string keys (`toDateKey`); booking `hours` are integer start hours
- Changing the persisted state shape requires a migration or bumping the `playbook:v1` storage key

### Naming

- Components: PascalCase (e.g. `VenueCard.jsx`)
- Variables/functions: camelCase
- Constants: UPPER_SNAKE_CASE (e.g. `FEE_RATE`, `DEFAULT_FILTERS`)
- Action types: `slice/pastTenseEvent` (e.g. `bookings/created`, `venues/blockToggled`)

### Lint

oxlint (`.oxlintrc.json`): `react/rules-of-hooks` is an error; `react/only-export-components` warns (constant exports allowed). Run `npm run lint` before committing.

## Architecture

React 19 SPA using Vite 8, Tailwind CSS 4, and React Router 7. No TypeScript — plain JSX throughout. PlayBook is a sports-venue booking app: players book hourly slots, owners list venues, admins approve them.

### State Management

A single reducer-based store in **`src/store/AppStore.jsx`** holds `{ auth: { users, sessionId }, venues, bookings }`. `rootReducer` delegates to slice reducers in `src/store/reducers/` (`authReducer`, `venueReducer`, `bookingReducer`).

- Components use `useStore()` from `src/store/context.js`, which returns the state plus derived `currentUser`, `users`, and an `actions` object.
- Actions read the latest state via `stateRef`, so `actions` keeps the same identity across renders. Async actions call the fake API first, then dispatch the returned entity.

Provider nesting (in `App.jsx`): `AppStore` → `BrowserRouter`.

### Data Layer

Uses **mock data** with localStorage persistence — no real backend. `src/api/` (`bookings.js`, `venues.js`, `users.js`) simulates async calls using `latency()` from `src/api/fakeApi.js`. Initial data comes from `src/seed/`; seed bookings are dated relative to today.

Key localStorage keys: `playbook:v1` (entire store, cross-tab synced via the `storage` event, keeping each tab's own session), `playbook:theme`. The sidebar ↺ button dispatches `store/reset` to reseed.

Shared domain logic in `src/lib/`:
- `slots.js` — `buildSlots` tags slots `free | booked | blocked | past`; `findConflicts` prevents double-booking. Owner blocks live on `venue.blocked: [{ date, hour }]`.
- `money.js` — INR formatting, `priceBreakdown` with 2% convenience fee.
- `ratings.js` — venue ratings are derived from past bookings' `rating`, not stored on venues.

Venue lifecycle: new venues start `pending` → admin sets `approved`/`rejected`; editing a `rejected` venue returns it to `pending`. Only `approved` venues accept bookings; venues with upcoming bookings cannot be deleted. Suspended users cannot sign in.

### Routing & Roles

Three roles with route protection via `RequireRole` (`src/components/RequireRole.jsx`):
- **player** — `/bookings`
- **owner** — `/owner`, `/owner/venues/new`, `/owner/venues/:venueId`
- **admin** — `/admin`

Public: `/`, `/venues/:venueId`, `/signin`, `/signup`.

Demo accounts: `player@playbook.dev` / `player123`, `owner@playbook.dev` / `owner123`, `admin@playbook.dev` / `admin123`.

### Key Libraries

- lucide-react for icons
- react-hot-toast for notifications
- date-fns for date handling
