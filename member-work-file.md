# Member Work Plan — Campus Lost & Found

## Project scope

Build a Next.js campus lost-and-found app with account sign-in, searchable lost/found reports, map locations, compressed photo uploads, and a resolved status. The app uses Supabase for Auth, Database, and Storage.

## Team responsibilities

### ภูรินท์ ชัยประสาน — Backend

- Design the Supabase `profiles` and `items` tables and their relationships.
- Configure access policies so users can read public reports and only edit their own reports.
- Implement server-side data access for the home page, item list, item detail, and report status updates.
- Implement or support Server Actions for creating reports and marking reports as resolved.
- Coordinate the Supabase Auth user ID with each user's profile and reports.

### ณภัทร นิรันต์สิทธิรัชต์ — Frontend

- Build the sign-in and registration screens.
- Build the report form UI and the interactive OpenStreetMap/Leaflet location picker.
- Build responsive page layouts and clear loading, error, and empty states.
- Integrate the map picker with the report form's latitude and longitude fields.

### ณัฐกรณ์ แท่นงาม — Frontend

- Build the home page, item list, and item detail interfaces.
- Build the search and category/status filters, keeping filter state in the URL.
- Build the saved reports page and save/unsave controls using `localStorage`.
- Keep report cards and navigation consistent across pages.

### ธนนรินทร์ สายศรธนานันต์ — Fullstack

- Connect the report form to the backend create-report action.
- Add React Hook Form and Zod validation to the report form.
- Process uploaded images with Sharp, then upload them to Supabase Storage and save their paths with the report.
- Integrate the frontend and backend report flows, including authentication checks and resolved status updates.

## Database outline

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
| `status` | `TEXT` | For example, `open` or `resolved` |
| `created_at` | `TIMESTAMPTZ` | Report creation time |

## Shared integration checklist

- [ ] Agree on the final schema and Supabase access policies.
- [ ] Connect the report form, map coordinates, image upload, and create-report action.
- [ ] Verify search/filter URL behavior, saved reports, and report status changes.
- [ ] Review the sign-in flow and access to user-owned reports.
- [ ] Check responsive layouts and error/loading/empty states on mobile and desktop.
