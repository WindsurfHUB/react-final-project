# Campus Lost & Found — Member Work Checklist

**Deadline:** October 9, 2026
**Working period:** October 7–9, 2026
**Stack:** Next.js App Router, React, JavaScript/JSX, Tailwind CSS, Supabase (PostgreSQL, Auth, Storage), Leaflet/OpenStreetMap, React Hook Form, Zod, and Sharp.

## Instructions for any AI helping a team member

Read this entire file before planning or editing. Then identify the person you are helping: if the member's name is not already clear from their message, ask **“Which team member am I working with: ภูรินท์, ณภัทร, ณัฐกรณ์, or ธนนรินทร์?”** and wait for the answer before changing files.

After they answer, use that member's checklist as your main assignment. Start with the earliest unchecked task they own, inspect the current code and Git status, and report any dependency on another member. Do not take over another member's work or silently change ownership. For shared integration tasks, coordinate with the named owner and keep changes limited to the agreed integration. Mark a checkbox complete only after verifying the change exists and works; never treat a plan or mockup as completed functionality. If the checklist conflicts with the code or a new instruction, explain the mismatch and ask the member before changing the plan.

**Suggested first message:** “I read the project work file. Which member am I working with, and which unchecked task should I focus on first?”

## Git safety rules for AI contributions

The GitHub repository is shared by the whole team. These rules are required to avoid overwriting another member's work:

1. **Use an isolated checkout.** Each member should use their own clone or Git worktree and their own task branch, for example `work/nattakorn-item-filters`. Do not let two people or AIs edit the same working directory at the same time. Switching branches in one shared directory does not isolate uncommitted files.
2. **Protect existing work.** Before editing or switching branches, inspect `git status`. If there are changes you did not make, stop and tell the member; do not discard, reset, stash, or overwrite them. Never use `git reset --hard`, `git clean`, or a force push as a shortcut.
3. **Keep changes scoped.** Work only on the assigned checklist item. Stage explicit file paths rather than using `git add .`; review both `git diff` and `git diff --cached` before committing. Do not include another member's changes or `.env.local`/credentials.
4. **Push a branch, not `main`.** Commit to your own task branch and push only that branch. Open a pull request into `main`; have a teammate review it and resolve conflicts before merging. Do not push directly to `main`, merge another member's branch, or force-push unless the repository owner explicitly requests that exact action.
5. **Verify before handing off.** Run the relevant build/checks, report what passed and what remains, and give the branch/PR link. Only the agreed integrator should merge reviewed work and deploy it.

For a technical guard, the repository owner should protect `main` on GitHub so direct pushes are blocked and changes go through pull requests. If repository settings or the deadline make that impractical, branch names and review instructions are only a team convention, not a hard block; still keep isolated checkouts and have the integrator review and merge one branch at a time. Do not share a single editing checkout as a substitute for branches.

## What is already done

- [x] Public GitHub repository created and connected to the Vercel project.
- [x] Next.js App Router project set up in JavaScript/JSX with a lockfile.
- [x] Mockup routes scaffolded: `/`, `/items`, `/items/[id]`, `/report`, `/login`, `/register`, and `/saved`.
- [x] Sample lost-and-found reports and responsive visual layouts added.
- [x] Production deployment is live at <https://react-final-project-phi-lyart.vercel.app>; anonymous HTTP checks returned 200 for all seven routes.
- [x] Proposal draft documents the four members, project stack, route plan, and initial database schema.

## Current gap

The current site is a visual mockup. Search, filters, saved items, authentication, report submission, map selection, uploads, and status changes do not yet persist or use Supabase. The real-data Server Component checkpoint is still incomplete: `/items` currently reads sample content from `lib/demo-items.js`.

## Member checklists

**Priority:** P0 means needed for a usable submission/checkpoint; P1 means finish after P0 if time remains.

### ภูรินท์ ชัยประสาน — Backend

- [ ] **P0 · Oct 7:** Create/configure the Supabase project and share the required public project URL/key with the team through a safe channel; add placeholder names to `.env.example` and keep real secrets out of Git.
- [ ] **P0 · Oct 7:** Create the `profiles` and `items` tables from the proposal. Add the foreign keys, required fields, allowed values for `item_type` (`lost`/`found`) and `status` (`open`/`resolved`), and useful indexes.
- [ ] **P0 · Oct 7:** Configure and verify Row Level Security: public users can read open reports; signed-in users can create reports and update only their own reports.
- [ ] **P0 · Oct 7–8:** Add the Supabase JavaScript SDK, implement the server-only Supabase client and data queries, and replace the mock read on `/items` and item details with real Supabase data, including sensible empty/error states.
- [ ] **P1 · Oct 8:** Implement or finalize the authenticated `createItem` and `markAsResolved` Server Actions. Re-check the user inside each action before writing; return useful success/error results.
- [ ] **P0 · Oct 9:** Verify that a Server Component fetches real Supabase data and that unauthorized writes are rejected by the database policies.

### ณัฐกรณ์ แท่นงาม — Frontend

