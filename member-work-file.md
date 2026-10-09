# Campus Lost & Found — Member Work Checklist

**Deadline:** October 9, 2026
**Working period:** October 7–9, 2026
**Current stack:** Next.js App Router, React, JavaScript/JSX, Supabase (PostgreSQL, Auth, Storage), and Sharp. Tailwind CSS is installed; the UI mainly uses project CSS. Leaflet/OpenStreetMap, React Hook Form, and Zod remain planned and are not currently implemented/dependencies.

## Instructions for any AI helping a team member

Read this entire file before planning or editing. Then identify the person you are helping: if the member's name or nickname is not already clear from their message, ask **“Which team member am I working with: Titan (ภูรินท์), Nick (ณภัทร), Pond (ณัฐกรณ์), or Windsurf (ธนนรินทร์)?”** and wait for the answer before changing files.

After they answer, use that member's checklist as your main assignment. Start with the earliest unchecked task they own, inspect the current code and Git status, and report any dependency on another member. Do not take over another member's work or silently change ownership. For shared integration tasks, coordinate with the named owner and keep changes limited to the agreed integration. Tick a task only after it is implemented, verified, and usable by the next person; do this immediately before committing and pushing the completed work to that member's branch. Leave started, incomplete, or unverified tasks unchecked. If the checklist conflicts with the code or a new instruction, explain the mismatch and ask the member before changing the plan.

If the completed task unblocks another member, include a short handoff notice at the end of your final reply. Give the recipient, what is ready, the branch and commit/PR link, the verification performed, and the next action. This is the message for the member to share with their teammate; do not claim to have notified anyone unless a message was actually sent.

**Suggested first message:** “I read the project work file. Which member am I working with (Titan, Nick, Pond, or Windsurf), and which unchecked task should I focus on first? I’ll use only that member’s branch.”

## Git safety rules for AI contributions

The GitHub repository has one long-lived branch per member. Use this mapping:

| Member | Nickname | Branch |
| --- | --- | --- |
| ภูรินท์ ชัยประสาน | Titan | `titan` |
| ณภัทร นิรันต์สิทธิรัชต์ | Nick | `nick` |
| ณัฐกรณ์ แท่นงาม | Pond | `pond` |
| ธนนรินทร์ สายศรธนานันต์ | Windsurf | `windsurf` |

Follow these safety rules for every AI contribution:

1. **Identify the owner and branch.** Ask which member you are working with if the name/nickname is unclear. Work only on that member's branch from the table; do not create another branch or push to a teammate's branch.
2. **Use an isolated checkout.** Each member should use their own clone or Git worktree. Do not let two people or AIs edit the same working directory at once. A branch name does not isolate uncommitted files in a shared folder. If another AI is already using that member's branch/checkout, coordinate before editing.
3. **Protect existing work.** Check `git status` before editing, switching, or syncing. If there are changes you did not make, stop and tell the member; do not discard, reset, stash, or overwrite them. Never use `git reset --hard`, `git clean`, or force push as a shortcut.
4. **Keep changes scoped.** Work only on the assigned checklist item. Stage explicit file paths instead of `git add .`; review `git diff` and `git diff --cached` before committing. Do not include another member's changes or `.env.local`/credentials.
5. **Push only to the assigned branch.** Fetch before syncing. If the worktree is clean and the member branch only needs its own latest commits, use a fast-forward update. Commit and push to the exact branch from the table. If Git reports divergence or conflicts, stop and ask the member; never force-push or overwrite remote work.
6. **Review before integration.** Open a pull request from the member's branch to `main`. The team integrator reviews and merges it; AI contributors do not merge to `main` or deploy unless the owner explicitly asks.
7. **Verify and report.** Run relevant checks, tick only the verified completed task, commit/push the task and checkbox together to the member's branch, and report what passed and what remains. Add a handoff notice to the final reply only when another member needs the result.

For a technical guard, the repository owner should protect `main` on GitHub so direct pushes are blocked and integration happens through pull requests. Branch rules in this file guide contributors but cannot enforce GitHub permissions by themselves.

## What is already done

