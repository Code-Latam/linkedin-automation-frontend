# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Marketing/landing site + billing dashboard for **Astrolab Meeting Maker**, an AI-powered LinkedIn automation product. This repo is the *frontend only*; the product app itself lives at `app.meetingmaker.tech` and `intentradar.meetingmaker.tech`. The backend is a separate API reachable at `NEXT_PUBLIC_API_URL`.

Stack: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui + Redux Toolkit.

## Commands

```bash
npm run dev      # start dev server (http://localhost:3000)
npm run build    # production build (next build)
npm run start    # serve the production build
npm run lint     # ESLint (flat config in eslint.config.mjs)
```

- There is **no test suite** and no `test` script.
- Node `24.x` is required (`package.json` `engines`).
- `.npmrc` sets `legacy-peer-deps=true` — install with `npm` using the committed `package-lock.json`.

## Environment

`.env.local` (gitignored) provides all config via `NEXT_PUBLIC_*` vars:

- `NEXT_PUBLIC_API_URL` — backend base URL (e.g. `https://api.meetingmaker.tech`).
- `NEXT_PUBLIC_WHOP_*` — Whop checkout URLs for the billing tiers (read in `app/dashboard/page.tsx`).
- `NEXT_PUBLIC_CHROME_EXTENSION_ID` — the companion Chrome extension.

## Architecture

- **Path alias**: `@/*` → project root (see `tsconfig.json`).
- **Private (unrouted) folders**: Next.js ignores directories prefixed with `_`. `app/_dashboard`, `app/_login`, `app/_onboarding`, and `app/_linkedin` are **not served** — they are legacy/unused code. The active routes are the non-underscore siblings (`app/dashboard`, `app/login`, `app/onboarding`, `app/admin/*`). Stray files like `app/_dashboard/page copy.tsx` and `app/sitemap copy.ts` are also dead.

### Two auth/API patterns coexist (important)

The active public pages and the Redux layer use different auth mechanisms — don't assume one when editing the other:

1. **Active marketing/billing pages** (`app/login`, `app/dashboard`, `app/onboarding`, `app/forgot-password`, `app/reset-password`) use raw `fetch` against `${NEXT_PUBLIC_API_URL}/...` and store a JWT in **`localStorage` under key `token`**. These are plain client components using local `useState`.
2. **Redux/axios layer** (`lib/axios.ts` + `store/slices/*`) uses **`js-cookie`** with `accessToken`/`refreshToken` cookies and auto-refresh on 401. This drives the parked `_dashboard`/`_onboarding`/`_linkedin` pages and the LinkedIn integration — largely unused by the live pages today.

### State management (Redux Toolkit)

- Store defined in `store/index.ts`; wrapped globally via `components/providers/storeProvider.tsx` in `app/layout.tsx`.
- Three slices: `auth` (`store/slices/authSlice.ts`), `linkedIn` (`store/slices/linkedInSlice.ts`), `admin` (`store/adminSlice.ts`).
- Typed hooks in `store/hooks.ts` (`useAppDispatch` / `useAppSelector`).
- The **admin section actually uses Redux** (`state.admin`); login/dashboard currently do not.

### API clients

- `lib/axios.ts` — default `api` instance; base URL `NEXT_PUBLIC_API_URL`; attaches `Authorization: Bearer <accessToken cookie>`; refreshes on 401.
- `lib/admin-api.ts` — separate axios client for `/admin/*`; attaches `X-Admin-API-Key` header from `localStorage['admin_api_key']`; redirects to `/admin/setup` on 401. Exposes a typed `adminApi` object listing every admin endpoint (clients, commissions, agents, pipeline, system health, inbound, trends, alerts).

### Backend integrations

- `/auth/*` — signup, login, me, change-password, refresh.
- `/unipile/*` — LinkedIn OAuth link creation, connection status, and profile fetch (`store/slices/linkedInSlice.ts`).
- `/admin/*` — client/commission/agent/health management.
- Whop — billing is handled by redirecting to checkout URLs from `.env.local` (no client-side billing API).

### UI & content conventions

- **shadcn/ui** (new-york style, `components.json`): shared components in `components/ui/*`; icons via `lucide-react`; `cn()` helper in `lib/utils.ts`. CSS variables live in `styles/globals.css`.
- **Content-as-data**: marketing copy is centralized in `lib/text/*.ts` (hero, features, pricing, faqs, howitworks, contact, navbar, footer) and SEO metadata in `lib/metadata.ts` (`pagesMetaData`, keyed per page). The homepage (`app/page.tsx`) composes sections from `components/landing/*`.
- **Onboarding flow**: step definitions in `lib/onboardingsteps.ts` (`ONBOARDING_STEPS`), rendered by `components/onboarding/*-step.tsx`.
- Dashboard/leads UI lives in `components/dashboard/*` (uses `@tanstack/react-table` and `recharts`).

## Deployment

Azure Static Web Apps via `.github/workflows/azure-static-web-apps-proud-tree-0fc1a2610.yml` — builds and deploys automatically on push to `main` and on PRs. `next.config.ts` sets `output: 'standalone'` and allows remote images from `randomuser.me` and `media.licdn.com`.
