# Ellis — Outdoor Care

> Landscaping and outdoor services — lawn care, exterior wash, and more. Priced service list, reviews, and consultation booking for an outdoor services business.

---

## Description

Ellis is a re-themed variant of a small-business site template (Next.js Pages Router + TypeScript). Guests can browse services with pricing, read and leave reviews, and request a consultation. An admin panel manages account credentials; page content is curated in code.

## Features

**Public**
- **Home** — hero, services overview, work highlights, call to action
- **Services** — priced service list (lawn care, exterior wash, and more)
- **Work** — services and pricing section
- **Reviews** — guests can submit a title, description, optional name, and optional image
- **Consultation** — booking form with date and time picker

**Admin**
- JWT auth with HTTP-only cookies and bcrypt password hashing
- Admin overview + credential settings (`/admin`, `/admin/settings`)

**Technical notes**
- Next.js Pages Router with API routes
- Upstash Redis for credentials and reviews
- Every Redis key is namespaced per site (see `SITE_ID` below), so multiple site variants can share one Redis database safely
- Mobile-first responsive layout

## How To Use

### Installation

1. Fork or clone the repository and check out the `landscape` branch
2. Install dependencies: `npm install`
3. Copy the env vars below into `.env.local`
4. Start the dev server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

### Development Commands

- `npm run dev` — start development server with hot reload
- `npm run build` — create production build
- `npm start` — run production build locally
- `npm run lint` — run ESLint

### Admin Access

1. Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in your environment — there are no default credentials.
2. Open any page and choose Admin Login in the navigation.
3. Admin routes: `/admin` (overview), `/admin/settings` (update credentials).

### Environment Variables

```env
JWT_SECRET=your-secret-key-change-in-production
KV_REST_API_URL=https://your-redis-instance.upstash.io
KV_REST_API_TOKEN=your-redis-token
ADMIN_USERNAME=choose-an-admin-username
ADMIN_PASSWORD=choose-a-strong-password
# Optional: override the Redis key namespace (defaults to "ellis-outdoor").
SITE_ID=ellis-outdoor
```

**Required:** `JWT_SECRET`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `ADMIN_USERNAME`, `ADMIN_PASSWORD` (the app throws at startup if the admin credentials are unset).

**Optional:** `SITE_ID` — prefix applied to every Redis key (`<SITE_ID>:<key>`). Give each deployment a unique `SITE_ID` if several sites share one Upstash database. Note: keys written before namespacing (unprefixed) are not read once this is deployed — migrate old data to `<SITE_ID>:<key>` if needed.

### Project Structure

```
├── pages/                 Next.js pages and API routes
│   ├── api/               Auth, reviews, consultation/lead capture
│   └── admin/             Admin overview + settings
├── src/
│   ├── components/        UI and admin shell
│   ├── pages/             Page views (Home, Services, Work, Reviews, ...)
│   └── styles/            SCSS partials
├── public/img/            Site images
├── lib/                   Auth, Redis helpers (SITE_ID namespacing), constants
└── package.json           (name: ellis-outdoor)
```

### Deployment

Deployed on Vercel:

1. Push code to GitHub
2. Import the project in Vercel, set the `landscape` branch as the production branch
3. Set Framework Preset to Next.js
4. Add the environment variables above
5. Deploy

## License

MIT License

Copyright (c) [2026] [Eric Capiz]

---

## Author Info

- LinkedIn [@ericcapiz](https://www.linkedin.com/in/eric-capiz/)
