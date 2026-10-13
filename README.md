# SmartOmni frontend

This repository currently contains the SmartOmni public Landing Page and route-ready authentication placeholders. The Merchant Portal and backend integration are outside this milestone.

## Run locally

```sh
npm install
npm run dev
```

Open `http://127.0.0.1:5174/`. Use `npm run build`, `npm run lint`, and `npm run test:e2e` to validate the implementation. The end-to-end tests require `npx playwright install chromium` once.

## Structure

- `src/app/`: route definitions and fallback page
- `src/layouts/`: shared route layout
- `src/features/landing/`: Landing Page, sections, preview components and copy
- `src/features/auth/`: honest sign-in and registration placeholders
- `src/shared/ui/`: JavaScript shadcn/ui Button, Dialog and Tabs primitives
- `src/shared/components/`: shared SmartOmni brand
- `src/mocks/`: illustrative marketing fixtures, never live marketplace data
- `src/services/adapters/`: view-model boundary for preview data
- `src/styles/`: Tailwind import, theme tokens and global typography/reset

Every custom visual component has a colocated `.module.css` file. Tailwind handles simple utility styles in the shared shadcn/ui primitives; CSS Modules own custom layout, Liquid Glass, rainbow CTA and dashboard compositions.

## API integration boundary

No HTTP API is called in this milestone, so `axios` and `src/services/api/` are intentionally deferred. When an approved feature first requires HTTP, add a centralized Axios instance at `src/services/api/axiosClient.js`, endpoint paths at `src/services/api/endpoints.js`, and only the corresponding domain module (`auth.api.js`, `tenant.api.js`, `product.api.js`, `order.api.js`, `inventory.api.js`, `marketplace.api.js`, or `sync.api.js`). JSX components must call feature-level logic or adapters, never Axios directly. Endpoint paths, payloads, auth handling and response mapping remain provisional until the Product Owner approves API contracts.

