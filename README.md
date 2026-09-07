# Admin Dashboard — Food Delivery System

A complete **admin panel** for managing a food delivery platform. It provides a central dashboard and management interfaces for orders, products, categories, customers, riders, coupons, reports, abandoned carts, notifications, and store settings.

This is one of three components in the `food-delivery-system` monorepo:

| Component         | Tech                     | Purpose                             |
| ----------------- | ------------------------ | ----------------------------------- |
| `admin-dashboard` | **React + Vite + MUI**   | Management UI for staff/admins      |
| `backend`         | **Laravel 13 (PHP 8.4)** | REST API powering all components    |
| `customer-app`    | **Expo / React Native**  | Customer-facing mobile ordering app |

---

## Screenshots

The admin dashboard provides dedicated interfaces for managing the complete food delivery operation.

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Orders

![Orders](screenshots/orders.png)

### Products

![Products](screenshots/products.png)

### Categories

![Categories](screenshots/categories.png)

### Customers

![Customers](screenshots/customers.png)

### Riders

![Riders](screenshots/riders.png)

### Coupons

![Coupons](screenshots/coupons.png)

### Abandoned Carts

![Abandoned Carts](screenshots/carts.png)

### Reports

![Reports](screenshots/reports.png)

### Settings

![Settings](screenshots/settings.png)

---

## What It's For

The dashboard lets restaurant and platform operators manage their day-to-day business from one central interface.

### Dashboard

* View key business metrics.
* Monitor income through an area chart.
* View monthly performance through a bar chart.
* Monitor recent orders.
* Track unique visitor statistics.

### Orders

* Browse and filter orders.
* View complete order details.
* Manage order statuses.
* Create new orders through a multi-step workflow:

  * Customer
  * Items
  * Address
  * Payment
  * Review

### Products & Variants

* Create and manage products.
* Manage product variants.
* Upload and manage product images.
* Organize menu items.

### Categories

* Create and manage product categories.
* Organize products into logical categories.

### Customers

* Manage customers.
* View customer details.
* Manage customer addresses.

### Riders

* Manage delivery riders.
* View rider details.

### Coupons

* Create discount coupons.
* Delete existing coupons.
* Manage promotional discounts.

### Reports

* View sales summaries.
* Monitor statistics.
* View orders by status.
* Analyze top-selling products.
* Filter reports by date.

### Abandoned Carts

* View abandoned customer carts.
* Inspect items left in abandoned carts.

### Notifications

* View notification lists.
* Monitor platform notifications.

### Settings

* Configure store settings.
* Manage store opening hours.
* Maintain platform configuration.

### Authentication

* Login and registration flows.
* Protected routes using `AuthGuard`.
* Guest-only access using `GuestGuard`.
* Authentication token storage.

---

## Technologies Used

### Core

