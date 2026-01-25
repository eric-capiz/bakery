# Sweet Dreams Bakery

![Project Image](https://i.ibb.co/cPTphPC/s.jpg)

> This project was done for a bakery start up business where users can look at sample cakes and contact the owner to place orders.

---

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Technologies/Libraries](#technologieslibraries)
- [How To Use](#how-to-use)
- [Admin Access](#admin-access)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [License](#license)
- [Author Info](#author-info)

---

## Description

I developed this site for a custom bakery business specializing in personalized cakes for any occasion. The site features a gallery of sample cakes, customer reviews, and a consultation booking system to help customers place orders.

### Features

**Public Features:**
- **Home Page** - Hero section with customizable tagline and subtitle, features showcase, and specialties section
- **Sample Cakes Gallery** - Dynamic gallery displaying all available cake images (35-50 images supported)
- **Reviews Page** - Public review submission system with optional image uploads and names
  - Users can submit reviews with title, description (max 500 chars), optional name, and optional image
  - Reviews auto-post without admin approval
  - Displays newest reviews first
  - Anonymous display for reviews without names
- **About Page** - Detailed baker information including:
  - Meet the Baker introduction
  - Experience & Education section
  - "What I Bake" items list
  - Working Hours & Contact information
  - FAQ section with accordion-style layout
- **Contact Page** - Consultation booking form with date/time picker

**Admin Features:**
- **Secure Authentication System**
  - JWT token-based authentication with HTTP-only cookies
  - Password hashing with bcryptjs
  - Admin can update username and password
  - Default credentials: admin/admin (changeable)
- **Image Management**
  - Hero image management (must always have an image, defaults to cake1.jpg)
  - Gallery images management (upload, replace, delete)
  - Supports 35-50 images
  - File-based storage (images stored in `/public/img/Cakes/`)
- **Content Management System**
  - **Home Page Content:**
    - Edit hero tagline and subtitle
    - Manage features (with emoji selector for icons)
    - Edit specialties descriptions
  - **About Page Content:**
    - Edit baker introduction text
    - Update experience & education information
    - Edit working hours (per day)
    - Update contact email and phone
    - Manage "What I Bake" items (add/edit/delete, max 20 items)
    - Manage FAQ questions (add/edit/delete, max 10 questions)
  - Per-section save buttons (no auto-save)
  - All changes persist to JSON files on the server

**Technical Highlights:**
- Complete Next.js migration from Create React App
- Server-side API routes for all admin operations
- File-based data storage (JSON files in `/data/` directory)
- Secure admin authentication with session management
- Mobile-responsive design with hamburger menu (768px breakpoint)
- CSS animations using `react-intersection-observer` for scroll-triggered effects

### Technologies/Libraries

**Core Framework:**
- React 18.3.1
- Next.js 15.1.3 (Pages Router)
- TypeScript 5.9.3

**Styling & UI:**
- SASS (SCSS)
- Reactstrap (for form components)
- React Icons (for icons)
- FontAwesome (for service icons)

**Authentication & Security:**
- jsonwebtoken (JWT tokens for admin sessions)
- bcryptjs (password hashing)
- HTTP-only cookies (secure session storage)

**File Handling:**
- formidable (for file uploads)
- uuid (for generating unique file names)

**UI Components & Animations:**
- React DatePicker (for consultation form)
- React Intersection Observer (for scroll-triggered animations)

**Data Storage:**
- File-based JSON storage (no database required)
- Images stored in `/public/img/` directory
- Data files in `/data/` directory (admin credentials, images registry, content, reviews)

[Back To The Top](#sweet-dreams-bakery)

---

## How To Use

### Installation

1. Fork/Clone the repository
2. Navigate to the project folder: `cd nandos-cakes`
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Create production build
- `npm start` - Run production build locally
- `npm run lint` - Run ESLint

### Admin Access

1. Navigate to any page and click "Admin Login" in the navigation
2. Default credentials:
   - Username: `admin`
   - Password: `admin`
3. **Important:** Change the default credentials immediately after first login
4. Access admin features:
   - **Admin Panel** (`/admin`) - Main dashboard
   - **Update Credentials** (`/admin/settings`) - Change username/password
   - **Manage Images** (`/admin/images`) - Upload/replace/delete hero and gallery images
   - **Manage Content** (`/admin/content`) - Edit all site content

### Environment Variables

Create a `.env.local` file in the root directory (optional):

```env
JWT_SECRET=your-secret-key-change-in-production
```

If not provided, a default secret will be used (not recommended for production).

### Project Structure

```
nandos-cakes/
├── pages/              # Next.js pages and API routes
│   ├── api/           # API endpoints
│   │   ├── auth/      # Authentication routes
│   │   ├── images/    # Image management routes
│   │   ├── content/   # Content management routes
│   │   └── reviews/   # Review submission/deletion routes
│   └── admin/         # Admin panel pages
├── src/
│   ├── components/    # React components
│   ├── pages/         # Page components
│   └── styles/        # SCSS stylesheets
├── public/
│   └── img/           # Static images (Cakes, reviews)
├── data/              # JSON data files (auto-generated)
│   ├── admin.json    # Admin credentials
│   ├── images.json   # Image registry
│   ├── content.json  # Site content
│   └── reviews.json  # User reviews
└── package.json
```

### Deployment

This project is ready for deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Set Framework Preset to "Next.js"
4. Add environment variable `JWT_SECRET` if using custom secret
5. Deploy!

**Note:** The `/data/` directory is gitignored. On first deployment, the JSON files will be auto-generated with default values. Admin will need to log in and configure content/images.

## License

MIT License

Copyright (c) [2026] [Eric Capiz]

[Back To The Top](#sweet-dreams-bakery)

---

## Author Info

- LinkedIn - [@ericcapiz](https://www.linkedin.com/in/eric-capiz/)

[Back To The Top](#sweet-dreams-bakery)