- [ ] **P0 · Oct 7–8:** Connect `/`, `/items`, and `/items/[id]` to the real report data supplied by ภูรินท์; remove sample-only content from the primary list/detail flow.
- [ ] **P1 · Oct 8:** Implement working search and category/status filters on `/items`; keep filter values in the URL so a filtered link can be shared or refreshed.
- [ ] **P1 · Oct 8:** Implement save/unsave controls and `/saved` with browser `localStorage`; handle an empty saved list.
- [ ] **P1 · Oct 8–9:** Show item type, category, date, location, image when available, and current status on cards/details. Add loading, empty, and error states where needed.
- [ ] **P0 · Oct 9:** Check navigation and the home → list → detail flow at desktop and mobile widths; fix issues found during the team walkthrough.

### ณภัทร นิรันต์สิทธิรัชต์ — Frontend

- [ ] **P0 · Oct 7–8:** Turn `/login` and `/register` mockups into usable forms connected to Supabase Auth; show validation, pending, success, and error states.
- [ ] **P0 · Oct 8:** Finish the `/report` form UI for lost/found type, title, category, description, date, location, photo, and map coordinates. Validate required fields with Zod/React Hook Form in coordination with ธนนรินทร์.
- [ ] **P1 · Oct 8:** Make the Leaflet/OpenStreetMap picker interactive and pass the selected latitude/longitude and location name to the report form.
- [ ] **P0 · Oct 9:** Check that form controls are keyboard-usable and layouts work at phone width; fix visible validation and error-state issues.

### ธนนรินทร์ สายศรธนานันต์ — Fullstack

- [ ] **P0 · Oct 7:** Coordinate Supabase setup and environment variable names with ภูรินท์; confirm the app can run locally using documented setup steps without committing credentials.
- [ ] **P0 · Oct 8:** Connect ณภัทร’s validated report form and map values to ภูรินท์’s `createItem` Server Action. Show a pending state and display returned field/server errors.
- [ ] **P1 · Oct 8:** Implement the photo flow: validate size/type, compress with Sharp on the server, upload to the Supabase Storage bucket, and store the resulting path on the report.
- [ ] **P1 · Oct 8–9:** Wire sign-in protection for `/report` and connect the report owner’s resolve control to `markAsResolved`; coordinate authorization checks with ภูรินท์.
- [ ] **P0 · Oct 9:** Deploy the integrated app to Vercel, add required environment variables, and verify the production URL in an anonymous/incognito session and on another device if available.
- [ ] **P0 · Oct 9:** Coordinate the final smoke test, capture the production URL and GitHub link, and make sure the team knows which checkpoint item is still incomplete, if any.

## Shared database outline

### `profiles`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `UUID` | Primary key; references `auth.users.id` |
| `display_name` | `TEXT` | Name shown in the app |
| `created_at` | `TIMESTAMPTZ` | Profile creation time |

### `items`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `UUID` | Primary key |
| `user_id` | `UUID` | Foreign key referencing `profiles.id` |
| `item_type` | `TEXT` | `lost` or `found` |
| `title` | `TEXT` | Item name |
| `category` | `TEXT` | Item category |
| `description` | `TEXT` | Additional details |
| `location_name` | `TEXT` | Place where the item was lost or found |
| `latitude` | `NUMERIC(9,6)` | Map latitude |
| `longitude` | `NUMERIC(9,6)` | Map longitude |
| `image_path` | `TEXT` | Path to the photo in Supabase Storage |
| `occurred_at` | `TIMESTAMPTZ` | Date and time lost or found |
| `status` | `TEXT` | `open` or `resolved` |
| `created_at` | `TIMESTAMPTZ` | Report creation time |

Saved reports remain in browser `localStorage` for this version, so they do not need a database table.

## Three-day execution order

### October 7 — Establish real data

1. ภูรินท์ creates the Supabase project, schema, RLS policies, and first real-data query.
2. ธนนรินทร์ documents the environment setup and connects the app to the shared Supabase configuration.
3. ณัฐกรณ์ connects the listing/detail routes to the query; ณภัทร prepares the auth/report forms for integration.

### October 8 — Complete the main user flows

1. ภูรินท์ finishes the create/resolve actions and verifies authorization.
2. ณภัทร connects login/register, report validation, and the map picker.
3. ธนนรินทร์ connects the form to `createItem` and implements the photo upload flow.
4. ณัฐกรณ์ finishes URL-based filters and saved items, then integrates the live list/detail states.

### October 9 — Stabilize and submit

1. All four members walk through register/login → browse/search → view details → submit a report → mark resolved.
2. ภูรินท์ verifies real server-side reads and Supabase access policies; ณภัทร and ณัฐกรณ์ fix UI/mobile issues; ธนนรินทร์ owns the final deploy and anonymous URL check.
3. ธนนรินทร์ posts the final Vercel/GitHub links to the group; all members confirm the checkpoint answers reflect what actually works.

## Checkpoint acceptance checklist

- [x] **Production URL:** Vercel URL opens anonymously; recheck after the final deployment.
- [x] **App Router:** At least two routes exist and respond; recheck the final user flow after integration.
- [ ] **Real Server Component data:** A Server Component fetches actual rows from Supabase. The present mockup does not satisfy this yet; ภูรินท์ owns the query and ณัฐกรณ์ integrates it into the list/detail UI.

## Security and completion checks

- [ ] Keep real credentials in local `.env.local` and Vercel environment variables; never commit secrets or expose a Supabase service-role key to browser code.
- [ ] Protect report creation and status changes with authentication checks inside the Server Actions and database RLS policies.
- [ ] Before the deadline, verify the production build, all important routes, the report flow, and anonymous access to the Vercel URL.
