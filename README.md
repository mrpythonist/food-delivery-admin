# Admin Dashboard — Food Delivery System

A complete **admin panel** for managing a food delivery platform. It provides a central
dashboard and management interfaces for orders, products, categories, customers, riders,
coupons, reports, abandoned carts, notifications and store settings.

This is one of three components in the `food-delivery-system` monorepo:

| Component | Tech | Purpose |
|-----------|------|---------|
| `admin-dashboard` | **React + Vite + MUI** | This repository — management UI for staff/admins |
| `backend` | **Laravel 13 (PHP 8.4)** | REST API powering all components |
| `customer-app` | **Expo / React Native** | Customer-facing mobile ordering app |

---

## What it's for

The dashboard lets restaurant/platform operators run the day-to-day business from one place:

- **Dashboard** — key metrics, income area chart, monthly bar chart, recent orders, unique visitor stats.
- **Orders** — browse, filter and manage orders; view full order details; create new
  multi-step orders (customer → items → address → payment → review); update status.
- **Products & Variants** — manage the menu, product variants and images (with uploads).
- **Categories** — organize products into categories.
- **Customers** — manage customers and their addresses, view customer details.
- **Riders** — manage delivery riders and their details.
- **Coupons** — create/delete discount coupons.
- **Reports** — sales summary, stats cards, orders-by-status chart, top products, date filtering.
- **Abandoned Carts** — see customers' abandoned carts and their items.
- **Notifications** — view the notification list.
- **Settings** — store configuration, including opening hours.
- **Authentication** — login/register flows with protected routes (AuthGuard) and guest access.

---

## Technologies used

