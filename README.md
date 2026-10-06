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

Supabase stores user profiles and item reports. Supabase Auth manages sign-in, and Supabase Storage holds compressed report photos. The `items` table stores each photo's storage path plus the report's latitude and longitude. Saved reports are kept in browser `localStorage` for the first version.

The proposed database tables and responsibilities for each member are documented in [member-work-file.md](./member-work-file.md).

## Day 8 final-project checkpoint

The lecture slides list a 6-point checkpoint, due by 23:59 on the lecture day. Each item is worth 2 points:

- [ ] Deploy a production build to Vercel and confirm its URL opens on another device.
- [ ] Use the Next.js App Router and have at least two working routes, such as `/items` and `/items/[id]`.
- [ ] Have at least one Server Component fetch real data from Supabase.

Record the production URL and the routes/data source used to demonstrate the checkpoint once implementation is ready.

## Day 8 implementation and security notes

- Use Server Actions for creating a report and marking a report as resolved. Show a real pending state and return form errors without a full-page reload.
- Protect `/report` with an auth redirect, and check the current user again inside each Server Action before writing data. A route guard improves navigation but does not replace authorization at the data mutation.
- Keep private keys in `.env.local` during development and Vercel environment variables after deployment. Never expose a Supabase service-role key through a `NEXT_PUBLIC_` variable or client component. Only use public Supabase values in the browser.

## Current status

The front-end mockup is scaffolded with the App Router. Home, listing, detail, report, login, registration, and saved-items routes are present so the flow can be previewed. Search, forms, map selection, authentication, uploads, and saved items are visual-only and do not save or change data.

The visible item cards use clearly labeled sample content. No real Supabase data is fetched yet, so the Server Component real-data checkpoint remains incomplete. The real data source and mutations will be connected in a later project stage.

## Local development

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>. The current visual mockup runs without Supabase credentials because it still uses sample data.

When the Supabase integration is added, copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from the project dashboard. These are the public project URL and publishable key; keep Row Level Security enabled. Never put a Supabase secret/service-role key in a `NEXT_PUBLIC_` variable or commit it. The mockup does not yet read these variables.

To check a production build locally, run `npm run build`.
