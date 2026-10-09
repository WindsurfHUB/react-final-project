# Campus Lost & Found

A campus web app where students and staff can report lost or found items, search existing reports, and contact the person who posted them. Each report can include a photo and a pin on a map, so people can identify where an item was lost or found.

## Project goals

- Make lost-and-found posts easier to search than posts in chat or social media feeds.
- Let signed-in campus users create reports and update their status when an item is returned.
- Show useful report details, including category, date, location, photo, and map coordinates.

## Planned pages

| Route | Purpose |
| --- | --- |
| `/` | Latest reports and links to browse or create a report |
| `/items` | Search and filter lost/found reports; filters are reflected in the URL |
| `/items/[id]` | Report details, photo, map location, and contact information |
| `/report` | Signed-in users create a lost/found report |
| `/login` | Sign in with a user account |
| `/register` | Create a user account |
| `/saved` | Reports saved in the current browser |

## Planned technology

- Next.js App Router and React
- JavaScript with JSX (`.js` / `.jsx`), following the course starter; no TypeScript or TSX
- Tailwind CSS
- Supabase Database (PostgreSQL), Auth, and Storage
- React Hook Form and Zod for form handling and validation
- OpenStreetMap with Leaflet for selecting and showing locations
- Sharp for server-side image resizing and compression

`npm` is the package manager used to install and run the project. It does not determine whether files use JSX or TSX; this project is planned in JavaScript/JSX.

## Data and uploads

Supabase stores user profiles and item reports. Supabase Auth manages sign-in. The report form accepts JPEG, PNG, and WebP images, compresses them to JPEG on the server, and stores the resulting path in `items.image_path`. The `item-photos` bucket is public for viewing; authenticated users can upload and delete only within their own user-ID folder. The bucket accepts JPEG output up to 4 MiB. The form also stores the report's latitude and longitude when a map picker supplies them. Saved reports are planned for browser `localStorage`.

The proposed database tables and responsibilities for each member are documented in [member-work-file.md](./member-work-file.md).

## Implementation and security notes

- Use Server Actions for creating a report and marking a report as resolved. Show a real pending state and return form errors without a full-page reload.
- Protect `/report` with an auth redirect, and check the current user again inside each Server Action before writing data. A route guard improves navigation but does not replace authorization at the data mutation.
- Keep private keys in `.env.local` during development and Vercel environment variables after deployment. Never expose a Supabase service-role key through a `NEXT_PUBLIC_` variable or client component. Only use public Supabase values in the browser.

## Current status

The home, listing, and detail pages query report data from Supabase. The login and registration forms use Supabase email/password authentication, and signed-in owners can mark their reports as resolved. The signed-in report form now calls `createItem` and shows pending, error, and success feedback. The optional image path uses Sharp and Supabase Storage, pending bucket and policy setup. The interactive map remains a placeholder; a location name can be entered manually.

Search and URL filters, saved reports, interactive map selection, and rendering stored photos on cards/details are not wired yet. The complete sign-up, sign-in, email-confirmation, and report flows still need verification against the configured Supabase project. CMU single sign-on is not implemented.

## Local development

```bash
npm ci
npm run dev
```

Before starting the app, copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` using the Supabase project settings. The app also accepts the legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` in place of the publishable key. Keep these public keys under RLS; never put a service-role or secret key in a `NEXT_PUBLIC_` variable.

The `.env*` files are ignored by Git except `.env.example`; do not commit `.env.local` or real credentials.

Open <http://localhost:3000> after `npm run dev` starts.

To check a production build locally, run `npm run build`.