**Core**
- [React 19](https://react.dev) — UI library
- [Vite 8](https://vitejs.dev) — build tool / dev server
- [React Router v7](https://reactrouter.com) — routing
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) — Fast Refresh

**UI / Styling**
- [MUI (Material UI) v9](https://mui.com) — component library
- `@mui/x-data-grid` — data tables
- `@mui/x-charts` — charting
- `@emotion/react` & `@emotion/styled` — CSS-in-JS (MUI styling engine)
- `@ant-design/icons` & `@ant-design/colors` — icons & colors
- `@fontsource/public-sans` — font
- `framer-motion` — animations
- `simplebar-react` — scrollbars

**Data / Forms / State**
- [Axios](https://axios-http.com) — HTTP client (wrapped in `src/api/`)
- [SWR](https://swr.vercel.app) — data fetching & caching hooks
- [Formik](https://formik.org) + [Yup](https://github.com/jquense/yup) — form state and validation
- `react-number-format` — number/currency inputs
- `lodash-es` — utilities

**Dev / Quality**
- [ESLint](https://eslint.org) + ESLint plugins (react, react-hooks, jsx-a11y, prettier)
- [Prettier](https://prettier.io)
- [Yarn 4](https://yarnpkg.com) (Berry) — package manager
- [Knip](https://knip.dev) — unused-code detection

**Deployment**
- [Docker](https://www.docker.com) + `docker-compose` (see repo root `docker-compose.yml`)

---

## Project structure

```
admin-dashboard/
├── src/
│   ├── api/            # Axios-based API clients (orders, products, customers, …)
│   ├── assets/         # images, third-party styles
│   ├── components/     # reusable UI (guards, cards, extended MUI components)
│   ├── hooks/          # SWR data hooks (useOrders, useProducts, useAuth, …)
│   ├── layout/         # dashboard shell, navigation, header
│   ├── menu-items/     # sidebar navigation definitions
│   ├── pages/          # route-level pages (dashboard, orders, products, …)
│   ├── routes/         # router setup (Main / Login routes)
│   ├── sections/       # feature-specific components per page
│   ├── services/       # auth storage etc.
│   ├── themes/         # MUI theme, palette, typography, component overrides
│   ├── utils/          # helpers (export CSV, print invoice, order status, …)
│   ├── App.jsx
│   ├── config.js
│   └── index.jsx
├── index.html
├── vite.config.mjs
├── jsconfig.json       # path aliases (src -> *)
├── eslint.config.mjs
├── .prettierrc
├── Dockerfile
└── package.json
```

---

## Prerequisites

- **Node.js** — v20+ (the Dockerfile uses `node:20.20.2`)
- **Yarn 4** — or npm (a `yarn.lock` is committed; `packageManager` is `yarn@4.14.1`)
- **The backend running** — the dashboard talks to the Laravel API at `VITE_API_URL`
  (see `src/api/axios.js` and the `.env`). Without it, requests will fail.

---

## Environment variables

Create a `.env` file in the project root with the following keys (the repo ignores
`.env`, so it won't be committed):

```env
# Base URL of the Laravel REST API
VITE_API_URL=http://localhost:8000/api

# Base URL where uploaded files (images) are publicly served
VITE_STORAGE_URL=http://localhost:8000/storage
```

Both values are read by Vite at build/dev time. Point them at your running backend.

---

## Setup & running locally

### 1. Install dependencies

```bash
# with Yarn 4
yarn install

# or with npm
npm install --legacy-peer-deps
```

### 2. Configure the environment

Create the `.env` file (copy the keys from the [Environment variables](#environment-variables)
section above) and adjust the URLs to your backend:

```bash
cat > .env <<'EOF'
VITE_API_URL=http://localhost:8000/api
VITE_STORAGE_URL=http://localhost:8000/storage
EOF
```

### 3. Start the dev server

```bash
yarn dev
# or
npm run dev
```

Vite starts a dev server on **http://localhost:5173** and opens the browser
automatically. There is also a Vite config that resolves `jsconfig` path aliases, so
imports like `import Dashboard from 'pages/dashboard'` work out of the box.

### 4. Build for production

```bash
yarn build
# or
npm run build
```

The output is emitted to `dist/`. Serve it with any static file host.

```bash
yarn preview   # preview the production build locally
```

---

## Running with Docker (recommended for full stack)

The dashboard is designed to run alongside the backend and database via
`docker-compose.yml` at the repository root. See `../../DOCKER_SETUP.md` for details.

```bash
# from the food-delivery-system/ root
docker compose up --build
```

| Service | Port | URL |
|---------|------|-----|
| Postgres | 5432 | `postgres://food_user:strongpassword@localhost:5432/food_delivery` |
| Redis | 6379 | — |
| Laravel backend | 8000 | http://localhost:8000/api |
| Admin dashboard (Vite) | 5173 | http://localhost:5173 |
| Expo app | 8081 | QR code (Expo Go) |

The dashboard's `Dockerfile` is a dev-focused image:

```dockerfile
FROM node:20.20.2-bookworm-slim
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* ./
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 5173
ENV CHOKIDAR_USEPOLLING=true
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
```

When run through compose, `VITE_API_URL` is injected as
`http://localhost:8000/api` and `node_modules` lives in a named Docker volume
(`admin_node_modules`) so host-built dependencies don't clash with the container.

---

## Scripts

| Script | Description |
|--------|-------------|
| `yarn dev` | Start the Vite dev server |
| `yarn build` | Create a production build in `dist/` |
| `yarn preview` | Preview the production build locally |
| `yarn lint` | Run ESLint on `src/**/*.{js,jsx,ts,tsx}` |
| `yarn lint:fix` | Run ESLint and auto-fix issues |
| `yarn prettier` | Format source files with Prettier |

---

## Authentication

- Login/Register flows live under `pages/auth` with a guest wrapper (`GuestGuard`).
- Authenticated pages are wrapped in `AuthGuard` which protects the main dashboard
  layout and redirects unauthenticated users to login.
- The auth token is stored via `services/authStorage.js`.

---

## Contribution / development notes

- The codebase uses **JavaScript (JSX)** with path aliases (`src/*`) defined in
  `jsconfig.json` and resolved by `vite-jsconfig-paths`.
- Data fetching is done with **SWR hooks** (`src/hooks/`) wrapping the API clients in
  `src/api/`.
- Themes and MUI overrides are centralized under `src/themes/`; add global component
  styles there rather than inline.
- Run `yarn lint` and `yarn prettier` before committing. The repo also includes Knip
  (`npx knip`) for detecting unused files/exports.

---

## Author

**Muhammad Aqib**
- Email: muhammadaqib5475@gmail.com
- Portfolio: https://mrpythonist.vercel.app/