* [React 19](https://react.dev) — UI library
* [Vite 8](https://vitejs.dev) — Build tool and development server
* [React Router v7](https://reactrouter.com) — Application routing
* [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) — React Fast Refresh

### UI / Styling

* [MUI (Material UI) v9](https://mui.com) — Component library
* `@mui/x-data-grid` — Data tables
* `@mui/x-charts` — Charts and data visualization
* `@emotion/react` — CSS-in-JS
* `@emotion/styled` — MUI styling engine
* `@ant-design/icons` — Icons
* `@ant-design/colors` — Color utilities
* `@fontsource/public-sans` — Public Sans font
* `framer-motion` — Animations
* `simplebar-react` — Custom scrollbars

### Data / Forms / State

* [Axios](https://axios-http.com) — HTTP client wrapped in `src/api/`
* [SWR](https://swr.vercel.app) — Data fetching and caching
* [Formik](https://formik.org) — Form state management
* [Yup](https://github.com/jquense/yup) — Form validation
* `react-number-format` — Number and currency inputs
* `lodash-es` — Utility functions

### Development / Quality

* [ESLint](https://eslint.org) — Code linting
* [Prettier](https://prettier.io) — Code formatting
* [Yarn 4](https://yarnpkg.com) — Package management
* [Knip](https://knip.dev) — Unused-code detection

### Deployment

* [Docker](https://www.docker.com) — Containerization
* Docker Compose — Full-stack local development

---

## Project Structure

```text
admin-dashboard/
├── docs/
│   └── screenshots/
│       ├── carts.png
│       ├── categories.png
│       ├── coupons.png
│       ├── customers.png
│       ├── dashboard.png
│       ├── orders.png
│       ├── products.png
│       ├── reports.png
│       ├── riders.png
│       └── settings.png
├── src/
│   ├── api/            # Axios-based API clients
│   ├── assets/         # Images and third-party styles
│   ├── components/     # Reusable UI components
│   ├── hooks/          # SWR data hooks
│   ├── layout/         # Dashboard shell, navigation and header
│   ├── menu-items/     # Sidebar navigation definitions
│   ├── pages/          # Route-level pages
│   ├── routes/         # Router configuration
│   ├── sections/       # Feature-specific components
│   ├── services/       # Authentication and storage services
│   ├── themes/         # MUI theme and component overrides
│   ├── utils/          # Utility functions
│   ├── App.jsx
│   ├── config.js
│   └── index.jsx
├── index.html
├── vite.config.mjs
├── jsconfig.json       # Path aliases
├── eslint.config.mjs
├── .prettierrc
├── Dockerfile
└── package.json
```

---

## Prerequisites

Before running the admin dashboard locally, make sure you have:

* **Node.js** — v20+
* **Yarn 4** — or npm
* **Backend API** — Laravel backend must be running

The Dockerfile currently uses:

```text
node:20.20.2
```

The project uses Yarn 4. The committed `yarn.lock` and `packageManager` configuration specify:

```text
yarn@4.14.1
```

The dashboard communicates with the Laravel backend through the `VITE_API_URL` environment variable.

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Base URL of the Laravel REST API
VITE_API_URL=http://localhost:8000/api

# Base URL where uploaded files are publicly served
VITE_STORAGE_URL=http://localhost:8000/storage
```

### Environment Variable Reference

| Variable           | Description                           | Example                         |
| ------------------ | ------------------------------------- | ------------------------------- |
| `VITE_API_URL`     | Base URL of the Laravel REST API      | `http://localhost:8000/api`     |
| `VITE_STORAGE_URL` | Public storage URL for uploaded files | `http://localhost:8000/storage` |

The `.env` file is ignored by Git and should not be committed.

Both variables are read by Vite during development and production builds.

---

## Setup & Running Locally

### 1. Install Dependencies

Using Yarn 4:

```bash
yarn install
```

Or using npm:

```bash
npm install --legacy-peer-deps
```

### 2. Configure Environment

Create the `.env` file:

```bash
cat > .env <<'EOF'
VITE_API_URL=http://localhost:8000/api
VITE_STORAGE_URL=http://localhost:8000/storage
EOF
```

Adjust the URLs if your backend is running on a different host or port.

### 3. Start the Development Server

Using Yarn:

```bash
yarn dev
```

Or using npm:

```bash
npm run dev
```

Vite starts the development server on:

```text
http://localhost:5173
```

The browser opens automatically when configured to do so.

The Vite configuration also resolves the path aliases defined in `jsconfig.json`, allowing imports such as:

```javascript
import Dashboard from 'pages/dashboard';
```

### 4. Build for Production

Using Yarn:

```bash
yarn build
```

Or npm:

```bash
npm run build
```

The production build is generated in:

```text
dist/
```

You can preview the production build locally with:

```bash
yarn preview
```

---

## Running With Docker

The admin dashboard is designed to run alongside the Laravel backend, PostgreSQL database, Redis, and customer application through the `docker-compose.yml` located at the repository root.

From the `food-delivery-system/` root directory:

```bash
docker compose up --build
```

### Services

| Service         |   Port | URL                                                                |
| --------------- | -----: | ------------------------------------------------------------------ |
| PostgreSQL      | `5432` | `postgres://food_user:strongpassword@localhost:5432/food_delivery` |
| Redis           | `6379` | —                                                                  |
| Laravel Backend | `8000` | `http://localhost:8000/api`                                        |
| Admin Dashboard | `5173` | `http://localhost:5173`                                            |
| Expo App        | `8081` | QR code / Expo Go                                                  |

### Dockerfile

The dashboard uses a development-focused Docker image:

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

When running through Docker Compose:

* `VITE_API_URL` is injected as `http://localhost:8000/api`.
* `node_modules` is stored in the named Docker volume `admin_node_modules`.
* Host-installed dependencies do not conflict with container dependencies.

For additional full-stack Docker configuration, see:

```text
../../DOCKER_SETUP.md
```

---

## Available Scripts

| Script          | Description                             |
| --------------- | --------------------------------------- |
| `yarn dev`      | Start the Vite development server       |
| `yarn build`    | Create a production build in `dist/`    |
| `yarn preview`  | Preview the production build            |
| `yarn lint`     | Run ESLint                              |
| `yarn lint:fix` | Run ESLint and automatically fix issues |
| `yarn prettier` | Format source files with Prettier       |

### Example

Run the development server:

```bash
yarn dev
```

Run linting:

```bash
yarn lint
```

Automatically fix lint issues:

```bash
yarn lint:fix
```

Format the project:

```bash
yarn prettier
```

---

## Authentication

Authentication is handled through dedicated authentication routes and route guards.

### Guest Routes

Login and registration flows are located under:

```text
src/pages/auth
```

Unauthenticated users can access these routes through the `GuestGuard`.

### Protected Routes

Authenticated dashboard pages are protected by `AuthGuard`.

The authentication flow ensures that:

* Unauthenticated users are redirected to the authentication page.
* Authenticated users can access the main dashboard.
* Guest-only pages are protected from authenticated users where applicable.

### Token Storage

The authentication token is managed through:

```text
src/services/authStorage.js
```

---

## API Architecture

The dashboard communicates with the Laravel backend through Axios-based API clients located under:

```text
src/api/
```

The API layer provides access to resources such as:

* Orders
* Products
* Categories
* Customers
* Riders
* Coupons
* Reports
* Carts
* Authentication
* Store settings

Data fetching and caching are handled through SWR hooks located under:

```text
src/hooks/
```

For example:

```text
src/hooks/
├── useOrders
├── useProducts
├── useCustomers
├── useAuth
└── ...
```

This separates API communication and data-fetching logic from the UI components.

---

## UI Architecture

The dashboard uses **Material UI (MUI)** as its primary component system.

The project organizes reusable UI functionality into:

```text
src/components/
```

Feature-specific UI is organized under:

```text
src/sections/
```

Page-level components are located under:

```text
src/pages/
```

The MUI theme, typography, palette, and component overrides are centralized under:

```text
src/themes/
```

This structure keeps global styling and reusable components separate from individual feature implementations.

---

## Routing

Application routing is configured under:

```text
src/routes/
```

The application separates:

* Main authenticated dashboard routes
* Authentication routes
* Guest routes
* Protected routes

The dashboard layout provides the shared:

* Sidebar navigation
* Header
* Content area
* Navigation structure
* Authentication protection

---

## Development Notes

### JavaScript / JSX

The codebase uses JavaScript and JSX rather than TypeScript.

Path aliases are defined through:

```text
jsconfig.json
```

and resolved using the Vite JSConfig paths configuration.

For example:

```javascript
import Dashboard from 'pages/dashboard';
```

### Data Fetching

SWR hooks are used for data fetching and caching.

API clients are located under:

```text
src/api/
```

while their corresponding data-fetching hooks are located under:

```text
src/hooks/
```

### Themes

Global MUI configuration is centralized under:

```text
src/themes/
```

Global component styles and MUI overrides should be added there rather than being duplicated across individual components.

### Utilities

Common functionality is located under:

```text
src/utils/
```

including utilities for:

* CSV exports
* Invoice printing
* Order statuses
* Formatting
* Other shared operations

---

## Code Quality

Before creating a commit, run the project's formatting and linting tools:

```bash
yarn lint
yarn prettier
```

To automatically fix ESLint issues:

```bash
yarn lint:fix
```

The project also includes [Knip](https://knip.dev) for detecting unused files and exports:

```bash
npx knip
```

---

## Related Components

This admin dashboard is part of the larger `food-delivery-system` monorepo.

### Admin Dashboard

```text
admin-dashboard/
```

React-based management interface for administrators and staff.

### Backend

```text
backend/
```

Laravel 13 REST API that provides the backend services for the platform.

### Customer App

```text
customer-app/
```

Expo / React Native mobile application used by customers to browse products and place orders.

---

## Full-Stack Architecture

```text
                    Food Delivery System
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
   Admin Dashboard       Backend         Customer App
   React + Vite + MUI   Laravel 13       Expo / React Native
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                    REST API / Services
                            │
                 ┌──────────┴──────────┐
                 │                     │
             PostgreSQL               Redis
```

---

## Contributing

When contributing to the admin dashboard:

1. Create a feature branch.
2. Make the required changes.
3. Follow the existing project structure.
4. Run linting.
5. Run formatting.
6. Test the affected functionality.
7. Verify API integration with the backend.
8. Submit the changes for review.

Before committing:

```bash
yarn lint
yarn prettier
```

For unused-code detection:

```bash
npx knip
```

---

## Author

**Muhammad Aqib**

* Email: [muhammadaqib5475@gmail.com](mailto:muhammadaqib5475@gmail.com)
* Portfolio: https://mrpythonist.vercel.app/
