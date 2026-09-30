# PlayBook

Book sports courts by the hour: football turfs, badminton courts, cricket nets, tennis and pickleball.

Players browse venues and pick free hourly slots on a live availability grid. Venue owners list courts, block slots for maintenance and track revenue. Admins approve new listings and manage accounts.

Built with React 19, Vite, Tailwind CSS 4, React Router, date-fns, lucide-react and react-hot-toast. There's no backend: a small fake API layer (`src/api`) adds latency and validation, and all data is saved to `localStorage`.

## Run it

```bash
npm install
npm run dev
```

## Demo accounts

| Role   | Email                 | Password    |
| ------ | --------------------- | ----------- |
| Player | `player@playbook.dev` | `player123` |
| Owner  | `owner@playbook.dev`  | `owner123`  |
| Admin  | `admin@playbook.dev`  | `admin123`  |

The sign-in page has one-click buttons that fill these in. The ↺ button in the sidebar resets all demo data.

## Features

**Players**
- Filter venues by sport, city and max price, and sort by popularity, rating or price
- 7-day date strip and hourly slot grid showing booked, blocked and past slots
- Checkout with a 2% convenience fee (demo payment, no card details)
- My bookings: upcoming, past and cancelled; cancel upcoming games; rate past ones 1–5 stars

**Venue owners**
- Revenue, next-7-days, venue count and average rating at a glance
- Add or edit venues (sport, price, opening hours, amenities). New venues wait for admin approval
- 14-day schedule: see who booked each slot, and tap a slot to block or reopen it

**Admins**
- Approve or reject venue listings
- Hours booked per sport and top venues by revenue
- User list with suspend and reinstate

## Structure

```
src/
  api/        fake backend: validation, latency, id generation
  store/      one reducer-based store with localStorage persistence and cross-tab sync
  lib/        slot generation and conflict checks, pricing, ratings, theme
  seed/       demo venues, users, bookings
  features/   venues, booking, owner and admin UI pieces
  routes/     pages
  components/ app shell, route guard, shared UI
```

Open the app in two tabs to watch the cross-tab sync: a slot booked in one tab shows as taken in the other.
