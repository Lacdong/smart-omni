# Authentication and role-based registration prototype

## Implemented routes

- `/auth/login`: real form interactions, local validation, truthful unconnected-service message.
- `/auth/register`: account type selection (Owner / Staff).
- `/auth/register/staff`: four-field registration and pending-invitation preview.
- `/auth/register/owner`: six-field basic information.
- `/auth/register/owner/plan`: Free / Pro selection.
- `/auth/register/owner/channels`: connection and separate shop confirmation demo.
- `/auth/register/owner/import`: required initial synchronization preview.
- `/auth/register/owner/welcome`: gated Welcome preview with disabled Dashboard CTA.

Landing and the existing 404 route remain unchanged. No Merchant route is implemented.

## Current requirements authority and discrepancies

The latest Authentication & Role-Based Registration prompt supersedes the earlier simple Login/Register task and conflicting older document flows for this implementation.

- MASTER_PLAN sections 5-6 previously separated account registration, role selection, profile completion, and Tenant initialization. The new direction starts with role selection and explicitly groups Owner personal/store/security details in Basic Information. Staff collects Full Name, Email, Password, and Confirm Password. Owner also collects Store Name and Target Domain. These are UI fields, not completed account/profile/Tenant operations.
- MASTER_PLAN section 17 recommended `/onboarding/*` and `/auth/register/profile`. The approved current routes place the five Owner stages under `/auth/register/owner/*` instead.
- MASTER_PLAN section 9 describes auto-starting initial sync after successful shop confirmation. The new flow includes an Initial Import review stage. The prototype explicitly starts a controlled sync preview there, without asserting a real job started or changing production auto-start requirements.
- Older UC-17/navigation documents combine Tenant, business/subdomain and plan creation. The current flow keeps all operations visibly simulated, with no real Tenant creation.
- Legacy documents describe a SmartOmni subdomain; the final host/domain contract is unresolved under D19. Target Domain remains a neutral intended address, with required-field validation only. No suffix, availability result, verification, reservation, or arbitrary domain-format rule is introduced.
- Free's total one-shop limit is approved. Pro pricing, trial, limits and entitlements remain TBD (D08/D24). The Pro demo's two sample marketplace fixtures do not establish production limits.
- Password length/complexity remains TBD. Only presence and confirmation equality are checked. Password values are never trimmed or transformed. Email shape is checked locally; verification, uniqueness and normalization remain backend responsibilities.

## Prototype boundaries

All Owner state is in a React reducer/context scoped to the Owner route subtree. Role choice is a frontend path, not account authorization. Public wizard fields are whitelisted; passwords and confirmation values are component-local and cleared when proceeding. No credentials, fake tokens, roles, or wizard progress are written to localStorage, sessionStorage, URLs, or logs.

Refresh starts over. Leaving the Owner subtree discards its state. Back/stepper navigation inside the subtree preserves submitted non-credential details; returning to Basic Information requires re-entering passwords. Changed basic details or plan selection clears dependent channels/import state. Changing or removing any shop invalidates the previous import result. Restart preview clears everything, including local form values.

Direct routes are redirected to the first unmet prerequisite. Basic information must be validated before selecting a plan; a plan is required before channels; at least one confirmed demo shop is required before import; only COMPLETED unlocks Welcome. Pending connections are never counted as confirmed. Browser-history navigation rechecks the gate, including after retry/reset. These guards maintain prototype consistency, not backend security.

The demo adapter is synchronous and deterministic, without API calls, OAuth endpoints, fake delays, or random outcomes. Connection fixtures use local demo keys rather than real shop IDs. Every connection/confirmation result is labeled demo. Free prevents a second connection across all marketplaces, including while the first awaits confirmation. Pro shows one sample fixture per marketplace, with production limits explicitly unresolved.

Import supports NOT_STARTED, IN_PROGRESS, COMPLETED, PARTIAL, and FAILED. In progress is deliberately paused for an explicit scenario choice. Completed shows 12 illustrative successful records; partial shows 8 successful and 4 needing attention; failed shows 0 successful and 12 needing attention for that simulated attempt. Counts are scenario examples, not cumulative or real import records. Partial/failed remain locked; retry resets the preview before choosing another result.

Staff valid submission shows an informational pending-invitation preview, never an account-created success message. No invitation fixture or working acceptance action is created. Real access requires an authoritative ACTIVE membership.

Welcome is labeled as a preview. Go to Dashboard is disabled with an explanation of the authentication/onboarding dependencies. No protected page is exposed.

## UI and accessibility

AuthLayout is reused for login, role selection and Staff. OwnerOnboardingLayout gives the wizard a wider centered canvas, five-step desktop navigation and compact mobile progress. Brand, shadcn Button, existing font and global colors are reused. Inputs and primary form controls are 48px; mobile input text is at least 16px. Inline errors are connected with aria-describedby and live regions; invalid submission focuses the first invalid field. Password and confirmation visibility controls are independent. Radio plans and role controls work with the keyboard. Focus remains visible. Reduced motion is supported.

Light theme remains consistent with the landing page; no new dark mode is introduced. Shared font/colors are in `src/styles/index.css`, Brand artwork in `src/shared/components/Brand.module.css`, auth showcase accents in `AuthShowcase.module.css`, and wizard progress lighting in `OnboardingStepper.module.css`. Showcase/connection/import data is static illustrative data.

The existing gradient Brand causes probe P1 to interpret gradient-clipped logo lettering as normal foreground text on a gradient-stop background. This is excluded as an ordinary-text contrast finding; Brand is preserved. Compact text inside the static miniature showcase and the existing shared decorative border retain landing-page styling. Interactive forms have explicit labels and readable text.

## Backend-dependent TODOs

- Finalize account registration and owner/staff authorization contracts, password policy, email verification/uniqueness, and D13 session/lock/recovery behavior.
- Replace demo adapter operations with approved marketplace authentication and shop verification; enforce limits and ownership server-side.
- Finalize Target Domain semantics and availability/verification behavior (D19).
- Finalize Pro pricing/entitlements and any billing flow separately (D08/D24).
- Connect authoritative sync jobs/results, retries and partial-record persistence; only actual COMPLETED may unlock onboarding.
- Connect Staff invitation retrieval/review/acceptance and authoritative ACTIVE membership.
- Build real Tenant initialization and authenticated Merchant access before enabling Dashboard navigation.

## Validation

Run `npm run lint`, `npm run build`, and `npm run test:e2e`. Tests cover login, role selection, Staff validation, six Owner fields, plans, Free's cross-marketplace limit, explicit shop confirmation, every import state, Welcome gate, stale browser history, direct routes, reset/refresh/exit, no fake authentication/storage/requests, and all five stages at 320/375/768/1440px. Screenshots are generated under the ignored `artifacts/onboarding/` directory for visual review.

Final validation result: `npm run lint` passed, `npm run build` passed, and `npm run test:e2e` passed 31/31 tests. UI/UX probe found no overflow while sweeping intermediate Owner Basic Information widths. Wizard text-contrast findings were corrected with a scoped derived muted color; the retained P1 is the existing stylized Brand logo described above. Desktop/mobile screenshots of all stages were visually inspected.
