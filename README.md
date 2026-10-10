# Campus Lost & Found

A campus lost-and-found web app for reporting missing or found belongings, browsing current reports, and helping items get back to their owners.

**Production:** [react-campus-lost-and-found.vercel.app](https://react-campus-lost-and-found.vercel.app)

**GitHub:** [WindsurfHUB/react-final-project](https://github.com/WindsurfHUB/react-final-project)

## Problem and solution

Lost-and-found announcements in chat rooms and social feeds are easy to miss and difficult to search later. Campus Lost & Found puts lost and found reports in one place. People can browse and filter reports, save useful posts in their browser, view the reported location, and—when signed in—create and manage their own posts.

## Features

- Browse recent lost and found reports and open each report's details.
- Search and filter reports by type, category, and status; filters are represented in the URL.
- Save reports in the current browser and view them on `/saved`.
- Register and sign in with Supabase email/password authentication.
- Create reports with a category, description, date, location name, and map coordinates.
- Manage your own reports on `/my-posts`: edit, delete, or mark an open report as resolved.
- Attach an optional photo. The app validates JPEG, PNG, and WebP input, compresses it to JPEG with Sharp on the server, and stores its path in Supabase Storage.

## Technology

- Next.js 15 App Router and React 19
- JavaScript and JSX (`.js` / `.jsx`); the project does not use TypeScript or TSX
- Supabase PostgreSQL, Auth, and Storage (`@supabase/ssr`, `@supabase/supabase-js`)
- React Hook Form and Zod for report-form validation
- React Leaflet and OpenStreetMap for location selection and display
- Sharp for server-side photo processing
- npm for package management
- Project CSS for the UI; Tailwind CSS is installed

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Latest reports and entry points to browse or report an item |
| `/items` | Search and filter reports |
| `/items/[id]` | Report details, status, location, and optional photo |
| `/report` | Sign-in-protected report form |
| `/my-posts` | Signed-in user's reports and owner controls |
| `/login` | Sign in |
| `/register` | Create an account |
| `/saved` | Reports saved in this browser |
| `/api/items-saved` | Route Handler that returns saved report data for `/saved` |

## Server and Client Components

The default in the App Router is a Server Component. A file opts into a Client Component with the `"use client"` directive when it needs browser APIs, event handlers, or interactive React state.

| File | Component type | Reason |
| --- | --- | --- |
| `app/page.jsx` | Server | Fetches the latest reports from Supabase on the server and renders the page without sending database credentials or query code to the browser. |
| `app/items/page.jsx` | Server | Reads URL search parameters, fetches report data, and renders the filtered results. |
| `app/items/[id]/page.jsx` | Server | Fetches the selected report and current user, then decides whether to render the owner's resolve control. |
| `app/report/page.jsx` | Server | Checks authentication before rendering the protected report page. |
| `app/my-posts/page.jsx` | Server | Checks authentication and fetches only the signed-in user's reports. |
| `components/ReportForm.jsx` | Client | Handles form input, React Hook Form/Zod validation, pending/error/success feedback, photo selection, and map coordinates. |
| `components/AuthForm.jsx` | Client | Handles interactive sign-in and registration with Supabase Auth. |
| `components/ItemFilters.jsx` | Client | Responds to search and filter changes and updates the URL. |
| `components/BookmarkButton.jsx` | Client | Responds to save/unsave clicks and browser storage. |
| `components/OwnerPostActions.jsx` | Client | Handles the owner's edit and delete controls and their feedback. |
| `components/ResolveItemButton.jsx` | Client | Handles the resolve action and pending/error feedback. |
| `components/SiteHeader.jsx` | Client | Reads the browser auth session and manages the mobile navigation menu. |

## Data fetching and rendering

The home, listing, and detail pages use **dynamic server rendering (SSR)** with Supabase queries in Server Components. The pages are configured for dynamic rendering and query current database rows for each request. This fits reports that change frequently and lets the detail/owner views use the current signed-in user's session. The project does not use SSG or ISR for these pages because cached pages could show stale report or ownership state.

Saved-report IDs are stored in the browser's `localStorage`; `/api/items-saved` fetches the corresponding current report data. Report rows and user profiles are stored in Supabase. The schema is in [`supabase/schema.sql`](./supabase/schema.sql).

## Mutations

Writes go through authenticated Next.js Server Actions in [`lib/actions/items.js`](./lib/actions/items.js):

- `createItem` creates a lost/found report.
- `markAsResolved` updates the status of an owned report.
- `updateItem` edits an owned report.
- `deleteItem` deletes an owned report and attempts to remove its photo.

Photo upload and cleanup actions are in [`lib/actions/item-photos.js`](./lib/actions/item-photos.js). Actions re-check the signed-in user; database Row Level Security also restricts writes to the owner. The report form uses React Hook Form with a Zod schema for validation.

## Authentication and middleware

[`middleware.js`](./middleware.js) refreshes the Supabase session and claims. It does not apply an instructor/TA role restriction. The `/report` and `/my-posts` Server Components redirect signed-out visitors to `/login`; write actions and RLS enforce ownership for mutations.

## Team and contribution log

| Member | Role | Contribution |
| --- | --- | --- |
| ภูรินท์ ชัยประสาน (Titan) | Backend | Supabase project, PostgreSQL schema and RLS policies, server-side Supabase client, item queries, and initial create/resolve actions. |
| ณภัทร นิรันต์สิทธิรัชต์ (Nick) | Frontend | Login and registration UI with Supabase Auth, report-form UI, React Hook Form/Zod validation, map picker integration, and accessibility/responsive improvements. |
| ณัฐกรณ์ แท่นงาม (Pond) | Frontend | Home, listing, and detail UI; search and URL-backed filters; saved reports; and responsive presentation of report data and photos. |
| ธนนรินทร์ สายศรธนานันต์ (Windsurf) | Fullstack | Connected report creation and photo processing, protected report flow, owner dashboard, owner edit/delete controls, and signed-in profile navigation. |

See [`member-work-file.md`](./member-work-file.md) for the detailed member checklist and project handoffs.

## Current status and known limitations

- The Vercel production URL is live. The latest local `npm run build` passed.
- A production text-only report was created, shown publicly and in `/my-posts`, edited, resolved, and deleted during a smoke test. The temporary test report was removed.
- Photo upload currently returns `Failed to fetch` in production on two attempts. The upload and attached-photo cleanup flow therefore still need to be fixed and verified.
- CMU single sign-on is not implemented; the current app uses email/password authentication.

## Setup

Requirements: Node.js and npm.

1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env.local`.
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from the Supabase project settings. The legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` is also accepted.
4. Start the development server with `npm run dev` and open <http://localhost:3000>.
5. Run `npm run build` to verify a production build locally.

The `.env*` files are ignored except `.env.example`. Never commit `.env.local` or expose a Supabase service-role key through a `NEXT_PUBLIC_` variable.

## sitemap.xml


## robots.txt


## Client-side global state


## Vercel environment verification


## Production console and hydration check


## Final classroom-network verification