- [x] Public GitHub repository created and connected to the Vercel project.
- [x] Next.js App Router project set up in JavaScript/JSX with a lockfile.
- [x] Mockup routes scaffolded: `/`, `/items`, `/items/[id]`, `/report`, `/login`, `/register`, and `/saved`.
- [x] Sample lost-and-found reports and responsive visual layouts added.
- [x] A production deployment is live at <https://react-final-project-phi-lyart.vercel.app>; recheck after the latest changes deploy.
- [x] Proposal draft documents the four members, project stack, route plan, and initial database schema.

## Current app status (pulled `main` into `windsurf`)

The current `windsurf` checkout includes PR #9 from Pond and the photo-display integration. The home, listing, and detail pages read item rows through Supabase Server Components. `/items` has search and URL-backed filters; `/saved` uses browser `localStorage`; cards and details render a stored public photo URL when `image_path` exists. Login and registration call Supabase email/password Auth. The protected `/report` form calls the authenticated `createItem` Server Action, and the signed-in owner sees the resolve control. Optional images are validated in the browser, compressed with Sharp in the server action, uploaded to the public `item-photos` bucket, and their path is saved to `items.image_path`. The map is still a placeholder: users can enter a location name, but there is no interactive pin or coordinate selection. CMU single sign-on is not implemented.

**Verification record:** The latest pulled version passed `npm run build` and its working tree was clean. `/report` was previously checked to redirect signed-out visitors to `/login`. Complete signed-in checks for sign-up/sign-in, report creation, photo upload/delete, and owner resolution remain outstanding; recheck the latest Vercel deployment anonymously after it finishes. The current source includes the map placeholder and real photo rendering. Do not run `scripts/test-backend-audit.mjs` without approval: it creates an Auth account and performs database writes. The previous attempt was blocked by the safety reviewer.

## Handoff notifications

The checkboxes are the progress flags: each AI updates only its assigned member's checklist, and only after that task is verified and ready for another person to use. Push the checkbox update with the work to that member's branch. Do not add a second status tracker or mark another member's task complete.

When the completed task unblocks another member, include a message like this at the end of the AI reply: `HANDOFF TO [member] — [what is ready] | Branch/commit/PR: [link] | Verified: [checks] | Next: [their task]`. If nobody else needs to act, report the completed work and checks without a handoff message.

## Member checklists

**Priority:** P0 means needed for a usable submission/checkpoint; P1 means finish after P0 if time remains.

### ภูรินท์ ชัยประสาน (Titan) — Backend

- [x] **P0 · Oct 7:** Create/configure the Supabase project and share the required public project URL/key with the team through a safe channel; add placeholder names to `.env.example` and keep real secrets out of Git.
- [x] **P0 · Oct 7:** Create the `profiles` and `items` tables from the proposal. Add the foreign keys, required fields, allowed values for `item_type` (`lost`/`found`) and `status` (`open`/`resolved`), and useful indexes.
- [x] **P0 · Oct 7:** Configure and verify Row Level Security: public users can read open reports; signed-in users can create reports and update only their own reports.
- [x] **P0 · Oct 7–8:** Add the Supabase JavaScript SDK, implement the server-only Supabase client and data queries, and replace the mock read on `/items` and item details with real Supabase data, including sensible empty/error states.
- [x] **P1 · Oct 8:** Implement or finalize the authenticated `createItem` and `markAsResolved` Server Actions. Re-check the user inside each action before writing; return useful success/error results.
- [x] **P0 · Oct 9:** Implement Supabase Server Component reads and database RLS policies; current pages read real item rows.
- [ ] **P0 · Oct 9:** Verify anonymous reads and owner-only writes with a safe permission check. Do not run the backend audit script without approval because it creates accounts and writes data.

### ณัฐกรณ์ แท่นงาม (Pond) — Frontend

- [x] **P0 · Oct 7–8:** Connect `/`, `/items`, and `/items/[id]` to the real report data supplied by ภูรินท์; remove sample-only content from the primary list/detail flow.
- [x] **P1 · Oct 8:** Implement working search and category/status filters on `/items`; keep filter values in the URL so a filtered link can be shared or refreshed.
- [x] **P1 · Oct 8:** Implement save/unsave controls and `/saved` with browser `localStorage`; handle an empty saved list.
- [x] **P1 · Oct 8–9:** Show item type, category, date, location, image when available, and current status on cards/details. Add loading, empty, and error states where needed.
- [x] **P0 · Oct 9:** Implement the home → list → detail flow, URL-backed search/filters, saved items, and photo display. Current build passes.
- [ ] **P1 · Oct 9:** Do a final visual check of navigation and responsive layouts at phone and desktop widths.

