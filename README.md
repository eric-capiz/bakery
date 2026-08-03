# Sweet Dreams Bakery

![Project Image](https://i.ibb.co/cPTphPC/s.jpg)

> Custom bakery site for browsing sample cakes, reading reviews, and booking a consultation with the baker.

---

## Table of Contents

- [Description](#description)
- [Business Sites](#business-sites)
- [Planned Features](#planned-features)
- [Features](#features)
- [Future Features](#future-features)
- [Build steps](#build-steps)
- [Technologies and Libraries](#technologies-and-libraries)
- [How To Use](#how-to-use)
- [Admin Access](#admin-access)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [License](#license)
- [Author Info](#author-info)

---

## Description

Site for a custom bakery that specializes in personalized cakes for any occasion. Guests can explore a sample gallery, leave reviews, learn about the baker, and request a consultation. An admin panel manages images, page copy, and account credentials through Redis backed APIs.

The same codebase has been extended into additional small-business site variants on separate branches. Each is meant to deploy as its own Vercel project (own domain, env vars, and Redis/KV) so admin changes stay isolated per business.

### Business Sites

| Business | Branch | Notes |
|----------|--------|--------|
| Bakery | `main` | Original Sweet Dreams / bakery site |
| Florist | `florist` | Flower shop (Brume) with gallery, about, reviews, booking |
| Mechanic | `mechanic` | Auto shop + mobile service with shop/mobile pricing |
| Landscaping | `landscape` | Outdoor care (ELLIS): grounds, power washing, mobile detailing |

Default admin login on the florist, mechanic, and landscape branches is `breezy` / `breezy` (changeable in admin settings).

**Deploy tip:** Create one Vercel project per branch, set that branch as the Production Branch, and use a separate Redis/KV database for each project.

### Planned Features

Interactive tools that turn each site from a brochure into a full product:

**Bakery (`main`)**
- Build-your-pastry flow (in progress): customers configure cake/pastry options and see a sample preview of what they are requesting, then submit for booking.

**Florist (`florist`)**
- Bouquet builder: choose size/style, custom vase, and add-ons (teddy bear, chocolate, card, etc.), with a composed preview and price range before booking.

**Mechanic (`mechanic`)**
- Service quote estimator: enter vehicle details and needed work, then show an estimate with parts, labor hours, and a clear non-binding total range (final price after inspection).

**Landscaping (`landscape`)**
- Grounds intake: grass type, approx lawn dimensions, weed pulling / gardening, flowers, fruits, veggies.
- Power washing: enter surface dimensions (and surface type) for an estimate range.
- Car detailing: car type/details plus optional photo upload so the admin can see condition and send a real quote (photos aid review; they do not auto-price dirtiness).

### Features

**Public**
- **Home** Silk editorial layout with CMS driven hero copy, features, specialties, gallery highlights, and a closing call to action
- **Sample Cakes** Desktop sugar orbit: every cake sits on a rotating ring and can be focused into a center lens. Mobile uses a compact carousel. Tap to enlarge
- **Reviews** Desktop whisper table: sealed notes scattered on a tabletop; pick one up to read. Mobile uses a compact carousel. Guests can submit a title, description (max 500 characters), optional name, and optional image
- **About** Baker story, services, working hours, contact details, and FAQ accordion
- **Contact** Consultation form with date and time picker

**Build and Preview (work in progress)**
- Visual pastry designer and 3D preview pages exist in the repo (`/build`, `/preview`) and are still being finished. Lead capture and design payload wiring are partially in place. Keep this area as WIP

**Admin**
- JWT auth with HTTP only cookies and bcrypt password hashing
- Shared admin shell with overview, images, content, and settings
- Hero and gallery image upload, replace, and delete
- Home and About content editing with per section save
- Default credentials: `admin` / `admin` (change after first login)

**Technical notes**
- Next.js Pages Router with API routes
- Upstash Redis for credentials, image registry, content, and reviews
- Mobile first responsive layout (768px breakpoint for several desktop only interactions)
- Scroll triggered motion via `react-intersection-observer`

### Technologies and Libraries

**Core**
- React 18
- Next.js 15 (Pages Router)
- TypeScript
- SASS

**UI**
- React Icons
- Reactstrap (forms)
- React DatePicker (consultation)
- React Intersection Observer

**Auth and data**
- jsonwebtoken
- bcryptjs
- @upstash/redis
- formidable (uploads)
- uuid (unique file and review ids)

**Build and Preview WIP**
- three
- @react-three/fiber
- @react-three/drei

[Back To The Top](#sweet-dreams-bakery)

---

## Future Features

Planned additions that are realistic and high value for the bakery:

1. **Admin orders for Build requests**
   Finish saving the design, then show pending or completed requests in admin with contact and pastry details. Turns the work in progress builder into something the baker can actually use.

2. **Email alerts for new leads**
   Notify on consultation, review, and build submit. Fastest way to stop missing orders without building a full CRM.

3. **Cloud image storage**
   Move gallery and review uploads off local disk (for example Vercel Blob). Fixes a real production reliability problem and unlocks safer image management.

4. **Review moderation**
   Public submit goes to pending, then admin can approve or delete. Protects the brand while keeping social proof.

5. **How ordering works and soft pricing bands**
   A clear three to four step process and soft pricing ranges or simple quote tiers from Build options. Builds trust and cuts back and forth before the consult with no cart or payments required.

[Back To The Top](#sweet-dreams-bakery)

---

## Build steps

Planned customer flow for the **Build** designer after the lead form: pick a **pastry type**, then complete **substeps** that apply only to that type. Flavor and finish lists are **per type** (not one global menu).

### Step 1: Pastry type

Choose **one** of (max five): **Cake**, **Cookie**, **Pie**, **Cupcake**, **Brownie**.

### Cake (substeps)

1. **Layer flavor** (baked layers): vanilla, chocolate, red velvet, marble, funfetti, lemon, carrot.
2. **Number of tiers** (numeric input; min and max set with the bakery).
3. **Layers per tier** (numeric input; min and max set with the bakery).
4. **Size or servings** (guest count and/or standard sizes; exact control TBD with the bakery).
5. **Filling** between layers (dropdown; options TBD with the bakery).
6. **Frosting**: buttercream, chocolate buttercream, cream cheese, whipped cream, fondant, ganache, naked or semi naked.
7. **Colors / theme** (short optional text).
8. **Toppings and decorations** (curated checkboxes plus optional longer description).
9. **Message on the cake** (short single line; character limit TBD).
10. **Event / needed by date** (and pickup or delivery note if needed).
11. **Dietary / allergies** (compact checkboxes or text).

If the type changes later in the flow, **reset** fields that no longer apply (for example flavor and shape specific options).

### Cookie (substeps)

1. **Flavor or variety** (dropdown; options TBD with the bakery).
2. **Quantity** (for example dozens or count; input style TBD).
3. **Mix ins, toppings, or finish** (curated options plus optional description; TBD).
4. **Packaging** (optional, if offered).
5. **Occasion note or short message** (optional).
6. **Event / needed by date**.
7. **Dietary / allergies**.

### Pie (substeps)

1. **Pie flavor or variety** (dropdown; options TBD).
2. **Size** (for example whole; options TBD).
3. **Toppings or crust / finish style** (curated; TBD).
4. **Colors / theme** (optional short text).
5. **Event / needed by date**.
6. **Dietary / allergies**.

### Cupcake (substeps)

1. **Cupcake flavor** (dropdown; can align with cake layer flavors where it makes sense; final list TBD).
2. **Quantity**.
3. **Frosting** (same general categories as cake where applicable; list TBD).
4. **Toppings and decorations** (curated plus optional description).
5. **Message or topper text** (optional short line).
6. **Event / needed by date**.
7. **Dietary / allergies**.

### Brownie (substeps)

1. **Brownie flavor or style** (dropdown; options TBD).
2. **Quantity or batch / pan size** (TBD with the bakery).
3. **Toppings or finish** (for example frosting, drizzle, nuts; curated; TBD).
4. **Event / needed by date**.
5. **Dietary / allergies**.

[Back To The Top](#sweet-dreams-bakery)

---

## How To Use

### Installation

1. Fork or clone the repository
2. Navigate to the project folder: `cd nandos-cakes`
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Development Commands

- `npm run dev` Start development server with hot reload
- `npm run build` Create production build
- `npm start` Run production build locally
- `npm run lint` Run ESLint

### Admin Access

1. Open any page and choose Admin Login in the navigation
2. Default credentials:
   - Username: `admin`
   - Password: `admin`
3. Change the default credentials right after first login
4. Admin routes:
   - `/admin` Overview
   - `/admin/settings` Update username and password
   - `/admin/images` Hero and gallery images
   - `/admin/content` Home and About copy

### Environment Variables

Create a `.env.local` file in the root directory:

```env
JWT_SECRET=your-secret-key-change-in-production
KV_REST_API_URL=https://your-redis-instance.upstash.io
KV_REST_API_TOKEN=your-redis-token
```

**Required for production (Vercel)**
- `JWT_SECRET` Secret for signing JWT tokens
- `KV_REST_API_URL` Upstash Redis REST API URL
- `KV_REST_API_TOKEN` Upstash Redis REST API token

Create a Redis database in Upstash and add those values to Vercel environment variables.

### Project Structure

```
nandos-cakes/
├── pages/                 Next.js pages and API routes
│   ├── api/               Auth, images, content, reviews, build requests
│   ├── admin/             Admin screens
│   ├── build.tsx          WIP designer entry
│   └── preview.tsx        WIP 3D preview entry
├── src/
│   ├── components/        UI, admin shell, build designer, preview canvas
│   ├── pages/             Page views (Home, Sample Cakes, Reviews, and more)
│   └── styles/            SCSS partials
├── public/img/            Cake and review images
├── lib/                   Auth, Redis helpers, constants, build catalog
└── package.json
```

### Deployment

**Live site:** [bakery-ec.vercel.app](https://bakery-ec.vercel.app)

Deployed on Vercel:

1. Push code to GitHub
2. Import the project in Vercel
3. Set Framework Preset to Next.js
4. Add the environment variables above
5. Deploy

On first deploy, Redis initializes with defaults. Log in as admin to set content and images.

## License

MIT License

Copyright (c) [2026] [Eric Capiz]

[Back To The Top](#sweet-dreams-bakery)

---

## Author Info

- LinkedIn [@ericcapiz](https://www.linkedin.com/in/eric-capiz/)

[Back To The Top](#sweet-dreams-bakery)