### ณภัทร นิรันต์สิทธิรัชต์ (Nick) — Frontend

- [x] **P0 · Oct 7–8:** Implement `/login` and `/register` with Supabase email/password Auth, required-field and password-length checks, pending feedback, inline errors, and signup confirmation feedback. Registration passes `full_name`.
- [x] **P0 · Oct 8:** Provide the basic `/report` fields for lost/found type, title, category, description, date, location, and optional photo; the form is connected to Windsurf's Server Action.
- [ ] **P1 · Oct 9:** Replace the static map placeholder with an interactive OpenStreetMap/Leaflet picker and pass the chosen latitude/longitude and location name into the report form.
- [ ] **P1 · Oct 9:** Check keyboard use and phone-width layout; improve report validation if needed. Current report form uses native required-field validation, not Zod/React Hook Form.
- [ ] **P0 · Oct 9:** Verify signup, email confirmation, and sign-in against the configured Supabase project; implementation is present, but the complete live flow has not been verified.

### ธนนรินทร์ สายศรธนานันต์ (Windsurf) — Fullstack

- [x] **P0 · Oct 7:** Coordinate Supabase setup and environment variable names with ภูรินท์; confirm the app can run locally using documented setup steps without committing credentials.
- [x] **P0 · Oct 8:** Connect the report form to Titan's `createItem` Server Action with pending/error feedback and a success link. Signed-out `/report` redirects to `/login`.
- [x] **P1 · Oct 8:** Implement optional photo upload: validate source type/size, compress with Sharp, upload to Supabase Storage, and store the path on the report. The public bucket and owner-folder policies are configured; Pond's current UI renders the resulting public image URL. Submitting without a photo remains available.
- [x] **P1 · Oct 8–9:** Add `/report` sign-in protection and show the resolve control only to the signed-in report owner; actions re-check authorization server-side.
- [ ] **P0 · Oct 9:** Verify signed-in report creation, photo upload/delete, and owner resolution end to end against Supabase. These paths are implemented but lack a completed live check.
- [ ] **P0 · Oct 9:** Confirm the latest Vercel deployment opens anonymously after this version deploys.
- [ ] **P0 · Oct 9:** Coordinate final smoke-check results and share the production URL, repository link, and any remaining checkpoint limitation with the group.

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

## Remaining work in execution order (October 9)

1. **ณภัทร (Nick):** Implement the interactive map picker and pass coordinates into the report form; check keyboard use and phone-width layout.
2. **ธนนรินทร์ (Windsurf), with Titan:** Walk through signed-in report creation, photo upload/delete, and owner resolution against Supabase. Record any policy or environment issue; do not run the backend audit script without explicit approval because it mutates data.
3. **ภูรินท์ (Titan):** Confirm anonymous reads and owner-only write behavior with a safe verification approach.
4. **ณัฐกรณ์ (Pond):** Check the integrated list/detail/save/photo UI at phone and desktop widths.
5. **ธนนรินทร์ (Windsurf):** Confirm Vercel has deployed the latest version and test the production link anonymously; then share the final URL, repository link, and any known limitation with the group.

## Checkpoint acceptance checklist

- [ ] **Production URL:** A Vercel deployment exists; open the latest deployment anonymously after it finishes.
- [x] **App Router:** Multiple app routes are implemented; repeat the production route check after the latest deploy.
- [x] **Real Server Component data:** Home/list/detail pages call the Supabase data layer from Server Components; actual item data and an uploaded photo were present in the configured project.

## Security and completion checks

- [x] Keep real credentials in local environment files and Vercel variables; `.env*` files are ignored except `.env.example`. Never expose a service-role key in browser code.
- [x] Protect report creation and status changes with authentication checks inside Server Actions and database RLS policies.
- [ ] Verify the signed-in report/photo/resolve flow and latest production URL before submission.
